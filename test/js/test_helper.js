import "babel-polyfill";
import "babel-core/register";

let jsdom = require("jsdom").jsdom;
global.document = jsdom("");
global.window = document.defaultView;
global.navigator = { userAgent: "node.js" };
global.documentRef = document;

import axios from "../../web/static/js/utils/APIHelper";
axios.defaults.baseURL = "http://example.com/";
