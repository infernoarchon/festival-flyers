


// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    console.log(data[i].dataend)
    if(moment().isBefore(data[i].dataend)){
    $("#articles").append("<div id='" + data[i].eventid + "' class='article-container d-flex justify-content-between'><p class='pt-1' data-image='" + data[i].image + "'><a href='#'>" + data[i].title + "</a><br><span class='concert-date'>" + data[i].date.replace('all-day','') +"</span></p><i class='favorite-icon fas fa-heart mt-2 ml-1' data-id='" + data[i]._id + "'></div>");
    }
  }
});

//Whenever someone clicks on a concert title
$(document).on("click", "p", function() {
  $("img").attr("src",$(this).attr("data-image"))
  })

$(document).on("click", ".fa-sync-alt", function() {
  let alleventids = []
  $('#articles').children('div').each(function(){
    alleventids.push($(this).attr('id')); // To save the class names
  })
  console.log(alleventids)
  $("#articles").empty();
    $.ajax({
    method: "POST",
    url: "/scrape",
    data: {eventids: alleventids}
    }).then(
      function() {
        // Reload the page to get the updated list
        location.reload();
      })
})





// Whenever someone clicks a p tag

$(document).on("click", "button", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
