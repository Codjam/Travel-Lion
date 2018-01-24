//  Adding FireBase and inital Vars
var config = {
  apiKey: "AIzaSyDwcoCJMFHEz4FwOu0FadWtNo3tX9duiq8",
  authDomain: "travellion-1515776976948.firebaseapp.com",
  databaseURL: "https://travellion-1515776976948.firebaseio.com",
  projectId: "travellion-1515776976948",
  storageBucket: "travellion-1515776976948.appspot.com",
  messagingSenderId: "548012688737"
};
firebase.initializeApp(config);

// Intial Vars
var database = firebase.database();
var userCity = "";
var userState = "";
var userCityandState = "";
var userSearch = "";
var userLimit = 12;
var currentDate = moment().format('YYYYMMDD');
var lat = "";
var lng = "";
// console.log("the date is", currentDate);

// foursquare API keys
var client_id = "PIJMX4JSYGX0LTGVJZGWQ13AOZBUJ4TDD3QJ32QR2CN1OMDN";
var client_secret = "U0BF5HKPA54ZB4KPTDIPAZLCV3X4435YPVCBUZAZEWTKVL42";
//End FireBase and inital Vars



// Hide content divs foursquare and weather
$("#submitBtn").css({
  "visibility": "visible"
});
$("#submitBtn").hide();
$("#userCardsLimit").hide();
setTimeout(showSubmitAndLimitBtn, 1000);

// **************************Submit Button***************************************************************************************
// Button submit function, will remove button eventually
$("#submitBtn").on("click", function(event) {
      // Prevent page reloading
      event.preventDefault();
      //emptyout Activites and Weather Doms
      $("#forecast").empty();
      $("#activitiesDiv").empty();

      $(".background").css({
        "visibility": "visible"
      });
//iF Statment to make sure user has entered in correct information.  Makes to AJAX calls.
// 1. to foursquare (Query1) and the other to Yahoo weather (Query2).
      if ($("#inputCity").val()) {
            userSearch = $("#userDropDown").val();
            userLimit = $("#userCardsLimit").val();
            let userTempCity = $("#inputCity").val().trim().split(", ");
            userCity = userTempCity[0]
            userState = userTempCity[1];
            userCityandState = userCity + ", " + userState;

            // console.log("The user search is", userSearch);
            // console.log("The temp city is", userTempCity);
            // console.log("The user city is", userCity);
            // console.log("the search state is", userState);
            // console.log("The user city and state is", userCityandState);
            // console.log("The selected limit is", userLimit);

// **************************AJAX REQUEST********************************************************************************************

            //AJAX Request for foursquare
            var queryURL1 = "https://api.foursquare.com/v2/venues/explore?" + "mode=url" + "&near=" + userCityandState
            + "&limit=" + userLimit + "&venuePhotos=1" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v="
            + currentDate + "&query=" + userSearch;

            $.ajax({
                url: queryURL1,
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
                      }
                      else {
                       bizNumber = "(No Phone Number)";
                    };

                    let bizAddress = biz[i].venue.location.address + ",   " + biz[i].venue.location.city + ", " + biz[i].venue.location.state
                      + ", " + biz[i].venue.location.postalCode + "<br> " + bizNumber;

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
                    // End of Build Venue Image Url

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
                    // bizUrl.html("<a target=\"_blank\" href=" + url + ">Website</a>");
                    bizRate.text("Rating " + rating);
                    bizAddy.addClass('addressItalic');
                    bizAddy.html(bizAddress);
                    bizCard.append(imageShadow, bizImg, bizBlock);
                    bizBlock.append(bizTitle, bizCat, bizAddy, bizRate, bizUrl);
                    $("#activitiesDiv").append(bizCard);

                    // $("#activitiesDiv").append(`
                    //   <div class="card cardLaunch bizCardFormat" data-venueid="${bizId}">
                    //     <div>
                    //      <img src="${bizImage}" class="card-img-top img-responsive bizImageFormat" alt="Venue Image">
                    //      <div class="card-block cardPadding">
                    //        <h4 class="card-title"><b>${bizName}</b></h4>
                    //         <b>${categories}</b>
                    //         <p class="addressItalic">${bizAddress}</p>
                    //        <p>Rating: ${rating}</p>
                    //       </div>
                    //     </div>
                    //   </div>
                    // `);
                    $("#topPicks").html("<h1>" + userSearch + " Recommendations for " + userCityandState);
                  }
                } else {
                    $('#activitiesDiv').append(`
                      <div class="col">
                        <div class="card">
                          <div class="card-block text-center">
                            <h1>Recommendations</h1>
                            <h4 class="noluck">Ooooo, You must be in one of those Remote Towns. There are no ${userSearch} recommdations in ${userCityandState}. But here's the weather. Try another search category.</h4>
                          </div>
                        </div>
                      </div>`);
                    }
              });
