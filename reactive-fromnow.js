ReactiveFromNow = function (then, options) {
  options = options || {};

  var thenMoment = moment(then);
  var nowMoment = options.fromWhen ? moment(options.fromWhen) : moment();
  // to/from appears to be undocumented but is what is used internally by
  // moment.from/moment.fromNow.  Note that this duration is typically negative,
  // for "ago" durations.
  var duration = moment.duration({ to: thenMoment, from: nowMoment });
  var absDuration = moment.duration(duration).abs();

  if (options.maxRelativeMs &&
      absDuration.asMilliseconds() > options.maxRelativeMs) {
    var absoluteFormat = options.absoluteFormat || 'YYYY-MMM-DD h:mm a';
    // No need to set an expiration time: we're never going to shift from
    // absolute back to relative.
    return thenMoment.format(absoluteFormat);
  }

  if (Tracker.active && ! options.noReactivity) {
    var expirationMs = expirationMsFromDuration(absDuration);
    var computation = Tracker.currentComputation;
    var timer = Meteor.setTimeout(function () {
      computation.invalidate();
    }, expirationMs);
    computation.onInvalidate(function () {
      clearTimeout(timer);
    });
  }

  if (duration.asSeconds() >= 0) {  // future times
    return "just now";
  } else {
    return duration.humanize(true);
  }
};


var expirationMsFromDuration = function (duration) {
  if (duration.asMinutes() < 1) {
    return 1000;  // refresh each second
  }
  if (duration.asHours() < 1) {
    return (60 - duration.seconds())*1000;  // refresh next minute
  }
  return (60 - duration.minutes())*60*1000
    - (duration.seconds())*1000;  // refresh next hour
};

ReactiveFromNowTest = {
  expirationMsFromDuration: expirationMsFromDuration
};
