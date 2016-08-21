import 'babel-polyfill';
import 'babel-core/register';
import axios from '../js/utils/APIHelper';

const jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };
global.documentRef = document;

axios.defaults.baseURL = 'http://example.com/';