// End of AJAX Request for foursquare

// Yahoo Weather AJax Request
            let lat = "";
            let long = "";
            let cityName = userCityandState;
            var queryURL2 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" +
              cityName + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

            $.ajax({
                url: queryURL2,
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

                $('#city').text("Weather: " + response.query.results.channel.location.city + ", " + response.query.results.channel.location.region);
                $('#city').addClass("weatherHeadline2");
                for (i = 0; i < 6; i++) {
                  let code = response.query.results.channel.item.forecast[i].code;
                  let day = response.query.results.channel.item.forecast[i].day;
                  let highTemp = response.query.results.channel.item.forecast[i].high;
                  let lowTemp = response.query.results.channel.item.forecast[i].low;
                  let condition = response.query.results.channel.item.forecast[i].text;
                  let div = $("<div class=col>");
                  let cardDiv = $("<div class=card>");
                  let cardBlock = $("<div class=card-block>");
                  let icon = $("<img>");
                  if (i === 0) {
                    day = "Today";
                  };

                  div.attr("id", "forecast-day" + i);
                  div.attr("class", "forecast col");
                  // cardDiv.addClass("card4");
                  cardBlock.addClass("text-center");

                  icon.attr("src", "http://l.yimg.com/a/i/us/we/52/" + response.query.results.channel.item.forecast[i].code + ".gif");
                  icon.attr("class", "icon con text-center");

                  div.append(cardDiv);
                  cardDiv.append(cardBlock);
                  cardBlock.append(icon);
                  cardBlock.append("<br>" + day + "  " + highTemp + " /" + lowTemp + "&#8457" + "<br>" + condition);
                  $('#forecast').append(div);
                }
              });


            //Pushing to firebase
            database.ref().push({
              // userSearch: userSearch,
              userCity: userCity,
              userState: userState,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
          }
  //End of if Statment
          else {
            $('#forecast').append(`
                <div class="col">
                  <div class="card">
                    <div class="card-block text-center">
                    <h4>Please enter a US City to see Weather</h4>
                  </div>

                </div>
             </div>
            `);
          $('#activitiesDiv').append(`
            <div class="col">
             <div class="card">
              <div class="card-block text-center">

              <h1>Recommendations</h1>
              <h4>Please enter a US City to see Recommendations</h4>
            </div>
           </div>
          </div>
        `);
       }
});
// End of submit click button Function
// **************************End***************************************************************************************




