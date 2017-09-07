//if you use a new csv dump file, edit this line to point to the file
const csvFilePath = 'data/23_August_2017_CQC_directory.csv';

var fieldDefinitions = {
  //these are used as column names for the csv parser
  //it may need to be updated if the csv file is changed and has different columns
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
    //these are ignored by the csv parser
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

//this section parses the csv file to json, allowing us to generate fake data from it
//for purposes of visualising imaginary notifications
csv({
    headers: fieldDefinitions.computerNames,
    includeColumns: ["locationId", "localAuthority"],
  })
  .fromFile(csvFilePath)
  .on('json', (jsonObj, index) => {
    results.push(jsonObj.locationId);
  })
  .on('done', (error) => {
    fakeData([2016, 2017])
  });

var notificationTypes = ["DOLs",
  "Abuse",
  "Injury",
  "Whistleblower",
  "Safeguarding"
];
var notificationType = function() {
  //there might be some boundary error here, because occasionally we generate
  //data with no notification type. They come up as black circles on the map
  return notificationTypes[Math.floor(Math.random() * 5)];
}

function randomIntFromInterval(min, max) {
  //thanks, SO: https://stackoverflow.com/questions/4959975xw
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//nice little function to generate random counts for the
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
    //js dates are 0 based, so 6 is nooootttt June, it's July.
    for (var month = 0; month <= 11; month++) {
      response[year][month] = {};
      for (var i = 1; i <= 100; i++) {
        var id = Math.floor(Math.random() * numOfResults),
          locationId = results[id];
        response[year][month][locationId] = {
          "notificationType": notificationType(),
          "number": fakeCount()
        };
      }
    }
  });
  console.log("var tinyMockData = ",JSON.stringify(response));
}
