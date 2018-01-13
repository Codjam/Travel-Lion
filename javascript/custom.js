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

  // Put Ajax Weather query here


  // Put foursquare query here


  return false;
});
