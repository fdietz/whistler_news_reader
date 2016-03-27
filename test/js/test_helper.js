import "babel-polyfill";
import "babel-core/register";

let jsdom = require("jsdom").jsdom;
// let exposedProperties = ["window", "navigator", "document"];

global.document = jsdom("");
global.window = document.defaultView;


// Object.keys(document.defaultView).forEach((property) => {
//   if (typeof global[property] === "undefined") {
//     exposedProperties.push(property);
//     global[property] = document.defaultView[property];
//   }
// });
//
global.navigator = {
  userAgent: "node.js"
};

global.documentRef = document;