// Modal that launches on cardclick
var modal = document.getElementById('myModal');
// Get the button that opens the modal
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// **************************Card Click Function**************************************************************************
// Two Ajax Requests, 1. to foursquare (Query3) for to retrive that venues information and userTips (Query4) and the other to ticketmaster(Query5)
// to gather liveEvents near the user.
$(document).on("click", ".cardLaunch", function() {
      modal.style.display = "block";
      var venueID = $(this).data("venueid");

      var queryURL3 = "https://api.foursquare.com/v2/venues/" + venueID + "/similar?" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v=" + currentDate;
      $.ajax({
          url: queryURL3,
          method: "GET"
        })
        .done(function(response) {
          console.log(response);

          var simPlaces = response.response.similarVenues;
          $("#similarNameSlogan").append(`
            <div class=" col">
              <h3 class="text-center">Similar Venues</h3>
            </div>
          `);

          for (let i = 0; i < 4; i++) {
            let simName = simPlaces.items[i].name;
            let simNumber = "";
            if (simPlaces.items[i].contact.hasOwnProperty('formattedPhone')) {
                simNumber = simPlaces.items[i].contact.formattedPhone;
              } else {
                simNumber = "(No Phone Number)";
            };

            let simAddress = simPlaces.items[i].location.address + ", " + simPlaces.items[i].location.city + ", " + simPlaces.items[i].location.state + ", " + simPlaces.items[i].location.postalCode + "<br> " + simNumber;
            let url = "";
            if (simPlaces.items[i].hasOwnProperty('url')) {
                url = simPlaces.items[i].url;
              } else {
                url = "";
            };
            $("#similar").append(`
              <div class=" col-md-3 ">
                <div class="card">
                  <div class="card-block cardPadding">
                    <div>
                    <h5>${simName}</h5>
                    <div class="addressItalic">${simAddress}</div><br>
                    <a href="${url}"target="_blank">Website</a>
                  </div>
                </div>
              </div>
            </div>
          `)
        }
      });
    // End of foursquare request

    // Foursquare user tips Ajax Request
      var queryURL4 = "https://api.foursquare.com/v2/venues/" + venueID + "?" + "&client_id=" + client_id + "&client_secret=" + client_secret + "&v=" + currentDate;
      $.ajax({
          url: queryURL4,
          method: "GET"
        })
        .done(function(response) {
          console.log(response);
          lat = response.response.venue.location.lat;
          lng = response.response.venue.location.lng;
          var venueClicked = response.response.venue;
          let venueName = venueClicked.name;
          let venueRating = venueClicked.rating;
          let venueNumber = "";
          if (venueClicked.contact.hasOwnProperty('formattedPhone')) {
              venueNumber = venueClicked.contact.formattedPhone;
            } else {
              venueNumber = "(No Phone Number)";
          };

          let venueAddress = venueClicked.location.address + ",   " + venueClicked.location.city + ", " + venueClicked.location.state + ", " + venueClicked.location.postalCode + "<br> " + venueNumber;
          let categories = venueClicked.categories[0].name;
          let url = "";
          if (venueClicked.hasOwnProperty('url')) {
              url = venueClicked.url;
            } else {
              url = "";
          };
          let rating = venueClicked.rating;

          // Build Venue Image Url
          let imgPrefix = venueClicked.photos.groups[0].items[0].prefix;
            let imgSize = "500x500";
            let imgSuffix = venueClicked.photos.groups[0].items[0].suffix;
          let venueImage = imgPrefix + imgSize + imgSuffix;

          var venueTips = response.response.venue.tips.groups[0];
          for (var i = 0; i < 4; i++) {

              let userTipsText = venueTips.items[i].text;
              let userTipperFirstName = venueTips.items[i].user.firstName;
              let userTipperLastName = "";
              if (venueTips.items[i].user.hasOwnProperty('lastName')) {
                userTipperLastName = venueTips.items[i].user.lastName;
            } else {
              userTipperLastName = "";
              };

            let userTipperName = userTipperFirstName + " " + userTipperLastName;
            let userTipPhotoPrefix = response.response.venue.tips.groups["0"].items[i].user.photo.prefix;
            let userTipPhotoSize = "45x45";
            let userTipPhotoSuffix = response.response.venue.tips.groups["0"].items[i].user.photo.suffix;
            let userTipPhoto = userTipPhotoPrefix + userTipPhotoSize + userTipPhotoSuffix;
            var venueLat = venueClicked.location.lat;
            var venueLng = venueClicked.location.lng;
            $("#userTips").append(`
              <div class="card">
                <div class="card-block cardPadding">
                  <div>
                  </div>
                  <span><img src="${userTipPhoto}" alt="">
                  <b>${userTipperName}</b></span> <br><br>
                  ${userTipsText} <br> <br>
                </div>
              </div>
            `)
          }

          $("#cardClickedShow").append(`
            <div class="card-img-top img-responsive">
              <img src="${venueImage}" alt="">
            </div>
            <div class="card-block cardPadding">
              <div class="card-title">
                <h5>${venueName}</h5> <br>
                <h6>${categories} </h6>
                <div class="addressItalic">${venueAddress}</div>
                <br>Rating: ${rating}
                <br><a href="${url}"target="_blank">Website</a>
              </div>

            </div>
          `);
    // Calling funtion that sets the events miles and radius for ticketmaster
        windowAppear(4, 5);
      });
    // End of Foursquare user tips Ajax Request

});
// ************************** End Card Click Function**************************************************************************

    // Ticketmaster Ajax Request
