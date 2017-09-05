# setup

We assume you have node & npm installed. Get it here: https://nodejs.org/en/download/.

To initialise your development dependencies, run

 ```npm install```


# building data
1. Download the open data csv file from http://www.cqc.org.uk/about-us/transparency/using-cqc-data
2. place it in the data directory
3. open js/csv-to-json.js and
    1. ensure the filename matches the name of the file you've just downloaded.
    2. ensure the column headers (pretty and machine) still match the column headers in the csv.
4. Open a terminal. In the project root, run the following command to build the data, renaming the file to something meaningful to you.

``` node js/csv-to-json.js > YOURPREFERREDFILENAMEHERE.json ```

Now go admire the easy-to-query json in your new file!
