var xmap = function() {
  var mymap = L.map('mapid').setView([53.382121, -1.467878], 5);
  var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 28,
    minZoom: 1,
    id: 'notsure',
    accessToken: 'pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg'
  }).addTo(mymap);

  var categoryMap = L.layerGroup()
  //.addTo(mymap); // don't show the paintbull gun efect by default


  var heatMap = L.heatLayer([], {
    radius: 20,
    minOpacity: 0.4,
    gradient: {
      0.6: "#ffe800",
      0.8: "#feb24c",
      1: "#f03b20"
    }
  }).addTo(mymap);

  this.heat = {
    addMarker: function(details, groupIndex) {
      //      console.log(details[2]);
      heatMap.addLatLng(details);
      heat.markers[groupIndex].push(details);
    },
    markers: [
      [],
      [],
      []
    ]
  }


  this.addMapPoint = function(marker, groupIndex) {
    //console.log(marker, markers);
    //assume array of objs with lats and lons and other fun stuff
    var lat = marker.latitude,
      lon = marker.longitude,
      opacity = calculateOpacity(marker.notification, groupIndex);
    heat.addMarker([lat, lon, opacity], groupIndex);
    category.addMarker(marker, groupIndex, lat, lon, opacity);
  }

  var category = {
    markers: [{}, {}, {}],
    colors: {
      "DOLs": "#8BC34A",
      "Abuse": "#2196F3",
      "Injury": "#E91E63",
      "Whistleblower": "#FFC107",
      "Safeguarding": "#673AB7"
    },
    addMarker: function(marker, groupIndex, lat, lon, opacity) {
      var sev = marker.notification.notificationType,
        zoomLevel = mymap.getZoom(),
        icon = new L.Marker.SVGMarker([lat, lon], {
          iconOptions: {
            fillColor: category.colors[sev],
            color: category.colors[sev],
            weight: 1,
            opacity: marker.notification.number / 10,
            fillOpacity: opacity,
          }
        }).addTo(categoryMap);
      // circle = L.circle([lat, lon], {
      //   fillColor: category.colors[sev],
      //   color: category.colors[sev],
      //   weight: 1,
      //   opacity: marker.notification.number / 10,
      //   fillOpacity: opacity,
      //   radius: (100000 / mymap.getZoom())
      // }).addTo(categoryMap);
      category.markers[groupIndex][marker.locationId] = icon;
      icon.properties = marker;
    },
    markersToRemove: null,
    setMarkerOpacity: function(marker, monthsOffset) {
      marker.setStyle({
        fillOpacity: calculateOpacity(marker.properties.notification, monthsOffset)
      });
    },
    removeAllMarkers: function(markerSet) {
      for (marker in markerSet) {
        mymap.removeLayer(markerSet[marker]);
      }
    }
  }

  function calculateOpacity(notificationDetails, monthsOffset) {
    return (notificationDetails.number / 10) + 0.4 - (monthsOffset / 10)
  }
  this.shuffleMarkerGroups = function(incOrDec) {
    //forward in time
    //one step closer to morlocks and eloi
    if (incOrDec === "increment") {
      category.markers.unshift({});
      category.markersToRemove = category.markers.pop();
      //we just redraw the whole heatmap rather than removing markers
      heat.markers.unshift([]);
      heat.markers.pop();
    } else { //decrement, back in time for dinner
      category.markers.push({});
      category.markersToRemove = category.markers.shift();
      heat.markers.push([]);
      heat.markers.shift();
    }
    //remove the old category markers
    category.removeAllMarkers(category.markersToRemove);
    category.markersToRemove = null;
    //remove *all* heatmap markers and redraw (doesn't have a remove-individual-marker method)
    var allHeats = heat.markers[0].concat(heat.markers[1]).concat(heat.markers[2]);
    heatMap.setLatLngs(allHeats);
  };



  this.adjustMarkerOpacity = function() {
    category.markers.map(function(markerSet, i) {
      for (marker in markerSet) {
        category.setMarkerOpacity(markerSet[marker], i);
      };
    })
  }

  //create list of layers on map
  var baseLayers = {
      "Mapbox": tiles,
    },
    overlays = {
      "Heatmap": heatMap,
      "Notification Categories": categoryMap
    };

  //add to the map
  L.control.layers(baseLayers, overlays, {
    hideSingleBase: true
  }).addTo(mymap);

  return this;
};
