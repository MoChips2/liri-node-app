require('dotenv').config();

var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");


var cmd = process.argv[2];

// Liri Commands
// ========================================================
function generator() {
    switch (cmd) {
        case "concert-this":
            bandsinTown();
            break;

        case "spotify-this-song":
            songChoice();
            break;

        case "movie-this":
            movieSearch();
            break;

        case "do-what-it-says":
            doWhat();
            break;

        default:
            console.log("Please enter a valid argument!")
    }
}

// Bands in Town / concert-this
// =========================================================

function bandsinTown() {

    var artist = process.argv.slice(3).join("%20");
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp?";

    if(!artist) {
        console.log("Artist not on tour. Please enter new artist.")
    }

    axios.get(queryURL)
        .then(function (response, error) {


            if (response) {
                var dataArr = response.data;

                //  console.log(dataArr);

                for (i = 0; i < dataArr.length; i++) {

                    var output = dataArr[i]

                    //console.log(output)
                    console.log("------------------------------")
                    console.log(output.venue.name);
                    console.log(output.venue.city + " " + output.venue.region);
                    console.log(moment(output.datetime).format('MM/DD/YYYY'));
                }
            }
            else if (error) {
                return console.log("No tour dates were found!")
            }

        })

}

// Spotify Song
//=========================================================

function songChoice(songTitle) {

    var spotify = new Spotify(keys.spotify);
    songTitle = process.argv.slice(3).join(" ");

    if (!songTitle) {
        songTitle = "The Sign";
        // Could not log the hit classic "The Sign" by Ace of Base. This will log "The Sign" by Harry Styles instead. 
    }


    spotify.search({
        type: 'track',
        query: songTitle,
        limit: 10
    }).then(function (response) {

        // console.log(JSON.stringify(response, null, 2));

        var data = response.tracks;
        console.log("-----------------------------------------")
        
        var displaySong = "Artist: " + data.items[0].album.artists[0].name
            + "\nSong Title: " + data.items[0].name
            + "\nSong Preview: " + data.items[0].preview_url
            + "\nAlbum: " + data.items[0].album.name;
        console.log(displaySong);

    })
        .catch(function (err) {
            console.log(err);
        });

}


//OMDB movie-this
//==========================================================

function movieSearch() {

    var movieName = process.argv.slice(3).join("%20");

    if (!movieName) {
        movieName = "Mr. Nobody";
    }

    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";



    axios.get(queryURL).then(function (response, error) {

        if (response) {

            var data = response.data;
            console.log("-------------------------------")
            console.log("Title: " + data.Title + "\nYear: " + data.Year
                + "\nIMDB Rating: " + data.Ratings[0].Value
                + "\nRotten Tomatoes Rating: " + data.Ratings[1].Value
                + "\nFilmed in: " + data.Country
                + "\nLanguage: " + data.Language
                + "\nPlot Summary: " + data.Plot
                + "\nActors: " + data.Actors
            )
        } else {
            console.log(error);
        }
    })


}


// Do what it says
//==========================================================



function doWhat() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        else {
            var textArray = data.split(",");
             songCMD = textArray[0];
             rndmSong = textArray[1];
             console.log("------------------------------")
             console.log(rndmSong);
            /* instead of logging rndmSong, this is where I would somehow pass this value through songChoice function,
             which would replace songTitle, search for "I Want It That Way" */
        }
    })

}

generator(cmd);