const fs = require('fs');
const safeInstances = ["t2.micro", "t2.small", "t2.medium", "t2.large", 't2.xlarge', "t2.2xlarge", "m3.medium", "m4.large", "m4.xlarge", "m4.2xlarge", "m4.4xlarge"];
function parseAWS() {
    var filelist = [];
    var contents = fs.readFileSync("aws_instances.json");
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    // we only want linux
    // monthly cost is hourly*720=mo
    // storage is 40gb default
    function isInstanceSafe(instance) {
        var instanceType = instance.instance_type.split('.')[0].toLowerCase(); 
        switch (instanceType) {
            case 't2':
            case 'm3':
        }
    }
    jsonContent.forEach((awsi) => {
        console.log(awsi.generation);
        var instanceType =awsi.instance_type.split('.')[0].toLowerCase(); 
        if ( === 't2')
        // filelist.push({
        //     provider: "amazon",
        //     driver_options: {
        //     },
        //     ui_options: {
        //         id: `${}-${}-${}`,
        //         display_name: '',
        //         memory: null,
        //         storage: null,
        //         zone: null,
        //         price_per_hour: null,
        //         price_per_month: null,
        //         variable_fees: true,
        //         cpu_rating: Math.floor(Math.random() * 5) + 1,
        //         disk_rating: Math.floor(Math.random() * 5) + 1,
        //         transfer: null,
        //         realm: null,
        //         api_key_support: 'byokey',
        //     },
        // });
        debugger;
    });
}
parseAWS();