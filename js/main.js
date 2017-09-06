var partnerCode = "ATIDSG";
//crossorigin.me gets around the fact that the api headers don't allow CORS requests
// :'(
var careUrl = "https://crossorigin.me/https://api.cqc.org.uk/public/v1/locations",
  postcodeUrl = "https://api.postcodes.io/postcodes/"

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
  this.getLocation = function(locationId) {
    return $.ajax(careUrl + "/" + locationId + "?partnerCode=" + partnerCode, {
      'method': 'get'
    });
  };
  this.getNotifications = function(details) {
    //if there is an api for notifications,
    //replace this method with the appropriate calls.

    return tinyMockData[details.year][details.month];
    //this is for bigger-scale
    //    return mockNotifications[details.year][details.month];
  };
  this.lookupPostcode = function(postcode) {
    return $.ajax(postcodeUrl + postcode, {
      'method': 'get'
    });
  };
  this.setTitle = function(details) {
    var monthField = document.getElementById("currentMonth");
    var monthName = new Date(details.year, (details.month - 1));
    monthName = monthName.toLocaleString("en-gb", {
      month: "long"
    });
    monthField.innerHTML = monthName;
    var yearField = document.getElementById("currentYear");
    yearField.innerHTML = details.year;
  };
  this.showNotifications = function(details) {
    this.setTitle(details);
    var notifications = getNotifications(details),
      notificationids = Object.keys(notifications),
      notificationDeferreds = [];
    for (var i = 0; i < notificationids.length; i++) {
      // fetch details from api
      loc = parent.getLocation(notificationids[i]);
      notificationDeferreds.push(loc);
      loc.done(function(response) {
        var postcode = lookupPostcode(response.postalCode);
        postcode.done(function(x) {
          // add marker to map
          addMarker({
            locationId: response.locationId,
            notification: notifications[response.locationId],
            latitude: x.result.latitude,
            longitude: x.result.longitude
          });
        });
      });
    }
    $.when.apply($, notificationDeferreds).then(loader.hide);
  };
  this.buttons = {
    elems: {
      play: document.getElementById('controls-play'),
      stop: document.getElementById('controls-stop'),
      next: document.getElementById('controls-next'),
      previous: document.getElementById('controls-previous')
    },
    behaviour: {
      play: function() {
        //hide play button, next, sanity
        console.log('clicked');
      },
      stop: function() {
        //hide stop button, stop moving through time, sanity
      },
      previous: function() {
        //time-1, sanity
        //the console logs are poor man's tests.
      //  console.log("from", JSON.stringify(parent.time.show));
        var now = parent.time.dec(parent.time.show);
      //  console.log("from", JSON.stringify(parent.time.show));
      },
      next: function() {
      //  console.log("from", JSON.stringify(parent.time.show));
        var now = parent.time.inc(parent.time.show);
      //  console.log("to", JSON.stringify(parent.time.show));
      },
      timeSanityCheck: function() {
        //given the time now, do we need to disable buttons and/or stop moving?
      }
    }
  };
  this.time = {
    show: {},
    toDate: function(timeDetails) {
      return new Date(timeDetails.year, timeDetails.month);
    },
    toMonthYear: function(aDate) {
      return {
        month: aDate.getMonth(),
        year: aDate.getFullYear()
      }
    },
    inc : function(timeDetails) {
      timeDetails.month = timeDetails.month +1;
      //js date will automatically update to correct year if we
      //overlap into new year (e.g. month 12 of 2017 will create a date
      // that is jan 2018.)
      var theTime = this.toDate(timeDetails);
      theTime = this.show = this.toMonthYear(theTime);
      return theTime;
    },
    dec : function(timeDetails) {
          timeDetails.month = timeDetails.month -1;
          //js date will automatically update to correct year if we
          //do negative month (e.g. month -1 of 2017 will create a date
          // that is dec 2016.)
          var theTime = this.toDate(timeDetails);
          theTime = this.show = this.toMonthYear(theTime);
          return theTime;
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
  this.init = function(timeToShow) {
    this.showNotifications(timeToShow);
    this.initButtonListeners();
    this.time.show = timeToShow;
  };
  this.init(timeToShow);
  return this;
}


var cqc = Cqc({
  year: 2017,
  month: 10
});
