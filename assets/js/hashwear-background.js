/* Portrait segmentation runs in a worker using same-origin, pinned assets. */
(function () {
    'use strict';
    var workerURL = new URL('hashwear-background-worker.js', document.currentScript.src);
    var worker = null;
    var serial = 0;
    var jobs = new Map();

    function stop(message) {
        if (worker) worker.terminate();
        worker = null;
        jobs.forEach(function (job) { window.clearTimeout(job.timer); job.reject(new Error(message)); });
        jobs.clear();
    }

    window.HashwearBackground = {
        remove: async function (source) {
            if (!window.Worker || !window.createImageBitmap || !window.OffscreenCanvas) throw new Error('Cutout isn’t supported in this browser. Try a recent version of Chrome, Edge or Safari, or use a transparent PNG.');
            if (window.location.protocol === 'file:') throw new Error('Open the website through HTTPS or a local preview server to use portrait cutout.');
            if (!worker) {
                worker = new Worker(workerURL);
                worker.onmessage = function (event) {
                    var job = jobs.get(event.data.id);
                    if (!job) { if (event.data.bitmap) event.data.bitmap.close(); return; }
                    jobs.delete(event.data.id);
                    window.clearTimeout(job.timer);
                    if (event.data.error) job.reject(new Error(event.data.error));
                    else job.resolve(event.data.bitmap);
                };
                worker.onerror = function () { stop('The cutout tool couldn’t load. Please reload this page and try again.'); };
            }
            var width = source.naturalWidth || source.width;
            var height = source.naturalHeight || source.height;
            var scale = Math.min(1, 1600 / Math.max(width, height));
            var bitmap = await createImageBitmap(source, { resizeWidth: Math.max(1, Math.round(width * scale)), resizeHeight: Math.max(1, Math.round(height * scale)), resizeQuality: 'high' });
            var id = ++serial;
            return new Promise(function (resolve, reject) {
                var timer = window.setTimeout(function () { stop('The cutout tool took too long. Try a smaller portrait and try again.'); }, 60000);
                jobs.set(id, { resolve: resolve, reject: reject, timer: timer });
                try { worker.postMessage({ id: id, bitmap: bitmap }, [bitmap]); }
                catch (error) { bitmap.close(); window.clearTimeout(timer); jobs.delete(id); reject(error); }
            });
        }
    };
})();
