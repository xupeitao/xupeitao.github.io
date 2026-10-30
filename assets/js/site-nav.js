(function () {
    'use strict';

    var menus = document.querySelectorAll('.more-menu');
    document.addEventListener('click', function (event) {
        menus.forEach(function (menu) {
            if (!menu.contains(event.target)) menu.open = false;
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        menus.forEach(function (menu) {
            if (!menu.open) return;
            menu.open = false;
            menu.querySelector('summary').focus();
        });
    });

    var trigger = document.querySelector('.menu-trigger');
    if (trigger) {
        trigger.addEventListener('click', function () {
            trigger.setAttribute('aria-expanded', String(trigger.classList.contains('active')));
        });
    }
})();
