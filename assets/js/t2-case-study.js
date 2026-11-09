(function () {
    'use strict';

    var root = document.getElementById('t2-portfolio-case');
    if (!root) return;

    var boards = JSON.parse(root.querySelector('[data-t2-gallery]').textContent);
    var buttons = Array.from(root.querySelectorAll('[data-t2-view]'));
    var image = root.querySelector('[data-t2-board-image]');
    var title = root.querySelector('[data-t2-board-title]');
    var description = root.querySelector('[data-t2-board-description]');
    var original = root.querySelector('[data-t2-board-original]');

    function selectBoard(button) {
        var board = boards[button.dataset.t2View];
        if (!board) return;
        buttons.forEach(function (option) {
            option.setAttribute('aria-pressed', String(option === button));
        });
        image.width = board.width;
        image.height = board.height;
        image.alt = board.alt;
        image.src = board.src;
        title.textContent = board.title;
        description.textContent = board.description;
        original.href = board.src;
    }

    buttons.forEach(function (button, index) {
        // Native buttons support Enter and Space; arrows also move and select a view.
        button.addEventListener('click', function () { selectBoard(button); });
        button.addEventListener('keydown', function (event) {
            var next;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = buttons.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            buttons[next].focus({ preventScroll: true });
            selectBoard(buttons[next]);
        });
    });

    var jumpLinks = Array.from(root.querySelectorAll('.t2-case-nav a'));
    function markLocation() {
        jumpLinks.forEach(function (link) {
            if (link.hash === window.location.hash) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }
    window.addEventListener('hashchange', markLocation);
    markLocation();
})();
