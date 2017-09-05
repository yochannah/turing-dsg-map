var partnerCode = "ATIDSG";
//crossorigin.me gets around the fact that the api headers don't allow CORS requests
// :'(
var careUrl = "https://crossorigin.me/https://api.cqc.org.uk/public/v1/locations",
    postcodeUrl = "https://api.postcodes.io/postcodes/"



function Cqc() {
    var parent = this;
    this.getLocation = function(locationId) {
      console.log(locationId);
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
    }
    this.showNotifications = function(details) {
        var notifications = getNotifications(details);
        notificationids = Object.keys(notifications);
        for (var i = 0; i < notificationids.length; i++) {
            // fetch details from api
            loc = parent.getLocation(notificationids[i]);
            loc.done(function(response) {
                var postcode = lookupPostcode(response.postalCode);
                postcode.done(function(x) {
                    // add marker to map
                    addMarker({
                        locationId: response.locationId,
                        notification: notifications[response.locationId],
                        Latitude : x.result.latitude,
                        Longitude : x.result.longitude
                    } );
                })
            })
        }
    }
    return this;
}

var cqc = Cqc();

cqc.showNotifications({
    year: 2017,
    month: 07
});