function windowAppear(eventsLength, radius) {
  let apiKey = "9AA0Y5Keollt4AMn15i3aZl2Ui1z8Rgm";
  let startDateTime = moment().format();
  let endDateTime = moment().add(1, 'months');
  endDateTime = moment(endDateTime).format();
  let latLong = (lat + "," + lng).toString();
  let queryURL5 = "https://app.ticketmaster.com/discovery/v2/events.json?" + "sort=date,asc" + "&startDateTime=" + startDateTime
  + "&endDateTime=" + endDateTime + "&latlong=" + latLong + "&radius=" + radius + "&apikey=" + apiKey;

  if (eventsLength === 4) {
      $(".modal-content").append(`<div id="liveEvents" class ="row" ></div>`);
    } else {
      $("#myModal").append(`<div id="liveEvents" class ="row" ></div>`);
    }
    $("#eventsNameSlogan").append(`
    <div class=" col">
      <h3 class="text-center">Live Events</h3>
    </div>
  `);
  $.ajax({
    type: "GET",
    url: queryURL5,
    async: true,
    dataType: "json",
  }). done(function(response) {
      console.log(response);
      let event = response._embedded.events


      for (i = 0; i < eventsLength; i++) {
        let eventName = event[i].name;
        let eventAddress = event[i]._embedded.venues[0].address.line1 + ",   " + event[i]._embedded.venues[0].name +
          ",   " + event[i]._embedded.venues[0].city.name + ", " + event[i]._embedded.venues[0].state.stateCode +
          ", " + event[i]._embedded.venues[0].postalCode;
        let eventDate = moment(event[i].dates.start.dateTime).format('lll');

        //   // Build Venue Image Url
        let eventImageUrl = event[i].images[0].url;
        let eventTicketUrl = event[i].url;
        $("#liveEvents").append(`
          <div class="card" id="eventLive">
              <div class="card-img-top ">
              <img src="${eventImageUrl}" class="img-responsive eventImage" alt="">
            </div>
            <div class="card-block liveEventCardFormat">
              <h5 class="event-title card-title">${eventName}</h5>
              <p class="addressItalic">${eventAddress}</p>
              <p class="event-day">${eventDate}</p>
            </div>
            <div class="card-footer text-center">
              <a href="${eventTicketUrl}" target="_blank">Tickets</a>
            </div>
          </div>
        `)
      }
      if (eventsLength === 4) {
        $("#moreEvents").append(`<div class="col text-center" style = 'color:#0000FF; font-size: 18px; cursor: pointer'>... more events</div>`);
      };
    });
};
// End of Ticketmaster Ajax Request

$(document).on("click", "#moreEvents", function() {

  modal.style.display = "none";

  $("#cardClickedShow").empty();
  $("#userTips").empty();
  $("#similar").empty();
  $("#liveEvents").empty();
  $("#similarNameSlogan").empty();
  $("#eventsNameSlogan").empty();
  $("#moreEvents").empty();

  modal.style.display = "block";
  windowAppear(24, 30);
  })

span.onclick = function() {
  modal.style.display = "none";

  $("#cardClickedShow").empty();
  $("#userTips").empty();
  $("#similar").empty();
  $("#liveEvents").empty();
  $("#similarNameSlogan").empty();
  $("#eventsNameSlogan").empty();
  $("#moreEvents").empty();

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";

    $("#cardClickedShow").empty();
    $("#userTips").empty();
    $("#similar").empty();
    $("#liveEvents").empty();
    $("#similarNameSlogan").empty();
    $("#eventsNameSlogan").empty();
    $("#moreEvents").empty();


  }
}

function showSubmitAndLimitBtn() {
  $("#submitBtn").fadeIn(1000);
  $("#userCardsLimit").fadeIn(1000);
};
