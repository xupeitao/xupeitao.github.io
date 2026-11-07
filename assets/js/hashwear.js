(function () {
    'use strict';

    var root = document.getElementById('hashwear');
    var catalog = window.HashwearCatalog;
    if (!root || !catalog) return;

    var canvas = document.getElementById('hw-canvas');
    var ctx = canvas.getContext('2d');
    var stage = document.getElementById('hw-stage');
    var gallery = document.getElementById('hw-gallery');
    var status = document.getElementById('hw-status');
    var download = document.getElementById('hw-download');
    var photoInput = document.getElementById('hw-photo');
    var adjustments = document.getElementById('hw-adjustments');
    var basePath = 'assets/images/portrait-accessories-v1/';
    var colors = { sage: '#edf2e7', cream: '#fbf3e5', lilac: '#f1ebf6', transparent: null };
    var slotNames = { head: 'Head', shoulder: 'Shoulder', cheek: 'Cheek' };
    var slots = ['head', 'shoulder', 'cheek'];
    var layers = { head: null, shoulder: null, cheek: null };
    var versions = { head: 0, shoulder: 0, cheek: 0 };
    var pending = { head: false, shoulder: false, cheek: false };
    var handles = {};
    var controls = {};
    var cache = new Map();
    var activeSlot = 'head';
    var background = 'sage';
    var photo = null;
    var originalPhoto = null;
    var uploadedPhoto = false;
    var cutoutPhoto = false;
    var photoPose = { x: 0.5, y: 0.58, scale: 1, rotation: 0 };
    var editTarget = 'accessories';
    var photoControls = {};
    var photoHandle = document.createElement('button');
    photoHandle.type = 'button';
    photoHandle.className = 'hw-handle hw-photo-handle';
    photoHandle.hidden = true;
    photoHandle.setAttribute('aria-label', 'Your photo. Drag or use arrow keys to move.');
    photoHandle.setAttribute('aria-describedby', 'hw-drag-help');
    document.getElementById('hw-handles').appendChild(photoHandle);
    var photoVersion = 0;
    var photoBusy = false;
    var cutoutBusy = false;
    var exportBusy = false;
    var animationFrame = null;
    var dragging = null;

    function say(message, error) {
        status.textContent = message;
        status.classList.toggle('is-error', Boolean(error));
    }

    if (!ctx) {
        say('This browser cannot open the dressing room. Please try a browser with Canvas support.', true);
        return;
    }

    function busy() {
        return photoBusy || cutoutBusy || slots.some(function (slot) { return pending[slot]; });
    }

    function updateAvailability() {
        download.disabled = !photo || busy() || exportBusy;
        stage.setAttribute('aria-busy', String(busy()));
        document.getElementById('hw-cutout').disabled = !uploadedPhoto || cutoutPhoto || photoBusy || cutoutBusy;
        document.getElementById('hw-cutout').textContent = cutoutBusy ? 'Removing background…' : 'Remove photo background';
        document.getElementById('hw-restore-photo').hidden = !cutoutPhoto;
    }

    function loadImage(src) {
        if (!cache.has(src)) {
            cache.set(src, new Promise(function (resolve, reject) {
                var image = new Image();
                image.onload = function () { resolve(image); };
                image.onerror = function () {
                    cache.delete(src);
                    reject(new Error('Image unavailable'));
                };
                image.src = src;
            }));
        }
        return cache.get(src);
    }

    function itemSource(item) { return item.src || basePath + item.file; }

    function photoRect() {
        if (!photo) return { x: 0.12, y: 0.20, width: 0.76, height: 0.76 };
        var ratio = (photo.naturalWidth || photo.width) / (photo.naturalHeight || photo.height);
        var height = Math.min(0.76, 0.76 / ratio) * photoPose.scale;
        var width = height * ratio;
        return { x: photoPose.x - width / 2, y: photoPose.y - height / 2, width: width, height: height };
    }

    function preset(item, image, slot) {
        var rect = photoRect();
        var head = item.head;
        var width = rect.width * head.width / 100;
        var x = rect.x + rect.width * 0.5;
        var y = rect.y + rect.height * head.y / 100;
        var rotation = head.tilt;
        if (slot === 'shoulder') {
            width = Math.min(0.25, rect.width * 0.32);
            x = rect.x + rect.width * 0.19;
            y = rect.y + rect.height * 0.70;
            rotation = 0;
        } else if (slot === 'cheek') {
            width = 0.10;
            x = rect.x + rect.width * 0.37;
            y = rect.y + rect.height * 0.44;
            rotation = -12;
        }
        // Match the original homepage's contact point within the transparent art.
        var height = width * image.naturalHeight / image.naturalWidth;
        if (slot !== 'cheek') y += (0.5 - head.anchor / 100) * height;
        var point = rotatePoint(x - photoPose.x, y - photoPose.y, photoPose.rotation);
        return { item: item, image: image, x: clamp(photoPose.x + point.x, 0, 1), y: clamp(photoPose.y + point.y, 0, 1), width: clamp(width, 0.04, 0.90), rotation: normalAngle(rotation + photoPose.rotation) };
    }

    function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

    function rotatePoint(x, y, degrees) {
        var angle = degrees * Math.PI / 180;
        return { x: x * Math.cos(angle) - y * Math.sin(angle), y: x * Math.sin(angle) + y * Math.cos(angle) };
    }

    function normalAngle(degrees) { return ((degrees + 180) % 360 + 360) % 360 - 180; }

    function setPhotoPose(next) {
        var scale = next.scale / photoPose.scale;
        var rotation = next.rotation - photoPose.rotation;
        slots.forEach(function (slot) {
            var layer = layers[slot];
            if (!layer) return;
            var point = rotatePoint((layer.x - photoPose.x) * scale, (layer.y - photoPose.y) * scale, rotation);
            // Keep off-canvas positions so moving a cropped photo back also
            // returns its accessories to exactly the same relative spots.
            layer.x = next.x + point.x;
            layer.y = next.y + point.y;
            layer.width *= scale;
            layer.rotation = normalAngle(layer.rotation + rotation);
        });
        photoPose = next;
        syncControls();
        draw();
    }

    function selectTarget(target) {
        editTarget = target;
        syncControls();
        draw();
    }

    function paint(target) {
        var size = target.canvas.width;
        target.clearRect(0, 0, size, size);
        if (colors[background]) {
            target.fillStyle = colors[background];
            target.fillRect(0, 0, size, size);
        }
        if (photo) {
            var rect = photoRect();
            target.save();
            target.translate(photoPose.x * size, photoPose.y * size);
            target.rotate(photoPose.rotation * Math.PI / 180);
            target.drawImage(photo, -rect.width * size / 2, -rect.height * size / 2, rect.width * size, rect.height * size);
            target.restore();
        }
        slots.forEach(function (slot) {
            var layer = layers[slot];
            if (!layer) return;
            var width = layer.width * size;
            var height = width * layer.image.naturalHeight / layer.image.naturalWidth;
            target.save();
            target.translate(layer.x * size, layer.y * size);
            target.rotate(layer.rotation * Math.PI / 180);
            target.drawImage(layer.image, -width / 2, -height / 2, width, height);
            target.restore();
        });
    }

    function draw() {
        if (animationFrame !== null) return;
        animationFrame = window.requestAnimationFrame(function () {
            animationFrame = null;
            paint(ctx);
            var photoBounds = photoRect();
            photoHandle.hidden = !photo || editTarget !== 'photo';
            photoHandle.style.left = photoPose.x * 100 + '%';
            photoHandle.style.top = photoPose.y * 100 + '%';
            photoHandle.style.width = photoBounds.width * 100 + '%';
            photoHandle.style.height = photoBounds.height * 100 + '%';
            photoHandle.style.transform = 'translate(-50%, -50%) rotate(' + photoPose.rotation + 'deg)';
            photoHandle.classList.toggle('is-selected', editTarget === 'photo');
            slots.forEach(function (slot) {
                var handle = handles[slot];
                var layer = layers[slot];
                handle.hidden = !layer || editTarget !== 'accessories';
                if (!layer) return;
                handle.style.left = layer.x * 100 + '%';
                handle.style.top = layer.y * 100 + '%';
                handle.style.width = layer.width * 100 + '%';
                handle.style.height = layer.width * layer.image.naturalHeight / layer.image.naturalWidth * 100 + '%';
                handle.style.transform = 'translate(-50%, -50%) rotate(' + layer.rotation + 'deg)';
                handle.style.zIndex = slot === activeSlot ? 4 : slots.indexOf(slot) + 1;
                handle.classList.toggle('is-selected', slot === activeSlot);
                handle.setAttribute('aria-label', layer.item.name + ' on ' + slot + '. Drag or use arrow keys to move.');
            });
            var looks = slots.filter(function (slot) { return layers[slot]; }).map(function (slot) {
                return layers[slot].item.name + ' on ' + slot;
            });
            canvas.setAttribute('aria-label', 'Portrait preview' + (looks.length ? ': ' + looks.join(', ') : ' without accessories') + '.');
        });
    }

    function syncControls() {
        root.querySelectorAll('[name="hw-target"]').forEach(function (radio) { radio.checked = radio.value === editTarget; });
        document.getElementById('hw-photo-editor').hidden = editTarget !== 'photo';
        document.getElementById('hw-accessory-editor').hidden = editTarget !== 'accessories';
        ['scale', 'rotation', 'x', 'y'].forEach(function (key) {
            var value = photoPose[key] * (key === 'rotation' ? 1 : 100);
            photoControls[key].value = value;
            document.getElementById('hw-photo-' + key + '-value').value = Math.round(value * 10) / 10 + (key === 'rotation' ? '°' : '%');
        });
        var layer = layers[activeSlot];
        document.getElementById('hw-selection').textContent = layer ? layer.item.name : slotNames[activeSlot] + ' accessory';
        adjustments.hidden = !layer;
        document.getElementById('hw-empty-slot').hidden = Boolean(layer);
        root.querySelectorAll('[name="hw-slot"]').forEach(function (radio) { radio.checked = radio.value === activeSlot; });
        gallery.querySelectorAll('[data-hw-item]').forEach(function (button) {
            button.setAttribute('aria-pressed', String(Boolean(layer && layer.item.id === button.dataset.hwItem)));
        });
        if (!layer) return;
        var values = { size: layer.width * 100, rotation: layer.rotation, x: layer.x * 100, y: layer.y * 100 };
        Object.keys(values).forEach(function (key) {
            controls[key].value = values[key];
            document.getElementById('hw-' + key + '-value').value = Math.round(values[key] * 10) / 10 + (key === 'rotation' ? '°' : '%');
        });
    }

    function selectSlot(slot) {
        activeSlot = slot;
        editTarget = 'accessories';
        syncControls();
        draw();
    }

    function wear(item, slot, quiet) {
        var version = ++versions[slot];
        pending[slot] = true;
        updateAvailability();
        if (!quiet) say('Trying on ' + item.name.toLowerCase() + '…');
        return loadImage(itemSource(item)).then(function (image) {
            if (versions[slot] !== version) return;
            layers[slot] = preset(item, image, slot);
            pending[slot] = false;
            syncControls();
            draw();
            updateAvailability();
            if (!quiet) say(item.name + ' is on your ' + slot + '. Drag it to find its spot.');
            return true;
        }).catch(function () {
            if (versions[slot] !== version) return;
            pending[slot] = false;
            updateAvailability();
            say('That accessory couldn’t load. Your current look is still here; try it again or choose another.', true);
        });
    }

    function resetPositions() {
        slots.forEach(function (slot) {
            if (layers[slot]) layers[slot] = preset(layers[slot].item, layers[slot].image, slot);
        });
        syncControls();
        draw();
    }

    function usePortrait() {
        var version = ++photoVersion;
        photoBusy = true;
        cutoutBusy = false;
        updateAvailability();
        say('Loading my portrait…');
        return loadImage(catalog.portrait).then(function (image) {
            if (version !== photoVersion) return;
            photo = image;
            originalPhoto = image;
            uploadedPhoto = false;
            cutoutPhoto = false;
            photoPose = { x: 0.5, y: 0.58, scale: 1, rotation: 0 };
            editTarget = 'accessories';
            photoBusy = false;
            photoInput.value = '';
            resetPositions();
            updateAvailability();
            say('Make yourself a little look. Pick an accessory below.');
        }).catch(function () {
            if (version !== photoVersion) return;
            photoBusy = false;
            updateAvailability();
            say('The portrait couldn’t load. You can still try your own photo.', true);
        });
    }

    // Separate photo and accessory modes keep overlapping drag targets unambiguous.
    photoHandle.addEventListener('pointerdown', function (event) {
        if (!photo || editTarget !== 'photo' || (event.pointerType === 'mouse' && event.button !== 0)) return;
        photoHandle.focus({ preventScroll: true });
        dragging = { slot: 'photo', id: event.pointerId, x: event.clientX, y: event.clientY, startX: photoPose.x, startY: photoPose.y, rect: stage.getBoundingClientRect() };
        photoHandle.setPointerCapture(event.pointerId);
        event.preventDefault();
    });
    photoHandle.addEventListener('pointermove', function (event) {
        if (!dragging || dragging.slot !== 'photo' || dragging.id !== event.pointerId) return;
        setPhotoPose({
            x: clamp(dragging.startX + (event.clientX - dragging.x) / dragging.rect.width, 0, 1),
            y: clamp(dragging.startY + (event.clientY - dragging.y) / dragging.rect.height, 0, 1),
            scale: photoPose.scale, rotation: photoPose.rotation
        });
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (type) {
        photoHandle.addEventListener(type, function (event) { if (dragging && dragging.id === event.pointerId) dragging = null; });
    });
    photoHandle.addEventListener('keydown', function (event) {
        var moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        if (!moves[event.key] || !photo) return;
        event.preventDefault();
        var step = event.shiftKey ? 0.025 : 0.005;
        setPhotoPose({ x: clamp(photoPose.x + moves[event.key][0] * step, 0, 1), y: clamp(photoPose.y + moves[event.key][1] * step, 0, 1), scale: photoPose.scale, rotation: photoPose.rotation });
    });
    ['scale', 'rotation', 'x', 'y'].forEach(function (key) {
        var input = document.getElementById('hw-photo-' + key);
        photoControls[key] = input;
        input.addEventListener('input', function () {
            var next = { x: photoPose.x, y: photoPose.y, scale: photoPose.scale, rotation: photoPose.rotation };
            next[key] = Number(input.value) / (key === 'rotation' ? 1 : 100);
            setPhotoPose(next);
        });
    });
    root.querySelectorAll('[name="hw-target"]').forEach(function (input) {
        input.addEventListener('change', function () { if (input.checked) selectTarget(input.value); });
    });
    document.getElementById('hw-photo-reset').addEventListener('click', function () {
        setPhotoPose({ x: 0.5, y: 0.58, scale: 1, rotation: 0 });
        say('Photo position, size and rotation reset.');
    });

    // The three transparent buttons supply pointer and keyboard interaction;
    // the Canvas itself is also the export, with no editor outlines included.
    slots.forEach(function (slot) {
        var handle = document.createElement('button');
        handle.type = 'button';
        handle.className = 'hw-handle';
        handle.hidden = true;
        handle.setAttribute('aria-describedby', 'hw-drag-help');
        document.getElementById('hw-handles').appendChild(handle);
        handles[slot] = handle;
        handle.addEventListener('focus', function () { if (activeSlot !== slot) selectSlot(slot); });
        handle.addEventListener('pointerdown', function (event) {
            if (!layers[slot] || (event.pointerType === 'mouse' && event.button !== 0)) return;
            selectSlot(slot);
            handle.focus({ preventScroll: true });
            var rect = stage.getBoundingClientRect();
            dragging = { slot: slot, id: event.pointerId, x: event.clientX, y: event.clientY, startX: layers[slot].x, startY: layers[slot].y, rect: rect };
            handle.setPointerCapture(event.pointerId);
            event.preventDefault();
        });
        handle.addEventListener('pointermove', function (event) {
            if (!dragging || dragging.id !== event.pointerId || dragging.slot !== slot || !layers[slot]) return;
            layers[slot].x = clamp(dragging.startX + (event.clientX - dragging.x) / dragging.rect.width, 0, 1);
            layers[slot].y = clamp(dragging.startY + (event.clientY - dragging.y) / dragging.rect.height, 0, 1);
            syncControls();
            draw();
        });
        function stopDrag(event) { if (dragging && dragging.id === event.pointerId) dragging = null; }
        handle.addEventListener('pointerup', stopDrag);
        handle.addEventListener('pointercancel', stopDrag);
        handle.addEventListener('lostpointercapture', stopDrag);
        handle.addEventListener('keydown', function (event) {
            var moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
            if (!moves[event.key] || !layers[slot]) return;
            event.preventDefault();
            var step = event.shiftKey ? 0.025 : 0.005;
            layers[slot].x = clamp(layers[slot].x + moves[event.key][0] * step, 0, 1);
            layers[slot].y = clamp(layers[slot].y + moves[event.key][1] * step, 0, 1);
            syncControls();
            draw();
        });
    });

    ['size', 'rotation', 'x', 'y'].forEach(function (key) {
        var input = document.getElementById('hw-' + key);
        controls[key] = input;
        input.addEventListener('input', function () {
            var layer = layers[activeSlot];
            if (!layer) return;
            var value = Number(input.value);
            if (key === 'size') layer.width = value / 100;
            else if (key === 'rotation') layer.rotation = value;
            else layer[key] = value / 100;
            syncControls();
            draw();
        });
    });

    catalog.items.forEach(function (item, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'hw-accessory';
        button.dataset.hwItem = item.id;
        button.dataset.category = item.category;
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', 'Try on ' + item.name);
        var art = document.createElement('span');
        art.className = 'hw-accessory-art';
        var number = document.createElement('span');
        number.className = 'hw-accessory-number';
        number.textContent = String(index + 1).padStart(2, '0');
        var image = document.createElement('img');
        image.src = itemSource(item);
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        art.append(number, image);
        var meta = document.createElement('span');
        meta.className = 'hw-accessory-meta';
        var name = document.createElement('strong');
        name.textContent = item.name;
        meta.appendChild(name);
        button.append(art, meta);
        button.addEventListener('click', function () {
            var slot = activeSlot;
            selectSlot(slot);
            wear(item, slot).then(function (loaded) {
                if (!loaded || slot !== activeSlot) return;
                handles[slot].focus({ preventScroll: true });
                stage.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
            });
        });
        gallery.appendChild(button);
        if (item.source) {
            var credit = document.createElement('li');
            var sourceLink = document.createElement('a');
            sourceLink.href = item.source;
            sourceLink.target = '_blank';
            sourceLink.rel = 'noopener noreferrer';
            sourceLink.textContent = item.name + (item.redrawn ? ' (HD redraw)' : '') + ' — ' + item.note;
            credit.appendChild(sourceLink);
            document.getElementById('hw-credit-list').appendChild(credit);
        }
    });

    var comingSoon = document.createElement('div');
    comingSoon.className = 'hw-keep-adding';
    var plus = document.createElement('span');
    plus.textContent = '+';
    plus.setAttribute('aria-hidden', 'true');
    var comingSoonText = document.createElement('strong');
    comingSoonText.textContent = 'Keep adding…';
    comingSoon.append(plus, comingSoonText);
    gallery.appendChild(comingSoon);

    document.getElementById('hw-count').textContent = catalog.items.length + ' little things';
    root.querySelectorAll('[data-hw-filter]').forEach(function (button) {
        button.addEventListener('click', function () {
            var filter = button.dataset.hwFilter;
            var count = 0;
            root.querySelectorAll('[data-hw-filter]').forEach(function (other) { other.setAttribute('aria-pressed', String(other === button)); });
            gallery.querySelectorAll('[data-hw-item]').forEach(function (card) {
                card.hidden = filter !== 'all' && card.dataset.category !== filter;
                if (!card.hidden) count++;
            });
            document.getElementById('hw-count').textContent = count + ' of ' + catalog.items.length + ' little things';
        });
    });

    root.querySelectorAll('[name="hw-slot"]').forEach(function (input) {
        input.addEventListener('change', function () { if (input.checked) selectSlot(input.value); });
    });
    root.querySelectorAll('[name="hw-background"]').forEach(function (input) {
        input.addEventListener('change', function () { if (input.checked) { background = input.value; draw(); } });
    });
    document.getElementById('hw-reset').addEventListener('click', function () {
        var layer = layers[activeSlot];
        if (!layer) return;
        layers[activeSlot] = preset(layer.item, layer.image, activeSlot);
        syncControls();
        draw();
        say(slotNames[activeSlot] + ' accessory returned to its starting position.');
    });
    document.getElementById('hw-remove').addEventListener('click', function () {
        versions[activeSlot]++;
        pending[activeSlot] = false;
        layers[activeSlot] = null;
        syncControls();
        draw();
        updateAvailability();
        root.querySelector('[name="hw-slot"][value="' + activeSlot + '"]').focus();
        say(slotNames[activeSlot] + ' accessory removed. Pick another whenever you like.');
    });
    document.getElementById('hw-demo').addEventListener('click', usePortrait);

    photoInput.addEventListener('change', function () {
        var file = photoInput.files[0];
        if (!file) return;
        photoInput.value = '';
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            say('Please choose a JPG, PNG or WebP photo.', true);
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            say('That photo is larger than 20 MB. Please choose a smaller image.', true);
            return;
        }
        var version = ++photoVersion;
        var objectURL = URL.createObjectURL(file);
        var image = new Image();
        photoBusy = true;
        cutoutBusy = false;
        updateAvailability();
        say('Opening your photo in this browser…');
        image.onload = function () {
            URL.revokeObjectURL(objectURL);
            if (version !== photoVersion) return;
            photoBusy = false;
            if (image.naturalWidth * image.naturalHeight > 40000000) {
                updateAvailability();
                say('Please resize this photo to under 40 megapixels and try again.', true);
                return;
            }
            photo = image;
            originalPhoto = image;
            uploadedPhoto = true;
            cutoutPhoto = false;
            photoPose = { x: 0.5, y: 0.58, scale: 1, rotation: 0 };
            editTarget = 'photo';
            resetPositions();
            updateAvailability();
            say('Your photo is ready. Drag it to move it, adjust its size, or remove the background.');
        };
        image.onerror = function () {
            URL.revokeObjectURL(objectURL);
            if (version !== photoVersion) return;
            photoBusy = false;
            updateAvailability();
            say('That photo couldn’t open. Please try another JPG, PNG or WebP.', true);
        };
        image.src = objectURL;
    });

    document.getElementById('hw-cutout').addEventListener('click', async function () {
        if (!uploadedPhoto || !originalPhoto || photoBusy || cutoutBusy || cutoutPhoto) return;
        var version = photoVersion;
        cutoutBusy = true;
        updateAvailability();
        say('Removing the background on your device. The first use takes a little longer…');
        try {
            var bitmap = await window.HashwearBackground.remove(originalPhoto);
            if (version !== photoVersion) { bitmap.close(); return; }
            var cutout = document.createElement('canvas');
            cutout.width = bitmap.width;
            cutout.height = bitmap.height;
            cutout.getContext('2d').drawImage(bitmap, 0, 0);
            bitmap.close();
            photo = cutout;
            cutoutPhoto = true;
            cutoutBusy = false;
            updateAvailability();
            draw();
            say('Background removed. Pick a background colour or save a transparent PNG. You can restore the original photo at any time.');
        } catch (error) {
            if (version !== photoVersion) return;
            cutoutBusy = false;
            updateAvailability();
            say(error.message || 'Background removal failed. Your original photo is still here; try again or use a transparent PNG.', true);
        }
    });
    document.getElementById('hw-restore-photo').addEventListener('click', function () {
        photo = originalPhoto;
        cutoutPhoto = false;
        updateAvailability();
        draw();
        say('Original photo restored.');
    });

    download.addEventListener('click', function () {
        if (!photo || busy() || exportBusy) return;
        exportBusy = true;
        updateAvailability();
        say('Preparing your picture…');
        // Paint synchronously so a slider change immediately before saving is included.
        var exportCanvas = document.createElement('canvas');
        exportCanvas.width = exportCanvas.height = 1200;
        var fileName = 'hashwear' + slots.filter(function (slot) { return layers[slot]; }).map(function (slot) { return '-' + layers[slot].item.id; }).join('') + '.png';
        try {
            paint(exportCanvas.getContext('2d'));
            exportCanvas.toBlob(function (blob) {
                exportBusy = false;
                updateAvailability();
                if (!blob) { say('The picture couldn’t be saved. Please try again.', true); return; }
                var url = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
                say('Your PNG is ready. Check your browser’s downloads.');
            }, 'image/png');
        } catch (error) {
            exportBusy = false;
            updateAvailability();
            say('The picture couldn’t be saved. Open this page through your website or a local preview server, then try again.', true);
        }
    });

    syncControls();
    Promise.all([usePortrait(), wear(catalog.items[0], 'head', true)]).then(function () {
        syncControls();
        draw();
    });
})();
