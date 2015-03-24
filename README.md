# reactive-fromnow: reactive version of moment.fromNow()

This package exports one function: `ReactiveFromNow(then, options)`.

It returns a string similar to the `fromNow` function of moment.js.  If called
in a reactive context, it also invalidates the current context at a point where
that string may change. Unlike other reactive moment packages, it does not
invalidate the context every second; for example, when printing "a day ago", it
only refreshes on the next hour.

If the date is in the future, it always returns `"just now"`.

`then` is a `Date`, `Moment`, or any other value that can be passed to the
`Moment` constructor.

Options include:
* `fromWhen`: the time (`Date`, `Moment`, or other value that can be passed to
  the `Moment` constructor) from which the duration should be calculated,
  instead of the current time.
* `maxRelativeMs`: if the duration to format is longer than this amount,
  print its absolute date instead of a relative date, and ignore the Tracker
  context.
* `absoluteFormat`: override the default moment format string used for absolute
  dates.
* `noReactivity`: ignore the Tracker context.  Mostly intended for testing.

Does not support Moment locales.
