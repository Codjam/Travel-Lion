//  Adding FB and Vars ---GABE
var config = {
  apiKey: "AIzaSyDwcoCJMFHEz4FwOu0FadWtNo3tX9duiq8",
  authDomain: "travellion-1515776976948.firebaseapp.com",
  databaseURL: "https://travellion-1515776976948.firebaseio.com",
  projectId: "travellion-1515776976948",
  storageBucket: "travellion-1515776976948.appspot.com",
  messagingSenderId: "548012688737"
};
firebase.initializeApp(config);

var database = firebase.database();
var userCity = "";
var userState = "";
var userCityandState = "";
var userSearch = "";
var userLimit = 12;
var currentDate = moment().format('YYYYMMDD');
console.log("the date is", currentDate);

// foursquare keys
var client_id = "PIJMX4JSYGX0LTGVJZGWQ13AOZBUJ4TDD3QJ32QR2CN1OMDN";
var client_secret = "U0BF5HKPA54ZB4KPTDIPAZLCV3X4435YPVCBUZAZEWTKVL42";
//End Adding FB and Vars ---GABE

// Test to ensure js loading
// console.log("script loading");

// Hide content divs foursquare and weather
$(".background").hide();
$("#submitBtn").hide();
$("#userCardsLimit").hide();
setTimeout(showSubmitAndLimitBtn, 2500);


