

// Grab the articles as a json
function showEvents() {
  $.getJSON("/articles", function(data) {
  // For each one
  $("#articles").empty();
  let event = data
  event.sort(compare);
  console.log(event)
  for (var i = 0; i < event.length; i++) {
    // Display the apropos information on the page
    if(moment().isBefore(event[i].dataend)){
    $("#articles").append("<div id='" + event[i].eventid + "' class='article-container d-flex justify-content-between'><p data-_id = '" + event[i]._id + "'class='pt-1 event-title' data-image='" + event[i].image + "'><a href='#'>" + event[i].title + "</a><br><span class='concert-date'>" + event[i].date.replace('all-day','') +"</span></p></div>");
    }
  }
  })
};

function compare(a,b) {
  if (moment(a.dataend) < moment(b.dataend))
    return -1;
  if (moment(a.dataend) > moment(b.dataend))
    return 1;
  return 0;
}

//Whenever someone clicks a note 


//Whenever someone clicks on a concert title
$(document).on("click", ".navbar-brand", function() {
  location.reload();
})
$(document).on("click", ".event-title", handleArticleNotes)
$(document).on("click", ".event-title", function() {
  $("img").attr("src",$(this).attr("data-image"))
  $(".zoom").removeClass("zoomed")
})

$(document).on("click", ".icon-container", function() {
  $("#right-nav").toggleClass("invisible")
  $(".comment-icon").toggleClass("fa-times")
  $(".comment-icon").toggleClass("fa-comment")
  $(".flyer-container").toggleClass("flyer-container-sm")
  $(".wrapper").toggleClass("justify-content-between")
})



$(document).on("submit", "#message-form", handleNoteSave)

// function() {
//   console.log($(this).data()._id)
//   handleArticleNotes
  // })

  $('.chat-input').keypress(function (e) {
    if (e.which == 13) {
      $('#message-form').submit();
      return false;    //<---- Add this line
    }
  });

//Magnify

$(document).on("click", ".zoom", function() {
  console.log("clicked zoom")
  $(".zoom").addClass("zoomed")
  })
$(document).on("click", ".zoomed", function() {
  console.log("clicked zoom")
  $(".zoom").removeClass("zoomed")
  })


$(document).on("click", ".fa-sync-alt", function() {
  $(this).toggleClass("spin")
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


function renderNotesList(data) {
  // This function handles rendering note list items to our notes modal
  // Setting up an array of notes to render after finished
  // Also setting up a currentNote variable to temporarily store each note
  var notesToRender = [];
  var currentNote;
  notesToRender.push(currentNote);
  if (!data.notes.length) {
    // If we have no notes, just display a message explaining this
    // currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
    notesToRender.push(currentNote);
  } else {
    // If we do have notes, go through each one
    for (var i = 0; i < data.notes.length; i++) {
      // Constructs an li element to contain our noteText and a delete button
      currentNote = $("<li class='list-group-item note'>")
        .html("<strong><span class='user-id'>User #" + data.notes[i]._id + "</span></strong><br>" + data.notes[i].noteText)
        // .append($("<button class='btn btn-danger note-delete'>x</button>"));
      // Store the note id on the delete button for easy access when trying to delete
      // currentNote.children("button").data("_id", data.notes[i]._id);
      // Adding our currentNote to the notesToRender array
      notesToRender.push(currentNote);
    }
  }
  // Now append the notesToRender to the note-container inside the note modal
  $(".note-container").append(notesToRender.reverse());
}

function handleArticleNotes(event) {
  $(".icon-container").removeClass("invisible")
  $(".note-container").empty();
  // This function handles opening the notes modal and displaying our notes
  // We grab the id of the article to get notes for from the card element the delete button sits inside
  var currentArticle = $(this)
    .data();
  // Grab any notes with this headline/article id
  $.get("/api/notes/" + currentArticle._id).then(function(data) {
    // Constructing our initial HTML to add to the notes modal
    console.log("Handle data is", data)
    // Adding the formatted HTML to the note modal
    var noteData = {
      _id: currentArticle._id,
      notes: data || []
    };
    // Adding some information about the article and article notes to the save button for easy access
    // When trying to add a new note
    $(".btn.save").attr("data-store", noteData._id);
    // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
    renderNotesList(noteData);
  });
}

function handleNoteSave(e) {
  e.preventDefault()
  
  $(".right-nav-middle").scrollTop(0)
  // This function handles what happens when a user tries to save a new note for an article
  // Setting a variable to hold some formatted data about our note,
  // grabbing the note typed into the input box
  let noteData;
  let newNote = $("textarea")
    .val()
    .trim();
  // If we actually have data typed into the note input field, format it
  // and post it to the "/api/notes" route and send the formatted noteData as well
  if (newNote) {
    noteData = { _eventId: $(this).find("button").attr("data-store"), noteText: newNote};
    $.post("/api/notes", noteData, function(data) {
      console.log(data)
      $("textarea").val('')
      addedNote = $("<li class='list-group-item note'>")
        .html("<strong><span class='user-id'>You</span></strong><br>" + newNote)
        // .append($("<button class='btn btn-danger note-delete'>x</button>"));
      // Store the note id on the delete button for easy access when trying to delete
      // Adding our currentNote to the notesToRender array
  // Now append the notesToRender to the note-container inside the note modal
      $(".note-container").prepend(addedNote);


    });
  }
}

showEvents()
