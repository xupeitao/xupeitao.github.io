(function () {
    'use strict';

    var section = document.querySelector('.experience-section');
    if (!section) return;

    var controls = section.querySelector('[data-experience-filters]');
    var entries = section.querySelectorAll('[data-experience-categories]');
    var count = section.querySelector('[data-experience-count]');
    if (!controls || !count) return;

    var buttons = controls.querySelectorAll('[data-experience-filter]');
    controls.hidden = false;

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            var filter = button.getAttribute('data-experience-filter');
            var visible = 0;

            entries.forEach(function (entry) {
                var categories = entry.getAttribute('data-experience-categories').split(' ');
                entry.hidden = filter !== 'all' && categories.indexOf(filter) === -1;
                if (!entry.hidden) visible += 1;
            });

            buttons.forEach(function (other) {
                other.setAttribute('aria-pressed', String(other === button));
            });

            count.textContent = 'Showing ' + visible + (visible === 1 ? ' experience' : ' experiences');
        });
    });
})();
