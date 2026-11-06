(function () {
    'use strict';

    var portrait = document.querySelector('[data-portrait-accessories]');
    if (!portrait) return;
    var button = portrait.querySelector('[data-portrait-switch]');
    var layers = portrait.querySelectorAll('[data-accessory-layer]');
    if (!button || layers.length !== 2) return;

    var base = 'assets/images/portrait-accessories-v1/';
    // Coordinates are percentages of the portrait, including its transparent margins.
    // Anchor is the point in each illustration that touches the hair, not its canvas edge.
    var accessories = [
        { file: 'sprout', name: 'a little green sprout', width: '30%', x: '50%', y: '7%', anchor: '-83%', tilt: '-8deg' },
        { file: 'antlers-only', name: 'reindeer antlers', width: '62%', x: '50%', y: '9%', anchor: '-53%', tilt: '-3deg' },
        { file: null, name: 'no accessory' },
        { file: 'crown', name: 'a little crown', width: '44%', x: '50%', y: '7%', anchor: '-75%', tilt: '-5deg' },
        { file: 'hard-hat', name: "an engineer's hard hat", width: '43%', x: '50%', y: '7%', anchor: '-79%', tilt: '-4deg' },
        { file: 'graduation-cap', name: "a master's graduation cap", width: '50%', x: '50%', y: '7%', anchor: '-76%', tilt: '-4deg' },
        { file: null, name: 'no accessory' },
        { file: 'squirrel', name: 'a little squirrel', width: '35%', x: '50%', y: '7%', anchor: '-84%', tilt: '0deg' },
        { file: null, name: 'no accessory' },
        { file: 'red-maple', name: 'a little red maple tree', width: '40%', x: '50%', y: '7%', anchor: '-78%', tilt: '0deg' },
        { file: 'cat', name: 'a little cat', width: '43%', x: '50%', y: '7%', anchor: '-77%', tilt: '0deg' },
        { file: null, name: 'no accessory' }
    ];

    var activeLayer = layers[0];
    var requestedIndex = 0;
    var introStep = 0;
    var requestVersion = 0;
    var failed = new Set();
    var cache = new Map();

    function describe(accessory) {
        var description = accessory.file ? ' with ' + accessory.name : ' without a head accessory';
        button.setAttribute('aria-label', 'Peitao (Evan) Xu' + description + '. Change head accessory.');
        button.setAttribute('data-current-accessory', accessory.file || 'none');
    }

    function load(accessory) {
        if (!cache.has(accessory.file)) {
            cache.set(accessory.file, new Promise(function (resolve, reject) {
                var image = new Image();
                image.onload = function () {
                    if (image.decode) image.decode().then(function () { resolve(image); }, function () { resolve(image); });
                    else resolve(image);
                };
                image.onerror = reject;
                image.src = base + accessory.file + '.png';
            }));
        }
        return cache.get(accessory.file);
    }

    function show(index) {
        requestedIndex = index;
        var version = ++requestVersion;
        var accessory = accessories[index];
        if (!accessory.file) {
            layers.forEach(function (layer) { layer.classList.remove('is-visible'); });
            describe(accessory);
            return;
        }
        load(accessory).then(function (image) {
            // A slow earlier request must not replace a more recent click.
            if (version !== requestVersion) return;
            var incoming = activeLayer === layers[0] ? layers[1] : layers[0];
            ['width', 'x', 'y', 'anchor', 'tilt'].forEach(function (property) {
                incoming.style.setProperty('--accessory-' + property, accessory[property]);
            });
            incoming.src = image.src;
            activeLayer.classList.remove('is-visible');
            incoming.classList.add('is-visible');
            activeLayer = incoming;
            describe(accessory);
        }).catch(function () {
            if (version !== requestVersion) return;
            failed.add(index);
            // Undecorated slots remain available even if accessory images fail.
            next();
        });
    }

    function next() {
        // First visit: sprout (default), antlers, undecorated, then crown.
        while (introStep < 3) {
            introStep += 1;
            if (!failed.has(introStep)) { show(introStep); return; }
        }
        // Keep the four undecorated entries as weighted options. Exclude the
        // current look so every click produces a change, including blank slots.
        var currentFile = accessories[requestedIndex].file;
        var choices = [];
        accessories.forEach(function (accessory, index) {
            if (!failed.has(index) && accessory.file !== currentFile) choices.push(index);
        });
        if (choices.length) show(choices[Math.floor(Math.random() * choices.length)]);
    }

    button.addEventListener('click', next);

    button.disabled = false;
    describe(accessories[0]);
})();
