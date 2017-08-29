console.log('script.js');

// API Variables
var url_api = 'http://localhost:80/detectFace';
var query_every_ms = 500;
var payload = {};

// HTML Variables
var video = null;
var videoWidth = 1;
var videoHeight = 1;
var scaleFactorX = 0;
var scaleFactorY = 0;
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

		// Draw Rectangles

		// Clear out Existing Rectangle
		$('#photbox_rect').attr('x', 0);
		$('#photbox_rect').attr('y', 0);
		$('#photbox_rect').attr('width', 0);
		$('#photbox_rect').attr('height', 0);
		$('#rect_name').attr('x',0)
		$('#rect_name').attr('y',0)
		
		// TODO: Make Dynamic.. only works for 1 rectangle
		if (data.length > 0) {
			$('#photbox_rect').attr('x', data[0]['x'] * scaleFactorX);
			$('#photbox_rect').attr('y', data[0]['y'] * scaleFactorY);
			$('#photbox_rect').attr('width', data[0]['w'] * scaleFactorX);
			$('#photbox_rect').attr('height', data[0]['h'] * scaleFactorY);
			$('#rect_name').attr('x',data[0]['x']*scaleFactorX);
			$('#rect_name').attr('y',data[0]['y']*scaleFactorY - 10);
			//for (var key in data[0]) {
				//$('#photbox_rect').attr(key, data[0][key]);
			//} 
		}
	});
}, query_every_ms);

// Update SVG size every 500 ms
setInterval(function() {
	var w = $('#camera').width();
	var h = $('#camera').height();
	$('#photobox').width(w);
	$('#photobox').height(h);

	scaleFactorX = w / video.videoWidth;
	scaleFactorY = h / video.videoHeight;
}, 500);

// On Page load, link HTML video
window.onload = function() {
	console.log('loaded');
	video = document.getElementById('video');
	console.log(video.videoHeight);
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