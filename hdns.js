const { exec } = require('child_process');
function getData(data) {
    const ls = exec(`curl "https://dns.hetzner.com/api/v1/zones" \
                      -H \'Auth-API-Token: ${process.argv[2]}\'`, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      zones = JSON.parse(stdout);

      if (data == "all") {
        zones.zones.forEach(element => console.log(element));
      } else {
        zones.zones.forEach(element => console.log(element[data]));
      }
    });


}


function run() {

    if (process.argv[2] == undefined) {
        console.log("=============================== \nPlease Specify an API key. \n===============================")
        process.exit();
      }  
    else if (process.argv[3] == undefined) {
        console.log("=============================== \nPlease Specify a data type. \n===============================")
        process.exit();
    } else {
        getData(process.argv[3]);
    } 
}

run()
