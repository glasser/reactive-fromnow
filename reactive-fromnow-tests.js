Tinytest.add('reactive-fromnow - expiration MS', function (test) {
  var t = function (durationArg, expected) {
    test.equal(
      ReactiveFromNowTest.expirationMsFromDuration(
        moment.duration(durationArg)),
      expected
    );
  };

  t({ seconds: -1 }, 1000);
  t({ seconds: 1 }, 1000);
  t({ seconds: 59 }, 1000);

  t({ minutes: 1 }, 60*1000);
  t({ minutes: 5 }, 60*1000);
  t({ minutes: 5, seconds: 3 }, 57*1000);
  t({ minutes: 59, seconds: 58 }, 2*1000);
  t({ minutes: 59, seconds: 59 }, 1000);

  t({ hours: 1 }, 60*60*1000);
  t({ hours: 2, minutes: 9, seconds: 10 }, 50*60*1000 + 50*1000);
  t({ days: 1 }, 60*60*1000);
  t({ days: 1, hours: 3 }, 60*60*1000);
});

Tinytest.add('reactive-fromnow - results', function (test) {
  var t = function (howLongAgoMs, expected) {
    var now = new Date;
    var then = new Date(+now - howLongAgoMs);
    var actual = ReactiveFromNow(then, {
      maxRelativeMs: 7*24*60*60*1000,
      fromWhen: now,
      noReactivity: true
    });
    if (expected instanceof RegExp) {
      test.matches(actual, expected);
    } else {
      test.equal(actual, expected);
    }
  };

  t(-1, 'just now');
  t(0, 'just now');

  // These rules are based on the relativeTimeThresholds in moment.js.
  t(1000, 'a few seconds ago');
  t(30*1000, 'a few seconds ago');

  t(59*1000, 'a minute ago');
  t(60*1000, 'a minute ago');
  t(61*1000, 'a minute ago');
  t(89*1000, 'a minute ago');
  t(91*1000, '2 minutes ago');
  t(30*60*1000, '30 minutes ago');
  t(44*60*1000, '44 minutes ago');

  t(50*60*1000, 'an hour ago');
  t(65*60*1000, 'an hour ago');
  t(3*60*60*1000, '3 hours ago');
  t(21*60*60*1000, '21 hours ago');

  t(22*60*60*1000, 'a day ago');
  t(26*60*60*1000, 'a day ago');
  t(2*24*60*60*1000, '2 days ago');
  t(7*24*60*60*1000, '7 days ago');

  var absRegexp = /^\d{4}-[A-Z][a-z][a-z]-\d{2} \d{1,2}:\d{2} [ap]m$/;
  t(7*24*60*60*1000 + 1, absRegexp);
  t(10*24*60*60*1000, absRegexp);
});

Tinytest.addAsync('reactive-fromnow - reactive', function (test, onComplete) {
  var then = new Date(+new Date() - 30*1000);
  var autorunCount = 0;
  var handle = Tracker.autorun(function () {
    ++autorunCount;
    test.equal(ReactiveFromNow(then), "a few seconds ago");
  });
  test.equal(autorunCount, 1);
  setTimeout(function () {
    test.equal(autorunCount, 3);
    handle.stop();
    onComplete();
  }, 2100);
});
