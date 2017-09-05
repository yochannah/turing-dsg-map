var partnerCode = "ATIDSG";
//crossorigin.me gets around the fact that the api headers don't allow CORS requests
// :'(
var careUrl = "https://crossorigin.me/https://api.cqc.org.uk/public/v1/locations",
postcodeUrl = "https://api.postcodes.io/postcodes/"



function Cqc(){
  var parent = this;
  this.getLocation = function (locationId) {
    return $.ajax(careUrl + "/" + locationId + "?partnerCode=" + partnerCode, {'method':'get'});
  };
  this.getNotifications = function(details) {
    //if there is an api for notifications,
    //replace this method with the appropriate calls.

    return tinyMockData[details.year][details.month];
    //this is for bigger-scale
//    return mockNotifications[details.year][details.month];
  };
  this.lookupPostcode = function(postcode){
    return $.ajax(postcodeUrl + postcode, {'method':'get'});
  }
  this.showNotifications = function (details) {
    var notifications = getNotifications(details);
    for (locationId in notifications) {
      // fetch details from api
      var location = parent.getLocation(locationId);
      location.done(function(response){
        var postcode = lookupPostcode(response.postalCode);
        postcode.done(function(x) {
          console.log(x.result.latitude,x.result.latitude);
        })
      })
      // add marker to map
      console.log(locationId, notifications[locationId]);
    }
  }
  return this;
}

var cqc = Cqc();

cqc.showNotifications({year: 2017, month : 01});