// Button submit function, will remove button eventually
$("#submitBtn").on("click", function(event) {
  // Prevent page reloading
  event.preventDefault();
  //emptyout Doms
  $("#forecast").empty();
  $("#activitiesDiv").empty();

  // Test button works
  // console.log("button works");

  // Show divs for weather and foursquare content
  $(".background").show();

  if ($("#inputCity").val()) {


    //ADDing Code --- GABE
    userSearch = $("#userDropDown").val();
    userLimit = $("#userCardsLimit").val();
    let userTempCity = $("#inputCity").val().trim().split(", ");
    userCity = userTempCity[0]
    userState = userTempCity[1];
    userCityandState = userCity + ", " + userState;


    console.log("The user search is", userSearch);
    console.log("The temp city is", userTempCity);
    console.log("The user city is", userCity);
    console.log("the search state is", userState);
    console.log("The user city and state is", userCityandState);
    console.log("The selected limit is", userLimit);


    //AJAX Request for foursquare
    // Put foursquare query here
    var queryURL2 = "https://api.foursquare.com/v2/venues/explore?" + "mode=url" + "&near=" + userCityandState + "&limit=" + userLimit + "&venuePhotos=1" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v=" + currentDate + "&query=" + userSearch;
    $.ajax({
        url: queryURL2,
        method: "GET"
      })
      .done(function(response) {
        // API Object Path
        console.log(response);
        var biz = response.response.groups[0].items;
        if (response.response.groups[0].items.length > 0) {
          for (let i = 0; i < biz.length; i++) {
            // console.log(biz[i]);
            let bizName = biz[i].venue.name;
            let bizRating = biz[i].venue.rating;
            let bizNumber = "";
            if (biz[i].venue.contact.hasOwnProperty('formattedPhone')) {
              bizNumber = biz[i].venue.contact.formattedPhone;
            } else {
              bizNumber = "(No Phone Number)";
            };

            let bizAddress = biz[i].venue.location.address + ",   " + biz[i].venue.location.city + ", " + biz[i].venue.location.state + ", " + biz[i].venue.location.postalCode + "<br> " + bizNumber;
            let bizId = biz[i].venue.id;
            let categories = biz[i].venue.categories[0].name;
            let url = "";
            if (biz[i].venue.hasOwnProperty('url')) {
              url = biz[i].venue.url;
            } else {
              url = "";
            };
            let rating = biz[i].venue.rating;


            // Build Venue Image Url
            let imgPrefix = biz[i].venue.photos.groups[0].items[0].prefix;
            let imgSize = "325x222";
            let imgSuffix = biz[i].venue.photos.groups[0].items[0].suffix;
            let bizImage = imgPrefix + imgSize + imgSuffix;

            let bizCard = $("<div class=card>");
            let imageShadow = $("<div class=shadow>")
            let bizImg = $("<img class=card-img-top img-responsive>");
            let bizBlock = $("<div class=card-block>");
            let bizTitle = $("<h4 class=card-title>");
            let bizCat = $("<a>");
            let bizAddy = $("<p>");
            let bizRate = $("<p>");
            let bizUrl = $("<a>");
            bizCard.css('width', '301');
            bizCard.data("venueid", bizId);
            bizCard.addClass("cardLaunch");
            bizImg.attr('src', bizImage);
            bizImg.css('width', '300');
            bizBlock.addClass('cardPadding');
            bizTitle.html("<b>" + bizName + "</b>");
            bizCat.html("<b>" + categories + "</b><br>");
            bizUrl.html("<a target=\"_blank\" href=" + url + ">Website</a>");
            bizRate.text("Rating " + rating);
            bizAddy.addClass('addressItalic');
            bizAddy.html(bizAddress);
            bizCard.append(imageShadow,bizImg, bizBlock);
            bizBlock.append(bizTitle, bizCat, bizAddy, bizRate, bizUrl);
            $("#activitiesDiv").append(bizCard);
            $("#topPicks").html("<h1>" + userSearch + " Recommendations for " + userCityandState);
          }
        } else {
          $('#activitiesDiv').append(`
                <div class="col">
                  <div class="card clearBackground ">
                    <div class="card-block text-center">
                      <h1>Recommendations</h1>
                      <h4 class="noluck">Ooooo, You must be in one of those Remote Towns. There are no ${userSearch} recommdations in ${userCityandState}. But here's the weather. Try another search category.</h4>
                    </div>
                  </div>
                </div>`);
        }
      });

    // Put Ajax Weather query here
    let lat = "";
    let long = "";
    let cityName = userCityandState;
    var queryURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" +
      cityName + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    $.ajax({
        url: queryURL,
        method: "GET"
      })
      .done(function(response) {
        console.log(response);

        var weather = response.query.results.channel;
        var weatherCity = weather.location.city;
        var weatherRegion = weather.location.region;
        var icon = "<img src='http://l.yimg.com/a/i/us/we/52/" + response.query.results.channel.item.condition.code + ".gif'>"
        lat = response.query.results.channel.item.lat;
        long = response.query.results.channel.item.long;
        // console.log(lat);
        // console.log(long);

        $('#city').text(response.query.results.channel.location.city + ", " + response.query.results.channel.location.region);

        for (i = 0; i < 6; i++) {
          let div = $("<div class=col>");
          let cardDiv = $("<div class=card>");
          let cardBlock = $("<div class=card-block>");
          let icon = $("<img>");

          div.attr("id", "forecast-day" + i);
          div.attr("class", "forecast col");
          cardDiv.addClass("card2");
          cardBlock.addClass("text-center");

          icon.attr("src", "http://l.yimg.com/a/i/us/we/52/" + response.query.results.channel.item.forecast[i].code + ".gif");
          icon.attr("class", "icon con text-center");

          div.append(cardDiv);
          cardDiv.append(cardBlock);
          cardBlock.append(icon);
          cardBlock.append("<br>" + response.query.results.channel.item.forecast[i].day + "<br>" + response.query.results.channel.item.forecast[i].high + "&#8457" + "<br>" + response.query.results.channel.item.forecast[i].text);
          $('#forecast').append(div);
        }
      });


    //Pushing to firebase
    database.ref().set({
      // userSearch: userSearch,
      userCity: userCity,
      userState: userState,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }
  //End of if Statment
  //using Template Literals
  else {
    $('#forecast').append(`
      <div class="col">
        <div class="card clearBackground">
          <div class="card-block text-center">
            <h4>Please enter a US City to see Weather</h4>
          </div>
        </div>
      </div>`);
    $('#activitiesDiv').append(`
        <div class="col">
          <div class="card clearBackground ">
            <div class="card-block text-center">
              <h1>Recommendations</h1>
              <h4>Please enter a US City to see Recommendations</h4>
            </div>
          </div>
        </div>`);
  }
});

$(document).on("click", ".cardLaunch", function(){
var venueID = $(this).data("venueid");
console.log(venueID);

var queryURL3 = "https://api.foursquare.com/v2/venues/" + venueID + "/similar?" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v=" + currentDate;
$.ajax({
    url: queryURL3,
    method: "GET"
  })
  .done(function(response) {
    console.log(response);


});

var queryURL4 = "https://api.foursquare.com/v2/venues/" + venueID + "?" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v=" + currentDate;
$.ajax({
    url: queryURL4,
    method: "GET"
  })
  .done(function(response) {
    console.log(response);
});






});




var counter = 0;
setInterval(function() {
  $("#mainImage").prop("class", "stage" + counter);
  if (counter === 3) {
    counter = 0;
  } else {
    counter++;
  }
}, 5000);

function showSubmitAndLimitBtn() {
  $("#submitBtn").fadeIn("milliseconds")
  $("#userCardsLimit").fadeIn("milliseconds")
};
