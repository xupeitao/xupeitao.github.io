(function () {
    'use strict';

    var portrait = document.querySelector('[data-portrait-accessories]');
    if (!portrait) return;
    var button = portrait.querySelector('[data-portrait-switch]');
    var layers = portrait.querySelectorAll('[data-accessory-layer]');
    if (!button || layers.length !== 2) return;

    var base = 'assets/images/portrait-accessories-v1/';
    var catalog = window.HashwearCatalog;
    if (!catalog || !catalog.items || !catalog.items.length) return;
    // Coordinates are percentages of the portrait, including its transparent margins.
    // Anchor is the point in each illustration that touches the hair, not its canvas edge.
    var looks = catalog.items.map(function (item) {
        return {
            id: item.id, name: item.name, src: item.src || base + item.file,
            width: item.head.width + '%', x: '50%', y: item.head.y + '%',
            anchor: '-' + item.head.anchor + '%', tilt: item.head.tilt + 'deg'
        };
    });
    var undecorated = { id: null, name: 'no accessory' };
    var introIds = ['sprout', 'antlers', 'crown'];
    var introLooks = introIds.map(function (id) { return looks.find(function (look) { return look.id === id; }); });
    if (introLooks.some(function (look) { return !look; })) return;
    var accessories = [introLooks[0], introLooks[1], undecorated, introLooks[2]].concat(
        looks.filter(function (look) { return introIds.indexOf(look.id) === -1; }),
        [undecorated, undecorated, undecorated]
    );

    var activeLayer = layers[0];
    var requestedIndex = 0;
    var introStep = 0;
    var requestVersion = 0;
    var failed = new Set();
    var cache = new Map();

    function describe(accessory) {
        var description = accessory.id ? ' with ' + accessory.name : ' without a head accessory';
        button.setAttribute('aria-label', 'Peitao (Evan) Xu' + description + '. Change head accessory.');
        button.setAttribute('data-current-accessory', accessory.id || 'none');
    }

    function load(accessory) {
        if (!cache.has(accessory.id)) {
            cache.set(accessory.id, new Promise(function (resolve, reject) {
                var image = new Image();
                image.onload = function () {
                    if (image.decode) image.decode().then(function () { resolve(image); }, function () { resolve(image); });
                    else resolve(image);
                };
                image.onerror = reject;
                image.src = accessory.src;
            }));
        }
        return cache.get(accessory.id);
    }

    function show(index) {
        requestedIndex = index;
        var version = ++requestVersion;
        var accessory = accessories[index];
        if (!accessory.id) {
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
        var currentId = accessories[requestedIndex].id;
        var choices = [];
        accessories.forEach(function (accessory, index) {
            if (!failed.has(index) && accessory.id !== currentId) choices.push(index);
        });
        if (choices.length) show(choices[Math.floor(Math.random() * choices.length)]);
    }

    button.addEventListener('click', next);

    button.disabled = false;
    describe(accessories[0]);
})();
