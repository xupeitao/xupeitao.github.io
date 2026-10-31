(function () {
    'use strict';

    var section = document.querySelector('.experience-section');
    if (!section) return;

    var controls = section.querySelector('[data-experience-filters]');
    var entries = section.querySelectorAll('[data-experience-categories]');
    var earlier = section.querySelector('.earlier-internships');
    var count = section.querySelector('[data-experience-count]');
    if (!controls || !count) return;

    var buttons = controls.querySelectorAll('[data-experience-filter]');
    function applyFilter(filter) {
        var visible = 0;
        var internships = 0;

        entries.forEach(function (entry) {
            var categories = entry.getAttribute('data-experience-categories').split(' ');
            entry.hidden = filter !== 'all' && categories.indexOf(filter) === -1;
            if (!entry.hidden) {
                if (entry.classList.contains('internship-entry')) internships += 1;
                else visible += 1;
            }
        });

        if (earlier) {
            earlier.hidden = internships === 0;
            earlier.open = filter !== 'all' && internships > 0;
        }

        buttons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.getAttribute('data-experience-filter') === filter));
        });

        var groups = [];
        if (visible) groups.push(visible + (visible === 1 ? ' experience' : ' experiences'));
        if (internships) groups.push(internships + (internships === 1 ? ' earlier internship' : ' earlier internships'));
        count.textContent = groups.length ? 'Showing ' + groups.join(' + ') : 'No matching experience.';
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

    applyFilter('all');
    controls.hidden = false;
})();
