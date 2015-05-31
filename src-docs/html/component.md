# Component

A component is an overloaded term, much like a class in general OOP.

* It's a _view model_ (a state) isolated from its surroundings. In essense,
  it provides a _local scope_ for that part of the DOM, something that the
  DOM API natively doesn't have.

* It describes a _view_ (a template) with bindings for the viewmodel data.

* The viewmodel has data and methods. Data is automatically rendered into
  the view, and methods may be used by custom attributes in the view.
