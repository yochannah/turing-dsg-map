const csvFilePath = 'data/23_August_2017_CQC_directory.csv';

var fieldDefinitions = {
  prettyNames: [ //currently prettynames isn't used
    "Name",
    "Also known as",
    "Address",
    "Postcode",
    "Phone number",
    "Service's website (if available)",
    "Service types",
    "Date of latest check",
    "Specialisms/services",
    "Provider name",
    "Local Authority",
    "Region",
    "Location URL",
    "CQC Location (for office use only",
    "CQC Provider ID (for office use only)"
  ],
  computerNames: [
    "name",
    "aka",
    "address",
    "postcode",
    "phone",
    "website",
    "types",
    "latestCheck",
    "services",
    "provider",
    "localAuthority",
    "region",
    "locationURL",
    "locationId",
    "providerId"
  ],

  ignore: [
    "aka",
    "address",
    "phone",
    "website",
    "locationURL",
    "providerId"
  ]
};



/** hopefully you won't need to edit anything below here **/
const csv = require('csvtojson');

var results = [],
  types = [],
  services = [];


csv({
    headers: fieldDefinitions.computerNames,
    includeColumns: ["locationId", "localAuthority"],

  })
  .fromFile(csvFilePath)
  .on('json', (jsonObj, index) => {
    // combine csv header row and csv line to a json object
    // jsonObj.a ==> 1 or 4
    results.push(jsonObj.locationId);
  })
  .on('done', (error) => {
    //    console.log('end')
    //console.log(results);
    //fakeMonth([2016])
    fakeData([2016, 2017])
  });

var notificationTypes = ["DOLs",
  "Abuse",
  "Injury",
  "Whistleblower",
  "Safeguarding"
];
var notificationType = function() {
  return notificationTypes[Math.round(Math.random() * 5)];
}

function randomIntFromInterval(min, max) {
  //thanks, SO: https://stackoverflow.com/questions/4959975xw
  return Math.floor(Math.random() * (max - min) + min);
}

var fakeCount = function() {
  var highOrLow = Math.random();
  if (highOrLow > 0.9) {
    return randomIntFromInterval(3, 5);
  } else {
    if (highOrLow > 0.7) {
      return 2
    } else {
      return 1;
    }
  }
};

var fakeData = function(years) {
  var response = {},
    numOfResults = results.length;
  years.map(function(year) {
    response[year] = {};
    console.log(notificationType());
    //js dates are 0 based, so 6 is nooootttt June, it's July.
    for (var month = 0; month <= 11; month++) {
      response[year][month] = {};
      for (var i = 1; i <= 10; i++) {
        var id = Math.floor(Math.random() * numOfResults),
          locationId = results[id];
        response[year][month][locationId] = {
          "notificationType": notificationType(),
          "number": fakeCount()
        };
      }
    }
  });
  console.log(JSON.stringify(response));
}
