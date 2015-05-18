function resizeTextarea(ev) {
	this.style.height = '24px';
	this.style.height = this.scrollHeight + 14 + 'px';
}

var template = ['<div class="row">', '<div class="col-sm-4 column">', '<img class="thumb" src="{{thumbnail_url}}"></img>', '</div>', '<div class="col-sm-7 column">', '<a href="{{original_url}}">{{title}}</a>', '<p>{{description}}</p>', '</div>', '</div>'].join('');

var renderImage = function(data, options, previewData, feed) {
	var preview = previewData;
	html = $(Mustache.to_html(template, preview));
	html.data('preview', preview);
	html.on('click', function() {
		var data = $(this).data('preview');
		// Insert the video or rich object.
		if (data.media.type === 'video' || data.media.type === 'rich') {
			$(this).html(data.media.html);
			return false;
		}
		return true;
	});
	// Display the item in the feed.
	feed.empty();
	feed.append(html);
	return false;
};

var mainCanvas;

/*
 * Creates a new image object from the src
 * Uses the deferred pattern
 */
var createImage = function(src) {
	var deferred = $.Deferred();
	var img = new Image();

	img.onload = function() {
		deferred.resolve(img);
	};
	img.src = src;
	return deferred.promise();
};

/*
 * Create an Image, when loaded pass it on to the resizer
 */
var startResize = function() {
	$.when(createImage($("#inputImage").attr('src'))).then(resize, function() {
		console.log('error')
	});
};

/*
 * Draw the image object on a new canvas and half the size of the canvas
 * until the darget size has been reached
 * Afterwards put the base64 data into the target image
 */
var resize = function(image, src) {
	mainCanvas = document.createElement("canvas");
	WIDTH = 400;
	if (image.width > WIDTH) {
		ratio = image.width / image.height;
		mainCanvas.width = WIDTH;
		mainCanvas.height = WIDTH / ratio;
		var ctx = mainCanvas.getContext("2d");
		ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
		src.attr('src', mainCanvas.toDataURL("image/jpeg"));
	}
};

/*
 * Draw initial canvas on new canvas and half it's size
 */
var halfSize = function(i) {
	var canvas = document.createElement("canvas");
	canvas.width = i.width / 2;
	canvas.height = i.height / 2;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
	return canvas;
};

var render1 = function(data, options) {
	return renderImage(data, options, $('#txt_one_box').data('preview'), $('#feed1'));
};

var render2 = function(data, options) {
	return renderImage(data, options, $('#txt_two_box').data('preview'), $('#feed2'));
};

var resize1 = function(image) {
	resize(image, $('#src1'));
};

var resize2 = function(image) {
	resize(image, $('#src2'));
};

var loadPayload = function(fileInputOne, fileDisplayAreaOne, imgId, resizeFunction) {

	var filePayloadOne = "";
	fileInputOne.files[0] = null;

	fileInputOne.addEventListener('change', function(e) {
		var file = fileInputOne.files[0];
		var imageType = /image.*/;

		if (file.type.match(imageType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				fileDisplayAreaOne.innerHTML = "";

				var img = new Image();

				filePayloadOne = reader.result;

				img.src = reader.result;
				img.id = imgId;

				fileDisplayAreaOne.appendChild(img);

				$.when(createImage(img.src)).then(resizeFunction, function() {
					console.log('error')
				});

			}

			reader.readAsDataURL(file);
		} else {
			fileDisplayAreaOne.innerHTML = "File not supported!"
		}
	});
};




loadPayload(document.getElementById('picture'), document.getElementById('pictureDisplayAreaOne'), "src1", resize1);
loadPayload(document.getElementById('spicture'), document.getElementById('spictureDisplayAreaOne'), "src2", resize2);