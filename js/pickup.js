(function (global) {
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toMinutes(hhmm) {
    var parts = hhmm.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function zonedYmd(date, timeZone) {
    var fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return fmt.format(date);
  }

  function weekdayIndex(date, timeZone) {
    var weekday = new Intl.DateTimeFormat("en-US", { timeZone: timeZone, weekday: "short" }).format(date);
    return { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[weekday];
  }

  function slotDate(ymd, minute, timeZone) {
    var probe = new Date(ymd + "T12:00:00+01:00");
    var desired =
      ymd + "T" + pad(Math.floor(minute / 60)) + ":" + pad(minute % 60) + ":00";
    var offsetFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      timeZoneName: "shortOffset",
      hour: "2-digit"
    });
    var tzName = offsetFmt.formatToParts(probe).find(function (p) { return p.type === "timeZoneName"; });
    var offset = (tzName && tzName.value ? tzName.value.replace("GMT", "").replace("UTC", "") : "+01:00") || "+01:00";
    if (/^[+-]\d{2}$/.test(offset)) offset += ":00";
    if (offset === "+0" || offset === "GMT") offset = "+00:00";
    return new Date(desired + offset);
  }

  function buildSlots(settings, daysAhead) {
    var timeZone = settings.timezone || "Europe/Rome";
    var slotMinutes = settings.slot_minutes || 15;
    var lead = settings.lead_minutes || 20;
    var hours = settings.weekday_hours || {};
    var now = new Date();
    var minTime = new Date(now.getTime() + lead * 60 * 1000);
    var slots = [];
    var day;

    for (day = 0; day < (daysAhead || 3); day += 1) {
      var cursor = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
      var ymd = zonedYmd(cursor, timeZone);
      var weekday = String(weekdayIndex(cursor, timeZone));
      var windows = hours[weekday] || [];
      windows.forEach(function (windowHours) {
        var start = toMinutes(windowHours.open);
        var end = toMinutes(windowHours.close);
        var minute;
        // close inclusivo: con close "23:30" l'ultimo slot è 23:30
        for (minute = start; minute <= end; minute += slotMinutes) {
          var asDate = slotDate(ymd, minute, timeZone);
          if (asDate >= minTime) {
            slots.push({
              iso: asDate.toISOString(),
              label: ymd + " " + pad(Math.floor(minute / 60)) + ":" + pad(minute % 60)
            });
          }
        }
      });
    }

    return slots;
  }

  global.SmashUpPickup = { buildSlots: buildSlots };
})(window);
