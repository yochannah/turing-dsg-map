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
const http = require('http');

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
        if (jsonObj.postcode) {
            try {
                var location = http.get(("http://178.62.43.80/postcodes/" + jsonObj.postcode), (res, err) => {
                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (chunk) => {
                        rawData += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const parsedData = JSON.parse(rawData);
                            console.log(jsonObj.locationId, parsedData.result.latitude, parsedData.result.longitude);
                            results[jsonObj.locationId] = {
                                postcode: jsonObj.postcode
                            };
                            if (parsedData.result) {
                                results[jsonObj.locationId].lat = parsedData.result.latitude,
                                    results[jsonObj.locationId].lon = parsedData.result.longititude;
                            }

                        } catch (e) {
                            console.error("ca", e.message);
                        }
                    });
                });
            } catch (e) {
                console.log("sigh", e);
            }
        }
    })
    .on('done', (error) => {
        //    console.log('end')
        console.log(results);

    });
