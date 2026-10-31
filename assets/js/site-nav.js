(function () {
    'use strict';

    var header = document.querySelector('.responsive-header');
    if (!header) return;

    var trigger = header.querySelector('.menu-trigger');
    var navigation = header.querySelector('#primary-navigation');
    if (!trigger || !navigation) return;
    var mobile = window.matchMedia('(max-width: 991px)');

    // Use one responsive menu state instead of the template slideToggle handler.
    if (window.jQuery) window.jQuery(trigger).off('click');

    function setMenu(open) {
        header.classList.toggle('is-menu-open', open);
        trigger.classList.toggle('active', open);
        trigger.setAttribute('aria-expanded', String(open));
        if (window.jQuery) window.jQuery(navigation).stop(true, true).removeAttr('style');
    }

    trigger.addEventListener('click', function () {
        setMenu(!header.classList.contains('is-menu-open'));
    });

    navigation.addEventListener('click', function (event) {
        if (event.target.closest('a')) setMenu(false);
    }, true);

    document.addEventListener('click', function (event) {
        if (!header.contains(event.target)) setMenu(false);
    }, true);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && header.classList.contains('is-menu-open')) {
            setMenu(false);
            trigger.focus();
        }
    });

    mobile.addEventListener('change', function () { setMenu(false); });
    setMenu(false);

})();
