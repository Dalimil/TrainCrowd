$(function() {
	$("#map").css({
		height: $("body").height() * 0.9
	});

	L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';

	var map = L.mapbox.map('map', 'mapbox.dark').setView([38.05, -84.5], 12);


});
