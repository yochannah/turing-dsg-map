# Carehome notification visualisation

working on assumed data structure with mock notifications, drawing care home locations from

https://anypoint.mulesoft.com/apiplatform/openanswers-co-uk/#/portals/organizations/262a9203-e08f-4d1d-809d-2fc07032e8e8/apis/10878/versions/11228/pages/10961

# dependencies:

Set up using node/npm. Get it here if you don't have it: https://nodejs.org/en/download/
When node is set up, run this command in your root folder to set up dependencies:

```npm install```

The only significant dependency is the CSV to json node package - all other remove packages are loaded via CDN. This includes:

- leaflet for mapping.
- jquery for AJAX calls and managing promises

The APIs used in this prototype are:

- The CQC data API, to glean care home locations in postcode form
- Postcodes.io: https://api.postcodes.io/postcodes/DA1%202EB - used to convert care home postcodes into genuine lat/long pairs to place on the map.
- https://crossorigin.me/ - this API is used to wrap the CQC data API, as the CQC data API does *not* appear to support [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) requests. This is a potential point of failure, and sometimes results on 503 responses. Ideally amending the CQC data API to include an `Access-Control-Allow-Origin: *` header would enable webapps to successfully use the API without the crossorigin.me wrapper. 
