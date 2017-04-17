/* eslint-env node */
const DO = require('./do.js');
const AWS = require('./aws.js');
const fs = require('fs-extra');

var doList = null;
var awsList = null;
var merger = [];
DO.getRegions((err, results) => {
  if (err) {
    process.exit(1);
  }
  doList = results;
  AWS.parseAWS((er, res) => {
    if (er) {
      process.exit(1);
    }
    awsList = res;
    merger = doList.concat(awsList);
    // debugger;
    fs.writeJson('./plans.json', merger, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      process.exit(0);
    });
    // process.exit(0);
  });
});
