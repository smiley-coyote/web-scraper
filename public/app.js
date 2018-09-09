// Grab the articles as a json

$.getJSON("/articles", function(data) {

  // For each one
  for (var i = 0; i < data.length; i++) {

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
    + "<button data-id='" + data[i]._id + "' class='comment'>Comment</button>"
    + "</p>");
  }
});


// Whenever someone clicks a comment button
$(document).on("click", ".comment", function() {
  console.log("click");
  // Empty the comments from the note section
  $("#comments").empty();
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
      // image of article
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='submitcomment'>Save Note</button>");

      // If there's a note in the article
      if (data.comment) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comment.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#submitcomment", function() {
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
      // Empty the comments section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});