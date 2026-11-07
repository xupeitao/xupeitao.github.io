/* MediaPipe Tasks Vision 1.2.2; binary selfie segmentation, background 0 / person 1. */
importScripts('../vendor/mediapipe/vision_bundle.js');
var ready = null;

function getSegmenter() {
    if (!ready) {
        ready = Vision.FilesetResolver.forVisionTasks(new URL('../vendor/mediapipe/wasm', self.location.href).href).then(function (files) {
            return Vision.ImageSegmenter.createFromOptions(files, {
                baseOptions: { modelAssetPath: new URL('../vendor/mediapipe/selfie_segmenter.tflite', self.location.href).href, delegate: 'CPU' },
                runningMode: 'IMAGE',
                outputCategoryMask: false,
                outputConfidenceMasks: true
            });
        }).catch(function (error) { ready = null; throw error; });
    }
    return ready;
}

self.onmessage = async function (event) {
    var id = event.data.id;
    var source = event.data.bitmap;
    try {
        var segmenter = await getSegmenter();
        var output = new OffscreenCanvas(source.width, source.height);
        var context = output.getContext('2d');
        context.drawImage(source, 0, 0);
        segmenter.segment(source, function (result) {
            var masks = result.confidenceMasks;
            var mask = masks && (masks[1] || masks[0]);
            if (!mask) throw new Error('No portrait mask was returned.');
            var confidence = mask.getAsFloat32Array();
            var maskCanvas = new OffscreenCanvas(mask.width, mask.height);
            var maskContext = maskCanvas.getContext('2d');
            var pixels = maskContext.createImageData(mask.width, mask.height);
            var foreground = 0;
            for (var i = 0; i < confidence.length; i++) {
                var alpha = Math.max(0, Math.min(1, (confidence[i] - 0.2) / 0.6));
                if (alpha > 0.5) foreground++;
                pixels.data[i * 4] = pixels.data[i * 4 + 1] = pixels.data[i * 4 + 2] = 255;
                pixels.data[i * 4 + 3] = Math.round(alpha * 255);
            }
            if (foreground < confidence.length * 0.005) throw new Error('No clear person was found. Try a photo with one clearly visible person.');
            maskContext.putImageData(pixels, 0, 0);
            context.globalCompositeOperation = 'destination-in';
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(maskCanvas, 0, 0, output.width, output.height);
        });
        var bitmap = output.transferToImageBitmap();
        self.postMessage({ id: id, bitmap: bitmap }, [bitmap]);
    } catch (error) {
        self.postMessage({ id: id, error: error.message || 'The portrait cutout failed. Please try another photo.' });
    } finally { source.close(); }
};
