var mymap = L.map('mapid').setView([53.382121, -1.467878], 1);
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  minZoom: 6,
  id: 'notsure',
  accessToken: 'pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg'
}).addTo(mymap);

var markers = [{},{},{}],
  colors = {
    "DOLs" : "#8BC34A",
    "Abuse":"#2196F3",
    "Injury":"#E91E63",
    "Whistleblower":"#FFC107",
    "Safeguarding":"#673AB7"

  };

function addMarker(marker, groupIndex) {
  //console.log(marker, markers);
  //assume array of objs with lats and longs and other fun stuff
  var lat = marker.latitude,
    long = marker.longitude,
    sev = marker.notification.notificationType,
    bounds = mymap.getBounds(),
    zoomLevel = mymap.getZoom();

  //only add markers if they haven't already been added
  //we don't want to waste resources adding markers we can't see anyway.
  circle = L.circle([lat, long], {
    fillColor: colors[sev],
    color: colors[sev],
    weight: 1,
    opacity: marker.notification.number/10,
    fillOpacity: marker.notification.number/10 + 0.3 - groupIndex/10,
    radius: (100000 / mymap.getZoom())
  }).addTo(mymap);
  markers[groupIndex][marker.locationId] = circle;
}

function removeMarker(marker, k) {
  mymap.removeLayer(marker);
  delete markers[k];
}

function removeAllMarkers() {
  for (marker in markers) {
    removeMarker(markers[marker], marker);
  }
}

function getBounds() {
  var b = mymap.getBounds();
  return {
    startAt: b._southWest.lat,
    endAt: b._northEast.lat,
    bucket: mymap.getCenter().lng.toString().split(".")[0]
  }
}

function centerMap(lat, long, zoomin) {
  mymap.panTo([lat, long]);
  if (zoomin) {
    mymap.setZoom(14);
  } else {
    mymap.setZoom(12);

  }
}
