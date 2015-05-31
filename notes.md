# Possible performance optimisations

Currently the output of drafts is recompiled and rephased on each reflow. There
needs to be a way to detect when it doesn't need to.
* If the draft doesn't have a `phase` method, don't recompile its output (this
  is probably a minor optimisation since bindings in its existing nodes don't
  need to be recompiled anyway, we're just re-checking them).

In a similar vein, consider permanently marking bindings (both interpolations
and custom attributes) as "bad" if one of them throws during a phase, and
subsequently ignoring them.

Expressions are currently re-evaluated on each call because that's the only way
I found to support locals without masking the scope with an object that inherits
from it (which works fine for reads but breaks writes), or mutating the scope by
assigning the locals to it. Should look into ways to fix that.

`for.*` keeps references to unused virtual nodes for fast reuse. This is a
potential memory "leak" in a sense that if the viewmodel initially requires a
lot of nodes but later only needs a few, the stashed nodes only gunk up the
memory. Might want to keep track and discard nodes that have been unused for
many phases (keeping an average index as an integer should be enough).

We currently don't differentiate between bootstrap and reflow, parsing the
entire document every time. This is very cheap because the work on non-`atril`
nodes is limited to checking tag names. However, just as a reminder, if, or
when, we introduce support for custom attributes and possibly drafts in the
vanilla DOM, it will incur a lot more document scanning during reflows. Must
find a way to keep it cheap.

# Transclusion semantics

Components and drafts serve complementary roles.

A component creates a viewmodel isolated from the outer scope, and a template
that defines how that viewmodel should be rendered. Rendering is managed
automatically by atril, using the virtual DOM, and a component is not allowed
to mess with it, for efficiency and safety reasons.

A draft doesn't create a viewmodel. Because of that, it doesn't need to be
isolated from the outer DOM, and is allowed to mess with it in arbitrary ways.
For efficiency and stability, this is done through the virtual DOM, so a draft is
not allowed to mess with the real DOM.

No planned support for `<content selector="...">` because it can potentially
break things like `for.="..."` by changing the order of transcluded nodes in the
way uncontrollable by the outer element that relies on this particular order.

Transclusion with `<content>` is planned for components. The root element of the
transcluded content will receive a reference to the parent of the custom element
into which it was transcluded. When looking for a scope, we'll start from there.

Also considering the possibility of enabling a template and `<content>` for
drafts. If a template is provided, it's parsed using the same mechanics as
component templates, with the difference that elemends transcluded with
`<content>` become a part of the local DOM and don't receive references to the
original parents (because a draft doesn't create a new scope). A potential
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

# Open questions

Considering enabling support for custom attributes (non-drafts) in the vanilla
DOM. The implementation is trivial because custom attributes don't care about
the virtual DOM. The semantics of scope search and custom attributes will change
to accommodate the possibility of null scope. The downside is that this will
involve more DOM traversal on each phase (how much?).

It's unclear if we can enable drafting in the vanilla DOM. The virtual draft
container could be stored on one of the real elements, such as on the parent of
the original element, but it's unclear how to keep track of its position.

# Async templating

ToDo: convert `templateCache` into an object with methods `get`, `set`, and
`load`. The `load` method will return a promise that resolves with the template.
Move the template loading logic there.

<!--
When a ComponentContainer is instantiated, and subsequently during each phase,
it checks own `compiled` status. If found, template retrieval/compilation is
skipped and the normal phase is executed. If not, it tries to find a template
for the component. The algorithm goes as follows. If template retrieval fails at
any point, the `phase` method for the given component container is erased.

* Check for own `loadingTemplate` indicator (see below). If found, skip the phase.
* Check for static template property on VM class. Found?
  * If string, set own `compiled` to true, compile, and run the phase.
  * If promise, set it to:
    * On success: if string, store the template on the container, set own
      `compiled` state (intentionally before compilation to avoid repeated
      failures if compilation fails), and compile. If not a string, warn the
      user and erase the `phase` method.
    * On failure: erase the `phase` method.
    * Don't run a phase after it's resolved (zone should reflow automatically).
    * Don't bother storing the state globally for the class.
    * Don't keep a reference to the promise. Use a boolean progress indicator.
      On success or fail, set it to false.
* Check for string template url on VM class. Found?
  * Check if the global template store has a string value for this url.
    * If found, set own `compiled` state, compile, and run the phase. Skip the
      rest of this algorithm.
    * If not found, check if it's registered among failed urls. If yes, erase
      own `phase` method. If not, try to retrieve it by url (see below).
  * Set the xhr callback to:
    * On success: check content-type. If it's application/json, try to decode
      it. The result must be a string. If decoding fails, follow the failure
      algorithm (see below). If it succeeds, follow the success algorithm (see
      below). If it's text/plain or text/html, follow the success algorithm (see
      below). Otherwise follow the failure algorithm.
      * Failure algorithm: warn the user, mark the url as failed, and erase own
        `phase` method.
      * Success algorithm: mark own `compiled` state and compile. Don't run
        a phase, zone should reflow automatically.
* If not a static string, not a promise, and no template URL, use '' and the
  normal success handler.
 -->