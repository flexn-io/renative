'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hasDOM = typeof window !== "undefined" && window.document;

var WIDTH = hasDOM ? window.innerWidth : 0;
var HEIGHT = hasDOM ? window.innerHeight : 0;

var VisualDebugger = function () {
  function VisualDebugger() {
    _classCallCheck(this, VisualDebugger);

    if (hasDOM) {
      this.debugCtx = VisualDebugger.createCanvas('sn-debug', 1010);
      this.layoutsCtx = VisualDebugger.createCanvas('sn-layouts', 1000);
    }
  }

  _createClass(VisualDebugger, [{
    key: 'clear',
    value: function clear() {
      if (!hasDOM) return;
      this.debugCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }
  }, {
    key: 'clearLayouts',
    value: function clearLayouts() {
      if (!hasDOM) return;
      this.layoutsCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }
  }, {
    key: 'drawLayout',
    value: function drawLayout(layout, focusKey, parentFocusKey) {
      if (!hasDOM) return;
      this.layoutsCtx.strokeStyle = 'green';
      this.layoutsCtx.strokeRect(layout.left, layout.top, layout.width, layout.height);
      this.layoutsCtx.font = '8px monospace';
      this.layoutsCtx.fillStyle = 'red';
      this.layoutsCtx.fillText(focusKey, layout.left, layout.top + 10);
      this.layoutsCtx.fillText(parentFocusKey, layout.left, layout.top + 25);
      this.layoutsCtx.fillText('left: ' + layout.left, layout.left, layout.top + 40);
      this.layoutsCtx.fillText('top: ' + layout.top, layout.left, layout.top + 55);
    }
  }, {
    key: 'drawPoint',
    value: function drawPoint(x, y) {
      if (!hasDOM) return;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'blue';
      var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

      this.debugCtx.strokeStyle = color;
      this.debugCtx.lineWidth = 3;
      this.debugCtx.strokeRect(x - size / 2, y - size / 2, size, size);
    }
  }], [{
    key: 'createCanvas',
    value: function createCanvas(id, zIndex) {
      var canvas = document.querySelector('#' + id) || document.createElement('canvas');

      canvas.setAttribute('id', id);

      var ctx = canvas.getContext('2d');

      canvas.style = 'position: fixed; top: 0; left: 0; z-index: ' + zIndex;

      document.body.appendChild(canvas);

      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      return ctx;
    }
  }]);

  return VisualDebugger;
}();

exports.default = VisualDebugger;