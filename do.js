/* eslint-env node */
const PDN = {
  '1gb': {
    name: 'Mini'
  },
  '2gb': {
    name: 'Small'
  },
  '4gb': {
    name: 'Medium'
  },
  '8gb': {
    name: 'Large'
  },
  '16gb': {
    name: 'Extra Large'
  },
  '32gb': {
    name: 'Mega'
  },
  '48gb': {
    name: 'Gigantic'
  },
  '64gb': {
    name: 'Colossal'
  },
};

const REALMS = {
  'ams1': 'eu-west',
  'ams2': 'eu-west',
  'ams3': 'eu-east',
  'blr1': 'asia',
  'fra1': 'eu-west',
  'lon1': 'eu-west',
  'nyc1': 'us-west',
  'nyc2': 'us-east',
  'nyc3': 'us-east',
  'sfo1': 'us-west',
  'sfo2': 'us-west',
  'sgp1': 'asia',
  'tor1': 'canada',
}

require('dotenv').config();
const YAML = require('yamljs');
const digitalocean = require('digitalocean');
const client = digitalocean.client(process.env.DIGITALOCEAN_ACCESS_TOKEN);
const fs = require('fs-extra');

module.exports.getRegions = function getRegions(cb) {
  // just in case we want to get a full list of regions available to us
  // client.regions.list().then((reg) => {
  //   reg.forEach((r) => {
  //     console.log(r.slug);
  //   });
  // });

client.sizes.list().then((sizes) => {
    let filelist = [];
    sizes.forEach((size) => {
      size.regions.forEach((reg) => {
        if (size.slug !== '512mb' && !size.slug.startsWith('m-')) {
          var id = `digitalocean-${reg}-${size.slug}`;
          filelist.push({
            provider: 'digitalocean',
            pretty_provider: 'Digital Ocean',
            driver_options: {
              'digitalocean-region': reg,
              'digitalocean-size': size.slug,
              'digitalocean-image': 'ubuntu-16-04-x64',
              'digitalocean-ipv6': false,
              'digitalocean-private-networking': false,
              'digitalocean-backups': false,
            },
            ui_options: {
              id: id,
              display_name: `Digital Ocean ${PDN[size.slug].name} (${reg})`,
              memory: size.memory,
              storage: size.disk,
              zone: reg,
              price_per_hour: size.price_hourly,
              price_per_month: size.price_monthly,
              variable_fees: false,
              cpu_count: size.vcpus,
              // cpu_rating: Math.floor(Math.random() * 5) + 1,
              // disk_rating: Math.floor(Math.random() * 5) + 1,
              transfer: size.transfer,
              realm: REALMS[reg],
              api_key_support: 'managed',
            },
          });
        }
      });
      filelist.forEach((fileobj, idx) => {
        fs.writeFile(`flavors/${fileobj.ui_options.id}.yaml`, YAML.stringify(fileobj, 4), function (err) {
          if (err) {
            console.log(err);
            cb(err);
          } else {
            console.log('The file was DO saved!');
            if (idx === filelist.length - 1) {
              console.log('Finished writing DO files!');
              cb(null, filelist);
            }
          }
        });
      });
    });
  });
}
