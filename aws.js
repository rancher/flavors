/* eslint-env node */
const YAML = require('yamljs');
const fs = require('fs');
const SAFEINSTANCES = ['t2.micro', 't2.small', 't2.medium', 't2.large', 't2.xlarge', 't2.2xlarge', 'm3.medium', 'm4.large', 'm4.xlarge', 'm4.2xlarge', 'm4.4xlarge'];

const REALMS = {
  'ap-northeast-1': 'asia',
  'ap-northeast-2': 'asia',
  'ap-south-1': 'asia',
  'ap-southeast-1': 'asia',
  'ap-southeast-2': 'asia',
  'ca-central-1': 'canada',
  'eu-central-1': 'eu-central',
  'eu-west-1': 'eu-west',
  'eu-west-2': 'eu-west',
  'sa-east-1': 'south-america',
  'us-east-1': 'us-east',
  'us-east-2': 'us-east',
  'us-west-1': 'us-west',
  'us-west-2': 'us-west',
}

module.exports.parseAWS = function parseAWS(cb) {
  var filelist = [];
  var contents = fs.readFileSync('aws_instances.json');
  var jsonContent = JSON.parse(contents);
  var filelist = [];
  jsonContent.forEach((awsi) => {
    if (SAFEINSTANCES.indexOf(awsi.instance_type) !== -1) {
      Object.keys(awsi.pricing).forEach((zone) => {
        // do we have ondmand pricing?
        if (awsi.pricing[zone].linux.ondemand) {
          var id = `amazonec2-${zone}-${awsi.instance_type.split('.').join('-')}`;
          console.log(zone);
          filelist.push({
            provider: 'amazonec2',
            pretty_provider: 'Amazon',
            driver_options: {
              'amazonec2-instance-type': awsi.instance_type,
              'amazonec2-region': zone,
              'amazonec2-zone': 'a',
            },
            ui_options: {
              id: id,
              display_name: `${awsi.instance_type} (${zone})`,
              memory: awsi.memory,
              storage: 40,
              zone: zone,
              price_per_hour: parseFloat(awsi.pricing[zone].linux.ondemand),
              price_per_month: (awsi.pricing[zone].linux.ondemand) * 720,
              variable_fees: true,
//              cpu_rating: Math.floor(Math.random() * 5) + 1,
//              disk_rating: Math.floor(Math.random() * 5) + 1,
              transfer: awsi.ebs_max_bandwidth,
              realm: REALMS[zone],
              api_key_support: 'byokey',
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
            console.log('The file was AWS saved!');
            if (idx === filelist.length - 1) {
              console.log('Finished writing AWS files!');
              cb(null, filelist);
            }
          }
        });
      });
    }
  });
}
