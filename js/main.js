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


function Cqc() {
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
    }
    return this;
}


var cqc = Cqc();

cqc.showNotifications({
    year: 2017,
    month: 10
});
