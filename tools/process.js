"use strict";

const fs = require('fs');

let lines = fs.readFileSync('tfl-p6-sep-data.csv').toString().split("\n");

let trams = {};
let stopNames = {};

lines.forEach(line => {
	let attrs = line.split(",");
	let stopCode = attrs[1];
	let stopName = attrs[2];
	let stopType = attrs[3];
	let time = attrs[4];
	let waitTime = attrs[5];
	let tramLine = attrs[6];
	let tramId = attrs[7];
	let peopleIn = attrs[8];
	let peopleOut = attrs[9];
	let peopleLoad = attrs[10];
	let percentSeatLoad = attrs[11];
	let percentLoad = attrs[12];
	//date,stopCode,stopName,stopType,time,waitTime,line,tramId,add,rem,load,seatLoadPercent,loadPercent,...
	//Date,Code,Stop,Stop Type,Time,R Length,Line,Tram,Ins,Outs,Load,Seat. load,%Load,I,V,P
	//console.log(time);

	var stopData = { time: time, stop: stopCode, start: (stopType == 'A') };
	if (trams[tramId] == undefined) {
		trams[tramId] = [stopData];
	} else {
		trams[tramId].push(stopData);
	}
	if (stopName == '* UNKNOWN *') {
		console.log(time, stopType);
	}
	stopNames[stopName] = 1;
});

// console.log(Object.keys(trams).map(xKey => { let x = trams[xKey]; return x[x.length-1] }));

let tramJourneyIndx = {};


lines.forEach(line => {
	let attrs = line.split(",");
	let stopCode = attrs[1];
	let stopName = attrs[2];
	let stopType = attrs[3];
	let time = attrs[4];
	let waitTime = attrs[5];
	let tramLine = attrs[6];
	let tramId = attrs[7];
	let peopleIn = attrs[8];
	let peopleOut = attrs[9];
	let peopleLoad = attrs[10];
	let percentSeatLoad = attrs[11];
	let percentLoad = attrs[12];

	tramJourneyIndx[tramId] = tramJourneyIndx[tramId] + 1 || 0;
	
});


function timeToSeconds(formatedTime) {
	let s = formatedTime.split(":");
	let num = parseInt(s[0]) * 3600 + parseInt(s[1]) * 60 + parseInt[2];
	return num;
}


console.log(Object.keys(stopNames));

