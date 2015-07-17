var profile = require("./profile.js");
var renderer = require("./renderer.js");
var queryString = require("querystring");

var commonHeader = {'Content-Type': 'text/html'}
var home = function (request, response) {
  if (request.url === "/") {
    if (request.method.toLowerCase() === "get") { 
      response.writeHead(200, commonHeader);
      //render page
      renderer.view("header", {}, response); 
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    }
    //for post requests
    else {
      request.on("data", function (postBody) {
        var query = queryString.parse(postBody.toString());
        response.writeHead(303, {Location: "/" + query.username});
        response.write(query.username);
        response.end();
      });
    }
  }
}

var user = function (request, response) {
  var username = request.url.replace("/", "");
  if (username.length > 0) {
    response.writeHead(200, commonHeader);
    renderer.view("header", {}, response); 
    
    //get JSON using functions in profile.js
    var studentProfile = new profile(username);
    
    //on JSON error
    studentProfile.on("error", function (error) {
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });
    
    //on end of JSON
    studentProfile.on("end", function(profileJSON) {
      
      //extract values that we need from JSON
      var values = {
        avatarURL: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badgeCount: profileJSON.badges.length,
        javaScriptPoints: profileJSON.points.JavaScript,
      };
      
      //render profile
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });
  }
}
    
module.exports.home = home;
module.exports.user = user;
