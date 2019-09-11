var myVidId = "m30JxCZASkQ";
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 3. This function creates an <iframe> (and YouTube player)
// // after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: myVidId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
// // 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}
// 5. The API calls this function when the player's state changes. 
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}
// API's go here
// Wikipedia (mediaWiki)
function wikipediaApiSearch(searchTerm,htmlElement){
  htmlElement.empty();
  var sumSearchTerm;
  var wikiPageLink;
  var summary;
var mediaWikiPageURL = 
    "https://en.wikipedia.org/w/api.php?"+
    "action=opensearch&search="+
    searchTerm+"&srlimit=1&format=json&origin=*";
  $.ajax({url:mediaWikiPageURL,method:"GET"})
  .then(function(response){
  wikiPageLink = response[3][0];
})
var mediaWikiTitleURL = 
    "https://en.wikipedia.org/w/api.php?"+
    "action=query&list=search&srsearch="+
    searchTerm+"&format=json&origin=*";                    
$.ajax({url:mediaWikiTitleURL,method:"GET"})
.then(function(response){
  searchTerm = response.query.search[0].title;
  sumSearchTerm = searchTerm.split(" ").join("_"); // make spaces in title underscores
var mediaWikiQueryURL = 
    "https://en.wikipedia.org/api/rest_v1/page/summary/"+sumSearchTerm; //get summary with second call
    $.ajax({url:mediaWikiQueryURL,method:"GET"})
    .then(function(response){
      summary =response.extract;
      htmlElement.text(summary); //REPLACE BODY WITH LOCATION TO PLACE WIKIPEDIA SUMMARY
      var a = $('<a>');
      a.attr("href",wikiPageLink);
      a.text(wikiPageLink);
      htmlElement.append(a); 
    })  
  })  
}
// weather api
function getWeatherapi(searchTerm){
  var weatherKey;
  var weatherUrl = "https://dataservice.accuweather.com/locations/v1/cities/search?"+
                    "apikey=pXnQqbTr8uNLIqB0RF00bvsTglfYknGr&"+
                    "q="+searchTerm;
  $.ajax({url: weatherUrl, method: "GET"})
  .then(function(response){
    console.log(response[0]);
    let temp = response[0];
    weatherKey = temp.Key;
    console.log(weatherKey)
    weatherUrl = "http://dataservice.accuweather.com/currentconditions/v1/"+weatherKey+
                  "?apikey=pXnQqbTr8uNLIqB0RF00bvsTglfYknGr";
   $.ajax({url: weatherUrl, method: "GET"})
   .then(function(response){
     console.log(response)
     let weather = response[0];
     //populate the html
     let p = $("#weatherAPI");
     p.text("It is currently "+weather.weatherText+ " and "+
            weather.Temperature.Imperial.Value+ " degrees "+ weather.Temperature.Imperial.Unit);
   })
  })
} 
 // Click the search button to get info
$('#searchBtn').on("click",function(event){
  event.preventDefault();
  let searchTerm = $('#searchBar').val().trim();
  youTubeApiSearch(searchTerm).then(function(newVideoId){
    console.log('starting new vid id: ',newVideoId )
    player.loadVideoById({videoId: newVideoId })
  }).catch(function(err){
    console.log('error in loadVideo is: ', err)
  })
  $('#searchBar').val("");
  // api function calls
  var $wikiApi = $('#wikipediaApi');
  wikipediaApiSearch(searchTerm,$wikiApi);
  getWeatherapi(searchTerm);
  $('.currentSearchTerm').text(searchTerm);
});
// WORK IN PROGRESS
function youTubeApiSearch(searchTerm) {
  var youTubeQueryURL = "https://www.googleapis.com/youtube/v3/search" +
    "?key=AIzaSyCSz_oYNA4L3hphcNmafYqYJ7_tyBJTsh0&part=snippet&type=video&videoEmbeddable=true&" +
    "q=" + searchTerm + "+travel+guide";
  return $.ajax({ url: youTubeQueryURL, method: "GET" })
    .then(function (response) {
      console.log("youtube returns: ", response.items[0].id.videoId);
      return response.items[0].id.videoId
    }).catch(function (error) {
      console.log("youtube error is : ", error)
    })
}
// 2. This code loads the IFrame Player API code asynchronously.
//TO DO: logic for saving favorites to database and pulling favorites from database (Renee working on creating database)
function youTubeApiSearch(searchTerm) {
  var youTubeQueryURL = "https://www.googleapis.com/youtube/v3/search" +
    "?key=AIzaSyCSz_oYNA4L3hphcNmafYqYJ7_tyBJTsh0&part=snippet&type=video&videoEmbeddable=true&" +
    "q=" + searchTerm + "+travel+guide";
  return $.ajax({ url: youTubeQueryURL, method: "GET" })
    .then(function (response) {
      console.log("youtube returns: ", response.items[0].id.videoId);
      return response.items[0].id.videoId
    }).catch(function (error) {
      console.log("youtube error is : ", error)
    })
}
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA29FRgKxNQhEMT9bohbKhLAkcv_AMLRZk",
  authDomain: "travelsaur-3d18f.firebaseapp.com",
  databaseURL: "https://travelsaur-3d18f.firebaseio.com",
  projectId: "travelsaur-3d18f",
  storageBucket: "",
  messagingSenderId: "1062829451298",
  appId: "1:1062829451298:web:49555d4c0ffef2bf"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firebaseData = firebase.database();
