/* eslint-env node */
const YAML = require('yamljs');
const digitalocean = require('digitalocean');
const client = digitalocean.client('6e55bcbb3179cb7e312b5074ca9f933445e72c8dc7d640142d2370413fe9906b');
const fs = require('fs');

function getRegions() {
    var regionList = {};
    var filelist = [];
    // the display name can be a static map of file names = 1gb = DO SFO1 Small
    // drop any m-* hosts we dont need thses yet
    client.sizes.list().then((sizes) => {
        debugger;
        sizes.forEach((size) => {
            size.regions.forEach((reg) => {
                filelist.push({
                    provider: "digitalocean",
                    driver_options: {
                        "digitalocean-image": "ubuntu-16-04-x64",
                        "digitalocean-ipv6": false,
                        "digitalocean-private-networking": false,
                        "digitalocean-backups": false,                       
                    },
                    ui_options: {
                        id: `digitalocean-${reg}-${size.slug}`,
                        display_name: '',
                        memory: size.memory,
                        storage: size.disk,
                        zone: reg,
                        price_per_hour: size.price_hourly,
                        price_per_month: size.price_monthly,
                        variable_fees: false,
                        cpu_rating: Math.floor(Math.random() * 5) + 1,
                        disk_rating: Math.floor(Math.random() * 5) + 1,
                        transfer: size.transfer,
                        realm: null,
                        api_key_support: 'managed',
                    },
                });
            });
        });
        filelist.forEach((fileobj) => {
            fs.writeFile(`flavors/${fileobj.ui_options.id}.yaml`, YAML.stringify(fileobj, 16), function(err) {
                if(err) {
                    console.log(err);
                } else {
                    // console.log("The file was saved!");
                }
            }); 
        });
        // process.exit(1);
    });
}

getRegions();
