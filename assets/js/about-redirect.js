(function () {
    'use strict';
    var destination = new URL('index.html', window.location.href);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    window.location.replace(destination.href);
})();
