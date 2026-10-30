(function () {
    'use strict';

    var catalog = document.querySelector('[data-project-catalog]');
    if (!catalog) return;

    var controls = catalog.querySelector('[data-project-filters]');
    var summary = catalog.querySelector('[data-project-count]');
    var groups = catalog.querySelectorAll('[data-project-group]');
    var cards = catalog.querySelectorAll('[data-project-categories]');
    if (!controls || !summary) return;

    var buttons = controls.querySelectorAll('[data-project-filter]');
    var labels = {
        all: 'All',
        data: 'Data Analytics',
        gis: 'GIS',
        structure: 'Structural Design',
        bim: 'BIM'
    };
    var aliases = {
        all: 'all',
        top: 'all',
        data: 'data',
        analytics: 'data',
        'data-analytics': 'data',
        subscribe: 'data',
        gis: 'gis',
        structure: 'structure',
        'structural-design': 'structure',
        testimonials: 'structure',
        bim: 'bim',
        projects: 'bim'
    };

    function matches(card, filter) {
        var categories = card.getAttribute('data-project-categories').split(/\s+/);
        return filter === 'all' || categories.indexOf(filter) !== -1;
    }

    function countText(count) {
        return count + (count === 1 ? ' project' : ' projects');
    }

    function readFilter() {
        var url = new URL(window.location.href);
        var query = (url.searchParams.get('category') || '').toLowerCase();
        var hash = url.hash.slice(1).toLowerCase();
        return aliases[query] || aliases[hash] || 'all';
    }

    function applyFilter(filter, updateUrl) {
        if (!Object.prototype.hasOwnProperty.call(labels, filter)) filter = 'all';
        var visible = 0;

        cards.forEach(function (card) {
            card.hidden = !matches(card, filter);
            if (!card.hidden) visible += 1;
        });

        groups.forEach(function (group) {
            var groupCards = group.querySelectorAll('[data-project-categories]');
            var groupCount = 0;
            groupCards.forEach(function (card) {
                if (!card.hidden) groupCount += 1;
            });

            // Empty categories appear only when explicitly selected.
            group.hidden = groupCount === 0 &&
                (filter === 'all' || group.getAttribute('data-project-group') !== filter);

            var count = group.querySelector('[data-project-group-count]');
            if (count) count.textContent = countText(groupCount);
            var empty = group.querySelector('.project-empty');
            if (empty) empty.hidden = groupCount > 0;
        });

        buttons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.getAttribute('data-project-filter') === filter));
        });

        summary.textContent = visible ? 'Showing ' + countText(visible) :
            'No ' + labels[filter] + ' projects published yet.';

        if (updateUrl) {
            var url = new URL(window.location.href);
            if (filter === 'all') url.searchParams.delete('category');
            else url.searchParams.set('category', filter);
            url.hash = '';
            if (url.href !== window.location.href) {
                window.history.pushState(null, '', url.pathname + url.search);
            }
        }
    }

    buttons.forEach(function (button) {
        var filter = button.getAttribute('data-project-filter');
        var count = 0;
        cards.forEach(function (card) {
            if (matches(card, filter)) count += 1;
        });
        var countLabel = button.querySelector('[data-filter-count]');
        if (countLabel) countLabel.textContent = String(count);

        button.addEventListener('click', function () {
            applyFilter(filter, true);
        });
    });

    window.addEventListener('popstate', function () {
        applyFilter(readFilter(), false);
    });
    window.addEventListener('hashchange', function () {
        applyFilter(readFilter(), false);
    });

    applyFilter(readFilter(), false);
    controls.hidden = false;
})();
