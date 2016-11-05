/** Sample code using the 'request' module to make server-side http requests */
const request = require('request');

const origin = "75+9th+Ave+New+York,+NY";
const destination = "MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073";
const key = "AIzaSyCNtpdJ-cx0367iMVm1oQsioj8ItVMkkww";

/* GET */
request(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&arrival_time=1478520000&key=${key}`,
	function(error, response, body) {
		// Callback function
		if (!error && response.statusCode == 200) {
			console.log(body); // Show data
		}
	}
);

