console.log('script.js');

// API Variables
var url_api = 'http://localhost:80/detectFace';
var query_every_ms = 1000;
var payload = {};

// HTML Variables
var video = null;
var canvas = null;
var base64 = null;

// Query API Every 1 Second
setInterval(function() {

	// Base64 Image
	base64 = getImgAsBase64Str(video);
	payload['base64'] = base64;

	$.post(url_api, payload, function(data) {
		// TODO: Plot coordinates on face
		console.log(data);

		// TODO: Move this to MVC
		$('#TestStreamCoords').text(JSON.stringify(data));
	});
}, query_every_ms);

// On Page load, link HTML video
window.onload = function() {
	console.log('loaded');
	video = document.getElementById('video');
};

// Grab Webcam
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	.then(function(stream) {
		video.srcObject = stream;
		video.play();
	})
	.catch(function(err) {
		console.log("An error occured! " + err);
	});

/////////////////////////////////////////////////////////////////
// Helper Functions

// Grab video frame, converto base64 string
function getImgAsBase64Str(video) {
	var w = video.videoWidth;
	var h = video.videoHeight;

	// Create Canvas
	canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;

	// Draw image on canvas
	var ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0);

	// Get Image data
	var data = canvas.toDataURL();

	return data;
}