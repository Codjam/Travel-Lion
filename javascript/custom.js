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
  var queryURL2 = "https://api.foursquare.com/v2/venues/explore?" + "mode=url" + "&near=" + userCityandState + "&limit=6" + "&venuePhotos=1" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v=20180112" + "&q=Fun";
  $.ajax({
    url: queryURL2,
    method: "GET"
  })
  .done(function(response){
      // API Object Path
     console.log(response);
      let biz = response.response.groups[0].items;

      for(var i = 0; i < biz.length; i++ ){
          console.log(biz[i]);
          var bizName = biz[i].venue.name;
          var bizRating = biz[i].venue.rating;
          var bizCity = biz[i].venue.location.city;
          var bizAddress = biz[i].venue.location.address;
          var bizId = biz[i].venue.id;

          // Build Venue Image Url
          var imgPrefix = biz[i].venue.photos.groups[0].items[0].prefix;
          var imgSize = "325x222";
          var imgSuffix = biz[i].venue.photos.groups[0].items[0].suffix;
          var bizImage = imgPrefix+imgSize+imgSuffix;


          let bizCard = $("<div class=card>");
          let bizImg = $("<img class=card-img-top img-responsive>");
          let bizBlock = $("<div class=card-block>");
          let bizTitle = $("<h4 class=card-title>");
          let bizCity1 = $("<p>");
          let bizAddy = $("<p>");
          bizCard.css('width', '301');
          bizImg.attr('src', bizImage);
          bizImg.css('width', '300');
          bizTitle.text(bizName);
          bizCity1.text(bizCity);
          bizAddy.text(bizAddress)
          // bizID1.text(bizId)
          bizCard.append(bizImg);
          bizCard.append(bizBlock);
          bizBlock.append(bizTitle);
          bizBlock.append(bizAddy);
          bizBlock.append(bizCity1);
          $("#activitiesDiv").append(bizCard);
}
});


//
//   printSearchResults: function (bizName, starWidth, bizCity, bizImage, bizId  ){
//         $('html, body').scrollTop(300);
//         appFuncs.favorites.favClicked = false;
//         $(".results").append(`
//             <div class="card--Result" data-venueid="${[bizId]}">
//                 <div class="card--Result__Img">
//                     <img src="${[bizImage]}" alt="" width="100%" class="img-responsive">
//                     <div class="shadow cardLaunch" data-venueid="${[bizId]}"></div>
//                                 <div class="cardFavBtn favThisBtn" data-venueid="${[bizId]}"><i class="fa fa-star-o favStar " aria-hidden="true"></i></div>
//                 </div>
//                 <div class="card--Result__Info cardLaunch" data-venueid="${[bizId]}">
//                     <h3 class="card--Title" title="${[bizName]}">${[bizName]}</h3>
//                     <div class="card--Rating">
//                         <div class="card--Rating__Overlay" style=width:${[starWidth]}>
//                             <img src="assets/imgs/starsFill.png" alt="">
//                         </div>
//                     </div>
//                     <div class="card--Location">
//                         <p><span><img src="assets/imgs/cardLocation.png" alt=""></span>${[bizCity]}</p>
//                     </div>
//                 </div>
//             </div>
//         `);
//     },
// },


  // Put Ajax Weather query here
  let lat = "";

        let long  = "";
        let cityName = userCityandState
        let queryURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"
        + cityName + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

         $.ajax({
          url: queryURL,
          method: "GET"
        })
        .done(function(response) {
          console.log(queryURL);

          console.log(response);

          $('#city').text(response.query.results.channel.location.city + ", " + response.query.results.channel.location.region);

          let icon = "<img src='http://l.yimg.com/a/i/us/we/52/" + response.query.results.channel.item.condition.code + ".gif'>"

          $('#icon').html(icon);
          $('#temp').html(response.query.results.channel.item.condition.temp + "&#8457");
          $('#condition').text(response.query.results.channel.item.condition.text);

          lat = response.query.results.channel.item.lat;

          long = response.query.results.channel.item.long;

          console.log(lat);
          console.log(long);

          for(i = 1; i < 5; i++) {

            let icon = $("<img>");

            icon.attr("src", "http://l.yimg.com/a/i/us/we/52/" + response.query.results.channel.item.forecast[i].code + ".gif");
            icon.attr("class", "icon");

            let div = $("<div>");

            div.attr("id", "forecast-day" + i);
            div.attr("class", "forecast");


            $('#forecast').append(div);

            $('#forecast-day' + i).html(response.query.results.channel.item.forecast[i].day + "  " + response.query.results.channel.item.forecast[i].high + "&#8457");

            $('#forecast-day' + i).append(icon);

            }
});

  //Pushing to firebase
  database.ref().push({
    // userSearch: userSearch,
    userCity: userCity,
    userState: userState,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  return false;
});
