`atril` has automatic change detection. It doesn't rely on observables. Instead,
it uses the ancient magick of `zone.js`. When a relevant event (not any event!)
happens, `atril` does a reflow of the virtual DOM with the current viewmodel
data. Then it diffs the virtual DOM with the real DOM and makes atomic updates.

With this model of top-down binding, you can bind to _expressions_ rather than
properties. Of course, two-way binding is an exception and binds to properties
on both ends.
