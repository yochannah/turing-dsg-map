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

function splitServices(services) {
return services.split("|");
}

/** hopefully you won't need to edit anything below here **/
const csv = require('csvtojson');

var results = {},
    types = [],
    services = [];


csv({
        headers: fieldDefinitions.computerNames,
        ignoreColumns: fieldDefinitions.ignore,
        colParser : {"services" : splitServices}

    })
    .fromFile(csvFilePath)
    .on('json', (jsonObj, index) => {
        // combine csv header row and csv line to a json object
        // jsonObj.a ==> 1 or 4
        results[jsonObj.locationId] = jsonObj;
    })
    .on('done', (error) => {
        //    console.log('end')
        console.log(results);
    })
