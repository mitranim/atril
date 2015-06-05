For molds, demo how to make a live markdown component, and how to optimise it
for speed through the isDomImmutable convention (unlike `if.`, this property
will need to be set on the state of the template itself).

# Possible performance optimisations

Expressions are currently re-evaluated on each call. This is done in order to
support locals without inheriting a masking object from the scope (which works
fine for reads but breaks writes), or mutating the scope by assigning the locals
to it. Should look into ways to fix that.

Lots and lots of expressions are going to be just property references. Should be
easy to optimise this without writing an expression compiler. Should also
emulate the behaviour of other expressions when the property is not in scope
(throw a reference error).

`for.*` keeps references to unused virtual nodes for fast reuse. This is a
potential memory "leak" in a sense that if the viewmodel initially requires a
lot of nodes but later only needs a few, the stashed nodes only gunk up the
memory. Might want to keep track and discard nodes that have been unused for
many phases (keeping an average index as an integer should be enough).

Consider ways to localise reflow. Currently we reflow from each root. For
inputs, it would be great if we could figure out that the given reflow is caused
by an input event somewhere at the bottom of the tree, and reflow only that
part. Might be the biggest performance improvement we can make.

Kicking some reflow localisation ideas around. How about this:
* In addition to the virtual DOM structure, link `State` objects like a tree,
  with shorter paths that are faster to traverse than the DOM. Don't create
  State objects for nodes without interpolations, or custom attributes, or
  molds. Give each State a reference both to its real node _and_ its virtual
  node (surefire memory leak since the virtual node also references the state,
  but we have a destroy phase specifically to clean this up).
* The secondary tree is built during compilation and refreshed when recompiling
  mold outputs.
* After the first reflow pass, use this secondary tree to short-curcuit reflows
  by skipping "dumb" DOM paths. For each State, do the following:
  * Assert that its virtual node is in the expected place in the virtual DOM.
    The compile (and mold recompile) step runs before the phase step. It must
    correctly sync the state tree with any DOM changes caused by molds.
  * If this is a template, run the mold and recompile if necessary. Go to the
    next state.
  * Run interpolations or phase custom attributes, whatever is registered with
    this state.
  * When syncing changes to the live DOM, make an additional check for matching
    parent nodes. If they don't match, this is a signal that the live DOM
    structure has been unexpectedly altered in the intermittent path skipped
    before this state. In this case, travel up the hierarchy until we find a
    child/parent pair with a match in the real DOM (at their own location) and
    sync the DOM from there, falling back on the "raw" synchronisation strategy
    used in the first phase.
This doesn't allow us to fully localise reflows, but could significantly
decrease traversal time in documents with large numbers of dumb nodes.

Consider trying out `virtual-dom`.

# Transclusion semantics

Components and molds serve complementary roles.

A component creates a viewmodel isolated from the outer scope, and a template
that defines how that viewmodel should be rendered. Rendering is managed
automatically by atril, using the virtual DOM, and a component is not allowed
to mess with it, for efficiency and safety reasons.

A mold doesn't create a viewmodel. Because of that, it doesn't need to be
isolated from the outer DOM, and is allowed to mess with it in arbitrary ways.
For efficiency and stability, this is done through the virtual DOM, so a mold is
not allowed to mess with the real DOM.

No planned support for `<content selector="...">` because it can potentially
break things like `for.="..."` by changing the order of transcluded nodes in the
way uncontrollable by the outer element that relies on this particular order.

Transclusion with `<content>` is planned for components. The root element of the
transcluded content will receive a reference to the parent of the custom element
into which it was transcluded. When looking for a scope, we'll start from there.

Also considering the possibility of enabling a template and `<content>` for
molds. If a template is provided, it's parsed using the same mechanics as
component templates, with the difference that elemends transcluded with
`<content>` become a part of the local DOM and don't receive references to the
original parents (because a mold doesn't create a new scope). A potential
concern is that the template might reference potentially unavailable
identifiers, or make assumptions about available locals in the scope where it's
used. It's the same problem as `ng-include`. Still thinking this over.

# Planned `<content>` mechanics

Each root element in the transcluded content keeps a reference to the parent
from which it was taken. The parent may belong to the vanilla DOM (real) or the
virtual atril DOM.

When diffing a child during rendering, we check if it's transcluded.

If it's transcluded from the vanilla DOM, we pass it to a special recursive
diffing function outside of the component container. That function diffs the
content ignoring any custom attributes and giving no special treatment to the
template tags. It also has no access to interpolations from the virtual DOM.

If it's transcluded from the atril DOM, it's phased normally. The scope search
mechanism takes care of maintaining the link to the original viewmodel. It will
check for a link to the original parent, and if it finds one, it will start
scope search from there. This is also how we check if the element comes from the
vanilla DOM (if no viewmodel is found all the way up to `<html>`).

# Other ToDos

Consider providing a 'global.atril' export for scenarios without a module
environment.

Consider adding a "render-once" feature to embed DOM nodes managed by external
code (e.g. third party UI widgets with their own DOM logic). This could be done
by adding a `State` flag to completely skip phasing starting at the given
virtual node and its real counterpart. This needs to be usable without writing
custom molds, so we'll probably add a built-in.

Consider async queueing and batching of DOM updates via `requestAnimationFrame`.

Consider if we no longer need to reassign the autoassigned values in bindings
during each phase. Real nodes are now guaranteed to be mapped 1-1 to virtual
ones. Scopes should also be stable now.

Review the `this` strategy for expressions. Not convinced the flexibility is
worth having to correctly call them in attribute VMs.

When an event is bubbling up through multiple listeners registered from within
our zone context (e.g. with `on.*`), zone makes multiple `afterTask` calls. Need
to either (1) debounce reflows (is event propagation sync or async? if async,
this is a questionable solution), or (2) use a single document-level event
aggregator as the default way of handling events.

# Expressions

Considering a custom expression compiler. Will allow us to:
* Safeguard access to globals.
* May or may not allow to avoid reinterpreting the expression on each call.
* Property accessors can be compiled into faster functions than other expressions.

Considering to no longer autocompile expressions. Currently the only place where
they're used as expressions in the `bind.*` attribute, and the only place where
they're used as statements is the `on.` attribute. `twoway.` and some other
attributes actually reparse them as property accessors.

Another problem is that prototypal scope inheritance leaks getters and setters
from the VM, leading to unintuitive and difficult to debug errors.
