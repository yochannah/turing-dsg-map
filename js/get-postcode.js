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
const https = require('https');

var results = {},
    types = [],
    services = [];


csv({
        headers: fieldDefinitions.computerNames,
        includeColumns: ["locationId", "postcode"],

    })
    .fromFile(csvFilePath)
    .on('json', (jsonObj, index) => {
        // combine csv header row and csv line to a json object
        // jsonObj.a ==> 1 or 4
        if(jsonObj.postcode) {
          try {
        var location = https.get(("https://api.postcodes.io/postcodes/" + jsonObj.postcode), (res, err) => {
          console.log(res);
          // results[jsonObj.locationId] = {
          //   postcode : jsonObj.postcode,
          //   lat : res.result.latitude,
          //   lon : res.result.longititude
          // };
        });}
        catch(e) {
          console.log(e);
        }
      }
    })
    .on('done', (error) => {
        //    console.log('end')
        console.log(results);

    });
