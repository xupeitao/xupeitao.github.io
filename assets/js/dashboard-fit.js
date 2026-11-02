(function () {
    'use strict';

    // Keep the published dashboard canvas intact, including its toolbar.
    // Scale the whole interactive surface, rather than narrowing its viewport.
    var dashboards = document.querySelectorAll('[data-dashboard-fit]');
    dashboards.forEach(function (frame) {
        var stage = frame.querySelector('.dashboard-fit-stage');
        var width = Number(frame.getAttribute('data-dashboard-width'));
        var height = Number(frame.getAttribute('data-dashboard-height'));
        if (!stage || !(width > 0) || !(height > 0)) return;

        frame.style.setProperty('--dashboard-width', String(width));
        frame.style.setProperty('--dashboard-height', String(height));

        function fitDashboard() {
            var availableWidth = frame.clientWidth;
            if (!availableWidth) return;
            var scale = Math.min(1, availableWidth / width);
            stage.style.width = width + 'px';
            stage.style.height = height + 'px';
            stage.style.transform = 'scale(' + scale + ')';
            // Match layout height to the transformed canvas: no extra space or clipping.
            frame.style.height = (height * scale) + 'px';
        }

        fitDashboard();
        if (window.ResizeObserver) {
            var observer = new ResizeObserver(fitDashboard);
            observer.observe(frame);
        } else {
            window.addEventListener('resize', fitDashboard);
        }
    });
})();
