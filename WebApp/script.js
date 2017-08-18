console.log('script.js');

var streaming = false;
var video = null;
var rgb = null;
var gray = null;
var img = null;

setInterval(function() {
	// Flattened RGB Array
	rgb = getImgMatrix(video);

	// Convert to Grayscale Array
	gray = rgbToGray(rgb);

	// Get 2D array from flattened img
	img = flatTo2DArray(gray, video.videoWidth);

	// $.post('http://localhost:5001/detectFace', img, function(data) {
	// 	console.log(data);
	// }, 'json');

	$.ajax({
		type: 'POST',
		url: 'http://localhost:5001/detectFace',
		data: img,
		dataType: 'jsonp',
		success: function(response) {
			console.log(response)
		}
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
	var canvas = document.createElement('canvas');
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

function rgbToGray(rgb) {
	var gray = [];
	for (var i = 3; i < rgb.length; i+=4) {
		var r = i - 3; 
		var g = i - 2;
		var b = i - 1;

		var val = (r  + g + b) / 3;
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