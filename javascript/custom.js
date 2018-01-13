//  Adding FB and Vars ---GABE
let config = {
  apiKey: "AIzaSyDwcoCJMFHEz4FwOu0FadWtNo3tX9duiq8",
  authDomain: "travellion-1515776976948.firebaseapp.com",
  databaseURL: "https://travellion-1515776976948.firebaseio.com",
  projectId: "travellion-1515776976948",
  storageBucket: "travellion-1515776976948.appspot.com",
  messagingSenderId: "548012688737"
};
firebase.initializeApp(config);

let database = firebase.database();
let userCity = "";
let userState = "";
let userCityandState = "";

// foursquare keys
let client_id = "PIJMX4JSYGX0LTGVJZGWQ13AOZBUJ4TDD3QJ32QR2CN1OMDN";
let client_secret = "U0BF5HKPA54ZB4KPTDIPAZLCV3X4435YPVCBUZAZEWTKVL42";

//End Adding FB and Vars ---GABE

// Test to ensure js loading
console.log("script loading");

// Hide content divs foursquare and weather
$(".background").hide();

// Button submit function, will remove button eventually
$("#submitBtn").on("click", function(event) {
  // Prevent page reloading
  event.preventDefault();


  // Test button works
  console.log("button works")

  // Show divs for weather and foursquare content
  $(".background").show();


  //ADDing Code --- GABE

  let userTempCity = $("#inputCity").val().trim().split(", ");
  userCity = userTempCity[0]
  userState = userTempCity[1];
  userCityandState = userCity + ", " + userState;

  console.log("The temp city is", userTempCity);
  console.log("The user city is", userCity);
  console.log("the search state is", userState);
  console.log("The user city and state is", userCityandState);

  //Clearing Values
  $("#inputCity").val("");

  //AJAX Request for foursquare
  // Put foursquare query here
  var queryURL = "https://api.foursquare.com/v2/venues/explore?" + "mode=url" + "&near=" + userCityandState + "&limit=6" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v=20180112" + "&q=Fun";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    console.log(response);
  });


  // Put Ajax Weather query here



  //Pushing to firebase
  database.ref().push({
    // userSearch: userSearch,
    userCity: userCity,
    userState: userState,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  return false;
});
