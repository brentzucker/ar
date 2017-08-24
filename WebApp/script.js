console.log('script.js');

var url_api = 'http://localhost:80/detectFace';
var payload = null;
var streaming = false;
var video = null;
var rgb = null;
var gray = null;
var img = null;
var imgJSON = null;
var canvas = null;
var base64 = null;
var payload = {};

setInterval(function() {

	// Img Matrix
	// Flattened RGB Array
	rgb = getImgMatrix(video);

	// Convert to Grayscale Array
	gray = rgbToGray(rgb);

	// Get 2D array from flattened img
	img = flatTo2DArray(gray, video.videoWidth);
	imgJSON = JSON.stringify(img);
	payload['img'] = imgJSON;

	// Base64 Image
	base64 = getImgAsBase64Str(video);
	payload['base64'] = base64;

	$.post(url_api, payload, function(data) {
		// TODO: Plot coordinates on face
		console.log(data);
	});
}, 1000);

window.onload = function() {
	console.log('loaded');
	video = document.getElementById('video');
};

// https://stackoverflow.com/questions/14910520/how-to-get-image-matrix-2d-using-javascript-html5
function getImgMatrix(video) {
	w = video.videoWidth;
	h = video.videoHeight;

	// Create Canvas
	canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;

	// Draw image on canvas
	var ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0);

	// Get Image data
	var data = ctx.getImageData(0,0, w, h);
	data = data.data;

	return data;
}

function getImgAsBase64Str(video) {
	w = video.videoWidth;
	h = video.videoHeight;

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

function rgbToGray(rgb) {
	var gray = [];
	for (var i = 3; i < rgb.length; i+=4) {
		var r = rgb[i - 3]; 
		var g = rgb[i - 2];
		var b = rgb[i - 1];

		var val = (parseInt(r)  + parseInt(g) + parseInt(b)) / 3;
		val = Math.round(val);
		gray.push(val);
	}
	return gray;
}

function flatTo2DArray(arr, width) {
	var ret = [];

	var i = 0; 
	while (i < arr.length/width) {
		ret[i] = [];
		for (var j=0; j < width; j++) {
			var idx = (i * width) + j;
			ret[i][j] = arr[idx];
		}
		i++;
	}
	return ret;
}

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	.then(function(stream) {
		video.srcObject = stream;
		video.play();
	})
	.catch(function(err) {
		console.log("An error occured! " + err);
	});