let searchTerm;
$(document).ready(function () {
  $("#showMainModal").modal('show');
  $('#signup').on('click', function () {
    signUp();
  });
  $('#signin').on('click', function () {
    signIn();
  });
  var userNameForFavorites;
  function signUp() {
    //sign up user
    $("#showSignUpModal").modal('show');
    $("#submitNewUsername").on('click', async function (event) {
      event.preventDefault();
      var enteredUsername = $('#newUsername').val();
      //pull usernames from database
      var usersInFirebase = await userPullfromFirebase();
      console.log(usersInFirebase);
      //compare
      enteredUsername = enteredUsername.toLowerCase();
      console.log(enteredUsername);
      checkIfThere(enteredUsername, usersInFirebase);
    })
    //on button click call createUser()
  }
  function signIn() {
    //sign in user
    $("#showSignInModal").modal('show');
    $("#submitUsername").on('click', async function (event) {
      event.preventDefault();
      var name = $('#priorUsername').val();
      name = name.toLowerCase();
      var namesinBase = await userPullfromFirebase();
      if (namesinBase.includes(name)) {
        userNameForFavorites = name;
      }
      else {
        signInerror();
      }
      console.log(userNameForFavorites);
    })
  }
  function signInerror() {
    $("#closeSignInModalAgain").modal('show');
    $("#showMainModal").modal('show');
  }
  //create users array
  function createUser(enteredUsername) {
    console.log(enteredUsername);
    //push username to database
    firebaseData.ref(enteredUsername).set(
      ''
    )
    //store username
    userNameForFavorites = enteredUsername;
    console.log(userNameForFavorites);
  }
  async function userPullfromFirebase() {
    var ref = firebaseData.ref();
    //gets database once
    var usernamesInDatabase;
    await ref.once('value').then(function (snapshot) {
      console.log('response is', snapshot.val());
      usernamesInDatabase = snapshot.val();
      usernamesInDatabase = Object.keys(usernamesInDatabase);
    })
    return usernamesInDatabase;
  }
  function checkIfThere(enteredName, databaseName) {
    console.log(enteredName);
    console.log(databaseName);
    if (databaseName.includes(enteredName)) {
      errorMessage();
    }
    else {
      createUser(enteredName);
    }
  }
  function errorMessage() {
    $("#closeSignUpModalAgain").modal('show');
    signUp();
  }
  async function favoritesPullfromFirebase(favLocation) {
    var reference = firebaseData.ref();
    favLocation = favLocation.toLowerCase();
    console.log('favLocation is ' + favLocation);
    var newArray = [];
    //gets database once
    await reference.once('value').then(function (childSnapshot) {
      var name = childSnapshot.val();
      var locations = name[userNameForFavorites];
      locations = locations.toString();
      if (locations === "") {
        newArray = locations.split("");
      }
      else {
        newArray = locations.split(",");
      }
      console.log('new array before concat is ' + newArray);
      if (newArray.toString().includes(favLocation)) {
        newArray = newArray;
        console.log('if statement new array ' + newArray);
      }
      else {
        newArray = newArray.concat(" " + favLocation);
        console.log('if statement concat ' + newArray);
      }
      $("#favoriteCard").empty();
      //populates the items as buttons on the card
      for (var j = 0; j < newArray.length; j++) {
        $("#favoriteCard").append("<button type='submit'" +
          " id='favLocation' value=" + newArray[j] +
          " class='btn btn-danger'>" + newArray[j] + "</button");
      }
    })
    //add new favorite location to those already there
    newArray = newArray.toString();
    //upload new list to database
    firebaseData.ref(userNameForFavorites).set(
      newArray
    )
  }
  //buttonclick event loads item up into firebase
  $('#favoriteButtonClick').on('click', function (event) {
    event.preventDefault();
    var favoritedLocation = searchTerm;
    console.log('search term is' + favoritedLocation);
    favoritesPullfromFirebase(favoritedLocation);
  });
})
function errorMessage() {
  $("#closeSignUpModalAgain").modal('show');
  signUp();
}
//buttonclick event loads item up into firebase
$('#favorite').on('click', function (event) {
  event.preventDefault();
  var favoritedLocation = $(this).val();
  console.log(favoritedLocation);
});
