// Grab the articles as a json

$.getJSON("/articles", function(data) {
  var articleCount = (data.length -1)
  // For each one
  for (i = articleCount; i > 0; i--) {
console.log(data.length);
    // Display the apropos information on the page
    $("#articles").append("<p>" 
    + "<a href=" + data[i].link + " >"
    + "<img src=" + data[i].image 
    + " />" + "<br />" 
    + "<h2>"
    + data[i].title
    + "</h2>" 
    + "<br />" 
    + "</a>"
    + "<button data-id='" + data[i]._id + "' class='note'>Comment</button>"
    + "<button data-id='" + data[i]._id + "' class='delete-article'>Delete Article</button>"
    + "</p>");
  }
});

$(document).on("click", ".delete-article", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/article/delete/" + thisId
  }).then(function(data){
    location.reload();
  })
})

// Whenever someone clicks a comment button
$(document).on("click", ".note", function() {
  // Empty the note from the note section
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
      $("#notes").append("<h3>" + data.title + "</h3>");
      // previous comments
      $("#notes").append("<div id='comment-box'></div>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='username'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='comment'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='submitnote'>Submit Comment</button>");

      // If there's a note in the article
      if (data.note) {
        for(i=0;i<data.note.length; i++){
        // Place the title of the note in the title input
        $("#comment-box").append(data.note[i].title);
        // Place the body of the note in the body textarea
        $("#comment-box").append(": " + data.note[i].body + " ");
        $("#comment-box").append("<button data-id='" + data.note[i]._id + "' id='delete'>x</button>");
        $("#comment-box").append("<br>");
        }
      }
    });
});

// When you click the submit comment button
$(document).on("click", "#submitnote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
console.log(thisId);
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
      
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#comment-box").empty();
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data){
    for(i=0;i<data.note.length; i++){
      // Place the title of the note in the title input
      $("#comment-box").append(data.note[i].title);
      // Place the body of the note in the body textarea
      $("#comment-box").append(": " + data.note[i].body + " ");
      $("#comment-box").append("<button data-id='" + data.note[i]._id + "' id='delete'>x</button>");
      $("#comment-box").append("<br>");
      }
  })
});

$(document).on("click", "#delete", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/delete/" + thisId
  }).then(function(data){
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(data){
      $("#comment-box").empty();
      for(i=0;i<data.note.length; i++){
        // Place the title of the note in the title input
        $("#comment-box").append(data.note[i].title);
        // Place the body of the note in the body textarea
        $("#comment-box").append(": " + data.note[i].body + " ");
        $("#comment-box").append("<button data-id='" + data.note[i]._id + "' id='delete'>x</button>");
        $("#comment-box").append("<br>");
        }
    })
  })
})

