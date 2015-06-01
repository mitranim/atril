# Possible performance optimisations

The naive implementation of the virtual DOM as a tree of native nodes is
probably incurring heavy performance penalties (must measure). It needs to be
converted into a series of super lightweight objects (virtual versions of
Node et al).

Instead of reflowing the entire document every time, we should split the
bootstrap phase and the reflow phase. It should be the same process when
bootstrapping the base document or any component, which should be treated as an
object in itself. References to the virtual tree and other utility data, if any,
should be kept on the root node in each "document" (html and each component).
This architecture should also allow us to implement drafts in the vanilla DOM.

- Currently the output of drafts is recompiled and rephased on each reflow. There
- needs to be a way to detect when it doesn't need to.
- * If the draft doesn't have a `phase` method, don't recompile its output (this
-   is probably a minor optimisation since bindings in its existing nodes don't
-   need to be recompiled anyway, we're just re-checking them).

- In a similar vein, consider permanently marking bindings (both interpolations
- and custom attributes) as "bad" if one of them throws during a phase, and
- subsequently ignoring them.

Expressions are currently re-evaluated on each call. This is done in order to
support locals without inheriting a masking object from the scope (which works
fine for reads but breaks writes), or mutating the scope by assigning the locals
to it. Should look into ways to fix that.

`for.*` keeps references to unused virtual nodes for fast reuse. This is a
potential memory "leak" in a sense that if the viewmodel initially requires a
lot of nodes but later only needs a few, the stashed nodes only gunk up the
memory. Might want to keep track and discard nodes that have been unused for
many phases (keeping an average index as an integer should be enough).

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
