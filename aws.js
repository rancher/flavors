/* eslint-env node */
const YAML = require('yamljs');
const fs = require('fs');
const SAFEINSTANCES = ["t2.micro", "t2.small", "t2.medium", "t2.large", 't2.xlarge', "t2.2xlarge", "m3.medium", "m4.large", "m4.xlarge", "m4.2xlarge", "m4.4xlarge"];

function parseAWS() {
  var filelist = [];
  var contents = fs.readFileSync("aws_instances.json");
  var jsonContent = JSON.parse(contents);
  var filelist = [];
  jsonContent.forEach((awsi) => {
    if (SAFEINSTANCES.indexOf(awsi.instance_type) !== -1) {
      Object.keys(awsi.pricing).forEach((zone) => {
        // do we have ondmand pricing?
        if (awsi.pricing[zone].linux.ondemand) {
          var id = `amazonec2-${zone}-${awsi.instance_type.split('.').join('-')}`;
          filelist.push({
            provider: "amazonec2",
            driver_options: {
              "amazonec2-instance-type": awsi.instance_type,
              "amazonec2-region": zone,
              "amazonec2-zone": "a",
            },
            ui_options: {
              id: id,
              display_name: `${awsi.pretty_name} (${zone})`,
              memory: awsi.memory,
              storage: 40,
              zone: zone,
              price_per_hour: awsi.pricing[zone].linux.ondemand,
              price_per_month: (awsi.pricing[zone].linux.ondemand) * 720,
              variable_fees: true,
              cpu_rating: Math.floor(Math.random() * 5) + 1,
              disk_rating: Math.floor(Math.random() * 5) + 1,
              transfer: awsi.ebs_max_bandwidth,
              realm: null,
              api_key_support: 'byokey',
            },
          });
        }
      });
      filelist.forEach((fileobj, idx) => {
        fs.writeFile(`flavors/${fileobj.ui_options.id}.yaml`, YAML.stringify(fileobj, 4), function (err) {
          if (err) {
            console.log(err);
            process.exit(1);
          } else {
            console.log("The file was saved!");
              if (idx === filelist.length -1) {
                console.log('Finished writing files!');
                process.exit(0);
              }
          }
        });
      });
    }
  });
}
parseAWS();
