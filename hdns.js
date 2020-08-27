const { exec } = require('child_process');
var request = require('request');
fs = require('fs');

let validOperators = ["-k", "--key"];

// TEMP VARS

let args = "";
let argsArr = [];

let activeOperators = [];

let gKey = "";

function getAllZones(data, key) {
    const ls = exec(`curl "https://dns.hetzner.com/api/v1/zones" \
                      -H \'Auth-API-Token: ${key}\'`, function (error, stdout, stderr) {
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

function getZone(id, data, key) {

    const ls = exec(`curl "https://dns.hetzner.com/api/v1/zones/${id}" \
                      -H 'Auth-API-Token: ${key}' \
                      -H 'Content-Type: application/json; charset=utf-8'`, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      zone = JSON.parse(stdout);

      if (data == "all") {
        console.log(zone);
      } else {
        console.log(zone.zone[data]);
      }
    });
}

/*function run() {

    if (process.argv[2] == undefined) {
        console.log("=============================== \nPlease Specify an API key. \n===============================")
        process.exit();
      }  
    else if (process.argv[3] == undefined) {
        console.log("=============================== \nPlease Specify a data type. \n===============================")
        process.exit();
    } else {
        getData(process.argv[3]);
        console.log(process.argv[3])
    } 
}*/

function verifyAPIKey(key) {

    const ls = exec(`curl "https://dns.hetzner.com/api/v1/zones" \
                      -H \'Auth-API-Token: ${key}\'`, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      
      response = JSON.parse(stdout);

      //console.log(response.message);

      if (response.message == "Invalid authentication credentials" || response.message == "No API key found in request"){
        console.log("\n\n========================================\n" +
                    "Unable to Verify API Key.\n\n" +
                    "API KEY: " + key + "\n" +
                    "Message: " + response.message + "\n" +
                    "========================================\n\n");
        process.exit();
      } else if (typeof response.message !== 'undefined') {
        
        console.log("\n\n========================================\n" +
                    "An unknown error occured whilst trying to verify the API key...\n\n" +
                    "API KEY: " + key + "\n" +
                    "Message: " + response.message + "\n" +
                    "========================================\n\n");
        process.exit();
      } else {
        gKey = key;
        console.log("Key is good.");
        return;
      }

    });

}

function findArgID(data) {
  let ill = 0;
  while (!(argsArr[ill].argument.includes(data))) {
      ill++
  }
  return argsArr[ill].argumentID;
}

function getAPIKey(data) {
  var key = process.argv[data+1];

  var url = /https{0,1}:\/\/.*?\..{2,6}\/*(.*\/)api\.key/g;
  var testURL = url.exec(key);
  var localFile = /.*\/*\/api\.key/g;
  var testLf = localFile.exec(key); 
  let daReturn;

  if (key == "api.key" || testLf && testURL == null){
    try {
      const data = fs.readFileSync(key, 'utf8')
      return verifyAPIKey(data);
    } catch (err) {
      console.error(err)
    }
  } else if (testURL){
    request.get({
      "encoding":"utf-8",
      "method":"GET",
      "uri":key,
      "followRedirect":false
    }, function (err, res, body) {
      verifyAPIKey(body);
    });

  } else {
    verifyAPIKey(key);
  }

}
  
function disectArgs() {
  for (let i = 2; i < process.argv.length; i++) {  
    args += process.argv[i] + " "
    argsArr.push({"argument":process.argv[i], "argumentID":i})
  }
}

function optionsValidator(data) {

  switch (data) {

    case "-k":
      return;
    break;

    case "--key":
      return;
    break;

    case "-a":
      return;
    break;

    case "-f":
      getFunction(process.argv[findArgID("-f")+1], [process.argv[findArgID("-f")+2],process.argv[findArgID("-f")+3]]) 
    break;

    case "--function":
      getFunction(process.argv[findArgID("--function")+1], [process.argv[findArgID("--function")+2],process.argv[findArgID("--function")+3]]) 
    break;

    default:
      console.log("Invalid Operator " + data);
      process.exit();
  }

}

function optionsIdentifier() {

  var shortOptions = /(-.{1,2})[\s]{1}/g;
  var longOptions = /(--\S*)[\s]{1}/g;
  
  do {  
        var sOR = shortOptions.exec(args);
     if (sOR) {
          optionsValidator(sOR[1]);
      }
    } while (sOR);

    do {    
      var lOR = longOptions.exec(args);
      if (lOR) {
          optionsValidator(lOR[1]);
        }
  } while (lOR);

}

function verifyKeys() {

  var shortOptions = /(-k)[\s]{1}/g;
  var longOptions = /(--key)[\s]{1}/g;

  do {  
    var sOR = shortOptions.exec(args);
  if (sOR) {
        getAPIKey(findArgID("-k"));
    }
  } while (sOR);

  do {    
    var lOR = longOptions.exec(args);
    if (lOR) {
        getAPIKey(findArgID("--key"));
      }
  } while (lOR);
}

function checkAll(data){if(data=="-a"||data=="--all"){return true;}else{return false;}}

function getFunction(type, data) {

  switch (type) {

    case "getZone":
     
      if (checkAll(data[0])) {
        if (checkAll(data[1])) {  
          getAllZones("all", gKey)
        } else {
          getAllZones(data[1], gKey)
        }
      } else {
        if (checkAll(data[1])) {
          getZone(data[0], "all", gKey);
        } else {
          getZone(data[0], data[1], gKey);
        }
      }

    break;


  }

}

function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function main() {

  if (process.argv[2] == undefined) {
    console.log("=============================== \nPlease Specify an API key. \n===============================")
    process.exit();
  }  

  disectArgs();

  verifyKeys();
  const result = await resolveAfter2Seconds();
  optionsIdentifier();

}

main();
