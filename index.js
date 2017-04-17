/* eslint-env node */
const DO = require('./do.js');
const AWS = require('./aws.js');
const fs = require('fs-extra');

var doList = null;
var awsList = null;
var merger = [];

var rancherMachineDefaults = {
  'hostDetails': [
    {
      'driver': 'rancher',
      'flavorPrefix': 'Amazon',
      'name': null,
      'publicValues': {
        'accessKey': ''
      },
      'secretValues': {
        'secretKey': ''
      },
    },
    {
      'driver': 'rancher',
      'flavorPrefix': 'Digital Ocean',
      'name': null,
      'secretValues': {
        'accessToken': ''
      },
    },
    {
      'driver': 'rancher',
      'flavorPrefix': 'Packet',
      'name': null,
      'publicValues': {
        'projectId': '',
      },
      'secretValues': {
        'apiKey': ''
      },
    },
  ],
  'realmNames': [
    {
      'id': 'all',
      'name': 'All',
      'translationKey': 'realmNames.all'
    },
    {
      'id': 'us-west',
      'name': 'US West',
      'translationKey': 'realmNames.usWest'
    },
    {
      'id': 'us-east',
      'name': 'US East',
      'translationKey': 'realmNames.usEast'
    },
    {
      'id': 'asia',
      'name': 'asia',
      'translationKey': 'realmNames.asia'
    },
    {
      'id': 'eu-west',
      'name': 'eu-west',
      'translationKey': 'realmNames.euWest'
    },
    {
      'id': 'eu-east',
      'name': 'eu-east',
      'translationKey': 'realmNames.euEast'
    },
  ],
};

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
    var neuFile = rancherMachineDefaults;
    neuFile.realms = merger;
    fs.writeFile('./plans.js', JSON.stringify(neuFile), (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      process.exit(0);
    });
    // process.exit(0);
  });
});
