var fs = require("fs");

var mergeValues = function (values, content) {
  for (var key in values) {
    content = content.replace("{{" + key + "}}", values[key]);
  }
  return content;
}

var view = function (template, values, response) {
  //read from template
  var fileContents = fs.readFileSync("./views/" + template + ".html", {encoding: "utf-8"});
  //merge values
  fileContents = mergeValues(values, fileContents);
  //write content back to router
  response.write(fileContents);
}

module.exports.view = view;