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

    function applyFilter(filter) {
        var visible = 0;

        entries.forEach(function (entry) {
            var categories = entry.getAttribute('data-experience-categories').split(' ');
            entry.hidden = filter !== 'all' && categories.indexOf(filter) === -1;
            if (!entry.hidden) visible += 1;
        });

        buttons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.getAttribute('data-experience-filter') === filter));
        });

        count.textContent = 'Showing ' + visible + (visible === 1 ? ' experience' : ' experiences');
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            applyFilter(button.getAttribute('data-experience-filter'));
        });
    });

    var timeline = section.querySelector('.career-timeline');
    if (timeline) {
        // Reveal the destination before the template's hash-link scrolling handlers run.
        timeline.addEventListener('click', function (event) {
            if (event.target.closest('[data-career-link]')) applyFilter('all');
        }, true);
    }
})();
