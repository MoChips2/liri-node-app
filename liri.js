require('dotenv').config();

var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");


var cmd = process.argv[2];

// Liri Commands
// ========================================================

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


// Bands in Town / concert-this
// =========================================================

function bandsinTown() {

    var artist = process.argv.slice(3).join("%20");
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp?";


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
    var userChoice = process.argv.slice(3).join(" ");
    
    if (!songTitle) {
     songTitle = "The Sign";
    }
   
    else if(songTitle === userChoice);
        spotify.search({
            type: 'track',
            query: songTitle,
            limit: 10
        }).then(function (response) {

            // console.log(JSON.stringify(response, null, 2));

            var data = response.tracks;

            var displaySong = "Artist: " + data.items[0].album.artists[0].name
                              + "\nSong Title: " + data.items[0].name
                              + "\nSong Preview: " + data.items[0].preview_url
                              + "\nAlbum: " + data.items[0].album.name
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
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(function (response) {
        // console.log(response.data);
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
    })


}


// Do what it says
//==========================================================

var rndmSong;

function doWhat() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        else {
            var textArray = data.split(",");
                rndmSong = textArray[1];
            songChoice(rndmSong);
        }
    })

}