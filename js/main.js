var partnerCode = "ATIDSG";
var url = "https://api.cqc.org.uk/public/v1/locations"



function Cqc(){
  var parent = this;
  this.getLocation = function (locationId) {
    return $.ajax(url + "/" + locationId)
    .done(function (response) {
      console.log(response);
    })
  };
  this.getNotifications = function(details) {
    //if there is an api for notifications,
    //replace this method with the appropriate calls.

    return mockNotifications[details.year][details.month];
  };
  this.showNotifications = function (details) {
    var notifications = getNotifications(details);
    for (locationId in notifications) {
      // fetch details from api
      var location = parent.getLocation(locationId);
      // add marker to map
      console.log(locationId, notifications[locationId]);
    }
  }
  return this;
}

var cqc = Cqc();

cqc.showNotifications({year: 2016, month : 01});
