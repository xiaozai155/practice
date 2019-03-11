"use strict";

(function () {
  (function () {
    var docEl = document.documentElement;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var scale = 1 / window.devicePixelRatio;

    var recalc = function recalc() {
      var clientWidth = docEl.clientWidth;
      var uiWidth = 1080;
      if (!clientWidth) return;
      docEl.style.fontSize = 100 * (clientWidth / uiWidth) + 'px';
    };

    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable = no, shrink-to-fit=no');
    document.querySelector('body').style.opacity = 1;
    if (!document.addEventListener) return;
    window.addEventListener(resizeEvt, recalc, false);
    document.addEventListener('DOMContentLoaded', recalc, false);
  })();
})();