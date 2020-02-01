/**
 * This little Node.js script will pull in a list
 * of items in which images need to be resized and reduced
 * for file storage / space.
 *
 * It scans directories for the image to be resized (or images)
 * and processes them with the 'sharp' image library for NPM.
 */

const sharp = require('sharp');
var rp      = require('request-promise');
var fs      = require('fs');

//Image settings
const maxWidth  = 600;
const maxHeight = 600;
const dpi       = 72;

const imgPath = "/path/to/image

//Hit the API to fetch the list of images
rp('https://api_url.json')
    .then(function (jsonString) {

        //parse json
        jsonData = JSON.parse(jsonString);

        //Loop through to get all images
        jsonData.images.forEach(function (products, index){

            //Rename all original images to old
            fs.rename(imgPath + products.image, imgPath + products.image+'.old', function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });

            //Start image optimization
            sharp(imgPath + products.image + ".old")
                .resize(maxWidth, maxHeight)
                .dpi(dpi)
                .toFile(products.image, function(err) {

                    //Output any failed images for reference
                    if (err){
                        console.log("Resizing Error: " + err);
                    }
                });
        });

    })
    .catch(function (err) {
        console.log('Could not connect to API. Womp Womp');
    });