var partnerCode = "ATIDSG";
//crossorigin.me gets around the fact that the api headers don't allow CORS requests
// :'(
var corsProxy = "https://crossorigin.me/",
  careUrl = corsProxy + "https://api.cqc.org.uk/public/v1/locations",
  postcodeUrl = "https://api.postcodes.io/postcodes/",
  map = xmap();

var loader = {
  elem: document.getElementById('loader'),
  show: function() {
    loader.elem.setAttribute('class', '');
  },
  hide: function() {
    loader.elem.setAttribute('class', 'inactive');
  },
}


function Cqc(timeToShow) {
  var parent = this;
  var file = tinyMockData;
  this.notificationRange = {};
  this.getLocation = function(locationId) {
    return $.ajax(careUrl + "/" + locationId + "?partnerCode=" + partnerCode, {
      'method': 'get'
    });
  };
  this.getNotifications = function(details) {
    //if there is an api for notifications,
    //replace this method with the appropriate calls.
    //may require updates to getNotificationRange too
    return file[details.year][details.month];

  };
  this.getNotificationRange = function() {
    var first = {},
      last = {},
      years = Object.keys(file);
    first.year = Math.min.apply(null, years);
    last.year = Math.max.apply(null, years);
    var firstMonths = Object.keys(file[first.year]);
    first.month = Math.min.apply(null, firstMonths);
    var lastMonths = Object.keys(file[last.year]);
    last.month = Math.max.apply(null, lastMonths);
    return {
      first: first,
      last: last
    };
  };
  this.lookupPostcode = function(postcode) {
    return $.ajax(postcodeUrl + postcode, {
      'method': 'get'
    });
  };
  this.setTitle = function(details) {
    var monthField = document.getElementById("currentMonth");
    var monthName = new Date(details.year, details.month);
    monthName = monthName.toLocaleString("en-gb", {
      month: "long"
    });
    monthField.innerHTML = monthName;
    var yearField = document.getElementById("currentYear");
    yearField.innerHTML = details.year;
  };
  this.showNotifications = function(details, monthsOffset) {
    loader.show();
    if (monthsOffset === 0) {
      this.setTitle(details);
    }

    var notificationsToShow = getNotifications(this.time.dec(details, monthsOffset)),
      notificationids = Object.keys(notificationsToShow),
      notificationDeferreds = [];

    for (var i = 0; i < notificationids.length; i++) {
      // fetch details from api
      loc = parent.getLocation(notificationids[i]);
      notificationDeferreds.push(loc);
      loc.done(function(response) {
        var postcode = lookupPostcode(response.postalCode);
        postcode.done(function(x) {
          // add marker to map
          map.addMapPoint({
            locationId: response.locationId,
            notification: notificationsToShow[response.locationId],
            latitude: x.result.latitude,
            longitude: x.result.longitude
          }, monthsOffset);
        });
      });
    }
    $.when.apply($, notificationDeferreds).then(loader.hide, function(failure) {
      loader.hide();
      document.getElementById("status").innerHTML = "Some points failed to load. <a href='limitations.html'>Read why</a>, or <a href='index-corsproxy.html'>try a mirror</a>";
    });
  };
  this.buttons = {
    elems: {
      play: document.getElementById('controls-play'),
      stop: document.getElementById('controls-stop'),
      next: document.getElementById('controls-next'),
      previous: document.getElementById('controls-previous')
    },
    behaviour: {
      play: function(e) {
        //hide play button, next, sanity
        console.log('clicked');
      },
      stop: function() {
        //hide stop button, stop moving through time, sanity
      },
      previous: function(e) {
        //time-1
        if (!$(e.target).hasClass("inactive")) {

          var now = parent.time.dec(parent.time.getTime(), 1);
          parent.setTitle(now);
          //update map
          map.shuffleMarkerGroups("decrement");
          parent.showNotifications(now, 2, "decrement");
          map.adjustMarkerOpacity();
          //sanity check & disable buttons if needed.
          buttons.behaviour.timeSanityCheck(now);
        }
      },
      next: function(e) {
        if (!$(e.target).hasClass("inactive")) {
          var now = parent.time.inc(parent.time.getTime(), 1);
          parent.setTitle(now);
          map.shuffleMarkerGroups("increment");
          parent.showNotifications(now, 0, "increment");
          map.adjustMarkerOpacity();
          buttons.behaviour.timeSanityCheck(now);
        }
      },
      timeSanityCheck: function(aTime) {
        //given the time now, do we need to disable buttons and/or stop moving?
        //is there a next month?
        //is there a previous month?
        if (time.equals(aTime, notificationRange.first)) {
          $(buttons.elems.previous).addClass("inactive");
        } else {
          $(buttons.elems.next).removeClass("inactive");
          $(buttons.elems.previous).removeClass("inactive");
          if (time.equals(aTime, notificationRange.last)) {
            $(buttons.elems.next).addClass("inactive");
          }
        }
      }
    }
  };
  this.time = {
    _time: {},
    getTime: function(){
      return this._time;
    },
    setTime : function(aTime){
      this._time = aTime;
    },
    toDate: function(timeDetails) {
      return new Date(timeDetails.year, timeDetails.month);
    },
    toMonthYear: function(aDate) {
      return {
        month: aDate.getMonth(),
        year: aDate.getFullYear()
      }
    },
    equals: function(time1, time2) {
      return (time1.month === time2.month) && (time1.year === time2.year);
    },
    //js date will automatically update to correct year if we
    //overlap into new year (e.g. month 12 of 2017 will create a date
    // that is jan 2018.)
    inc: function(timeDetails, by) {
      timeDetails.month = timeDetails.month + by;
      var theTime = this.toDate(timeDetails);
      return this.toMonthYear(theTime);
    },
    //js date will automatically update to correct year if we
    //do negative month (e.g. month -1 of 2017 will create a date
    // that is dec 2016.)
    dec: function(timeDetails, by) {
      timeDetails.month = timeDetails.month - by;
      var theTime = this.toDate(timeDetails);
      return this.toMonthYear(theTime);
    },
  };
  this.initButtonListeners = function() {
    var buttonList = this.buttons.elems,
      buttonBehaviour = this.buttons.behaviour,
      button;
    for (buttonName in buttonList) {
      button = this.buttons.elems[buttonName];
      $(button).click(buttonBehaviour[buttonName]);
    }
  };
  this.init = function() {
    this.time.setTime(timeToShow);
  //  console.log("a", JSON.stringify(this.time.getTime()));

    this.showNotifications(this.time.getTime(), 0);
  //  console.log("b", JSON.stringify(this.time.getTime()));
    this.showNotifications(this.time.getTime(), 1);
  //  console.log("c", JSON.stringify(this.time.getTime()));
    this.showNotifications(this.time.getTime(), 2);
  //  console.log("d", JSON.stringify(this.time.getTime()));
    this.initButtonListeners();
    this.notificationRange = this.getNotificationRange();
  //  console.log("init complete", JSON.stringify(this.time.getTime()));

  };
  this.init(timeToShow);
  return this;
}


var cqc = Cqc({
  year: 2017,
  month: 7
});
