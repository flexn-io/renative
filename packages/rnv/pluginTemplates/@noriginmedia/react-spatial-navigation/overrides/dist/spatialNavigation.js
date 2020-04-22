'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChildClosestToOrigin = exports.ROOT_FOCUS_KEY = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DEFAULT_KEY_MAP;

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _first = require('lodash/first');

var _first2 = _interopRequireDefault(_first);

var _sortBy = require('lodash/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

var _findKey = require('lodash/findKey');

var _findKey2 = _interopRequireDefault(_findKey);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _forOwn = require('lodash/forOwn');

var _forOwn2 = _interopRequireDefault(_forOwn);

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _difference = require('lodash/difference');

var _difference2 = _interopRequireDefault(_difference);

var _measureLayout = require('./measureLayout');

var _measureLayout2 = _interopRequireDefault(_measureLayout);

var _visualDebugger = require('./visualDebugger');

var _visualDebugger2 = _interopRequireDefault(_visualDebugger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ROOT_FOCUS_KEY = exports.ROOT_FOCUS_KEY = 'SN:ROOT';

var ADJACENT_SLICE_THRESHOLD = 0.2;

/**
 * Adjacent slice is 5 times more important than diagonal
 */
var ADJACENT_SLICE_WEIGHT = 5;
var DIAGONAL_SLICE_WEIGHT = 1;

/**
 * Main coordinate distance is 5 times more important
 */
var MAIN_COORDINATE_WEIGHT = 5;

var DIRECTION_LEFT = 'left';
var DIRECTION_RIGHT = 'right';
var DIRECTION_UP = 'up';
var DIRECTION_DOWN = 'down';
var KEY_ENTER = 'enter';

var DEFAULT_KEY_MAP = (_DEFAULT_KEY_MAP = {}, _defineProperty(_DEFAULT_KEY_MAP, DIRECTION_LEFT, 37), _defineProperty(_DEFAULT_KEY_MAP, DIRECTION_UP, 38), _defineProperty(_DEFAULT_KEY_MAP, DIRECTION_RIGHT, 39), _defineProperty(_DEFAULT_KEY_MAP, DIRECTION_DOWN, 40), _defineProperty(_DEFAULT_KEY_MAP, KEY_ENTER, 13), _DEFAULT_KEY_MAP);

var DEBUG_FN_COLORS = ['#0FF', '#FF0', '#F0F'];

var THROTTLE_OPTIONS = {
  leading: true,
  trailing: false
};

var getChildClosestToOrigin = exports.getChildClosestToOrigin = function getChildClosestToOrigin(children) {
  var childrenClosestToOrigin = (0, _sortBy2.default)(children, function (_ref) {
    var layout = _ref.layout;
    return Math.abs(layout.left) + Math.abs(layout.top);
  });

  return (0, _first2.default)(childrenClosestToOrigin);
};

/* eslint-disable no-nested-ternary */

var SpatialNavigation = function () {
  _createClass(SpatialNavigation, [{
    key: 'sortSiblingsByPriority',


    /**
     * Inspired by: https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS_for_TV/TV_remote_control_navigation#Algorithm_design
     * Ref Corners are the 2 corners of the current component in the direction of navigation
     * They used as a base to measure adjacent slices
     */
    value: function sortSiblingsByPriority(siblings, currentLayout, direction, focusKey) {
      var _this = this;

      var isVerticalDirection = direction === DIRECTION_DOWN || direction === DIRECTION_UP;

      var refCorners = SpatialNavigation.getRefCorners(direction, false, currentLayout);

      return (0, _sortBy2.default)(siblings, function (sibling) {
        var siblingCorners = SpatialNavigation.getRefCorners(direction, true, sibling.layout);

        var isAdjacentSlice = SpatialNavigation.isAdjacentSlice(refCorners, siblingCorners, isVerticalDirection);

        var primaryAxisFunction = isAdjacentSlice ? SpatialNavigation.getPrimaryAxisDistance : SpatialNavigation.getSecondaryAxisDistance;

        var secondaryAxisFunction = isAdjacentSlice ? SpatialNavigation.getSecondaryAxisDistance : SpatialNavigation.getPrimaryAxisDistance;

        var primaryAxisDistance = primaryAxisFunction(refCorners, siblingCorners, isVerticalDirection);
        var secondaryAxisDistance = secondaryAxisFunction(refCorners, siblingCorners, isVerticalDirection);

        /**
         * The higher this value is, the less prioritised the candidate is
         */
        var totalDistancePoints = primaryAxisDistance * MAIN_COORDINATE_WEIGHT + secondaryAxisDistance;

        /**
         * + 1 here is in case of distance is zero, but we still want to apply Adjacent priority weight
         */
        var priority = (totalDistancePoints + 1) / (isAdjacentSlice ? ADJACENT_SLICE_WEIGHT : DIAGONAL_SLICE_WEIGHT);

        _this.log('smartNavigate', 'distance (primary, secondary, total weighted) for ' + sibling.focusKey + ' relative to ' + focusKey + ' is', primaryAxisDistance, secondaryAxisDistance, totalDistancePoints);

        _this.log('smartNavigate', 'priority for ' + sibling.focusKey + ' relative to ' + focusKey + ' is', priority);

        if (_this.visualDebugger) {
          _this.visualDebugger.drawPoint(siblingCorners.a.x, siblingCorners.a.y, 'yellow', 6);
          _this.visualDebugger.drawPoint(siblingCorners.b.x, siblingCorners.b.y, 'yellow', 6);
        }

        return priority;
      });
    }
  }], [{
    key: 'getCutoffCoordinate',

    /**
     * Used to determine the coordinate that will be used to filter items that are over the "edge"
     */
    value: function getCutoffCoordinate(isVertical, isIncremental, isSibling, layout) {
      var itemX = layout.left;
      var itemY = layout.top;
      var itemWidth = layout.width;
      var itemHeight = layout.height;

      var coordinate = isVertical ? itemY : itemX;
      var itemSize = isVertical ? itemHeight : itemWidth;

      return isIncremental ? isSibling ? coordinate : coordinate + itemSize : isSibling ? coordinate + itemSize : coordinate;
    }

    /**
     * Returns two corners (a and b) coordinates that are used as a reference points
     * Where "a" is always leftmost and topmost corner, and "b" is rightmost bottommost corner
     */

  }, {
    key: 'getRefCorners',
    value: function getRefCorners(direction, isSibling, layout) {
      var itemX = layout.left;
      var itemY = layout.top;
      var itemWidth = layout.width;
      var itemHeight = layout.height;

      var result = {
        a: {
          x: 0,
          y: 0
        },
        b: {
          x: 0,
          y: 0
        }
      };

      switch (direction) {
        case DIRECTION_UP:
          {
            var y = isSibling ? itemY + itemHeight : itemY;

            result.a = {
              x: itemX,
              y: y
            };

            result.b = {
              x: itemX + itemWidth,
              y: y
            };

            break;
          }

        case DIRECTION_DOWN:
          {
            var _y = isSibling ? itemY : itemY + itemHeight;

            result.a = {
              x: itemX,
              y: _y
            };

            result.b = {
              x: itemX + itemWidth,
              y: _y
            };

            break;
          }

        case DIRECTION_LEFT:
          {
            var x = isSibling ? itemX + itemWidth : itemX;

            result.a = {
              x: x,
              y: itemY
            };

            result.b = {
              x: x,
              y: itemY + itemHeight
            };

            break;
          }

        case DIRECTION_RIGHT:
          {
            var _x = isSibling ? itemX : itemX + itemWidth;

            result.a = {
              x: _x,
              y: itemY
            };

            result.b = {
              x: _x,
              y: itemY + itemHeight
            };

            break;
          }

        default:
          break;
      }

      return result;
    }

    /**
     * Calculates if the sibling node is intersecting enough with the ref node by the secondary coordinate
     */

  }, {
    key: 'isAdjacentSlice',
    value: function isAdjacentSlice(refCorners, siblingCorners, isVerticalDirection) {
      var refA = refCorners.a,
          refB = refCorners.b;
      var siblingA = siblingCorners.a,
          siblingB = siblingCorners.b;

      var coordinate = isVerticalDirection ? 'x' : 'y';

      var refCoordinateA = refA[coordinate];
      var refCoordinateB = refB[coordinate];
      var siblingCoordinateA = siblingA[coordinate];
      var siblingCoordinateB = siblingB[coordinate];

      var thresholdDistance = (refCoordinateB - refCoordinateA) * ADJACENT_SLICE_THRESHOLD;

      var intersectionLength = Math.max(0, Math.min(refCoordinateB, siblingCoordinateB) - Math.max(refCoordinateA, siblingCoordinateA));

      return intersectionLength >= thresholdDistance;
    }
  }, {
    key: 'getPrimaryAxisDistance',
    value: function getPrimaryAxisDistance(refCorners, siblingCorners, isVerticalDirection) {
      var refA = refCorners.a;
      var siblingA = siblingCorners.a;

      var coordinate = isVerticalDirection ? 'y' : 'x';

      return Math.abs(siblingA[coordinate] - refA[coordinate]);
    }
  }, {
    key: 'getSecondaryAxisDistance',
    value: function getSecondaryAxisDistance(refCorners, siblingCorners, isVerticalDirection) {
      var refA = refCorners.a,
          refB = refCorners.b;
      var siblingA = siblingCorners.a,
          siblingB = siblingCorners.b;

      var coordinate = isVerticalDirection ? 'x' : 'y';

      var refCoordinateA = refA[coordinate];
      var refCoordinateB = refB[coordinate];
      var siblingCoordinateA = siblingA[coordinate];
      var siblingCoordinateB = siblingB[coordinate];

      var distancesToCompare = [];

      distancesToCompare.push(Math.abs(siblingCoordinateA - refCoordinateA));
      distancesToCompare.push(Math.abs(siblingCoordinateA - refCoordinateB));
      distancesToCompare.push(Math.abs(siblingCoordinateB - refCoordinateA));
      distancesToCompare.push(Math.abs(siblingCoordinateB - refCoordinateB));

      return Math.min.apply(Math, distancesToCompare);
    }
  }]);

  function SpatialNavigation() {
    _classCallCheck(this, SpatialNavigation);

    /**
     * Storage for all focusable components
     */
    this.focusableComponents = {};

    /**
     * Storing current focused key
     */
    this.focusKey = null;

    /**
     * This collection contains focus keys of the elements that are having a child focused
     * Might be handy for styling of certain parent components if their child is focused.
     */
    this.parentsHavingFocusedChild = [];

    this.enabled = false;
    this.nativeMode = false;
    this.throttle = 0;

    this.pressedKeys = {};

    /**
     * Flag used to block key events from this service
     * @type {boolean}
     */
    this.paused = false;

    this.keyDownEventListener = null;
    this.keyUpEventListener = null;
    this.keyMap = DEFAULT_KEY_MAP;

    this.onKeyEvent = this.onKeyEvent.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.navigateByDirection = this.navigateByDirection.bind(this);
    this.init = this.init.bind(this);
    this.setKeyMap = this.setKeyMap.bind(this);

    this.debug = false;
    this.visualDebugger = null;

    this.logIndex = 0;
  }

  _createClass(SpatialNavigation, [{
    key: 'init',
    value: function init() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$debug = _ref2.debug,
          debug = _ref2$debug === undefined ? false : _ref2$debug,
          _ref2$visualDebug = _ref2.visualDebug,
          visualDebug = _ref2$visualDebug === undefined ? false : _ref2$visualDebug,
          _ref2$nativeMode = _ref2.nativeMode,
          nativeMode = _ref2$nativeMode === undefined ? false : _ref2$nativeMode,
          _ref2$throttle = _ref2.throttle,
          throttle = _ref2$throttle === undefined ? 0 : _ref2$throttle;

      if (!this.enabled) {
        this.enabled = true;
        this.nativeMode = nativeMode;

        this.debug = debug;

        if (!this.nativeMode) {
          if (Number.isInteger(throttle) && throttle > 0) {
            this.throttle = throttle;
          }
          this.bindEventHandlers();
          if (visualDebug) {
            this.visualDebugger = new _visualDebugger2.default();
            this.startDrawLayouts();
          }
        }
      }
    }
  }, {
    key: 'startDrawLayouts',
    value: function startDrawLayouts() {
      var _this2 = this;

      var draw = function draw() {
        requestAnimationFrame(function () {
          _this2.visualDebugger.clearLayouts();
          (0, _forOwn2.default)(_this2.focusableComponents, function (component, focusKey) {
            _this2.visualDebugger.drawLayout(component.layout, focusKey, component.parentFocusKey);
          });
          draw();
        });
      };

      draw();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.enabled) {
        this.enabled = false;
        this.nativeMode = false;
        this.throttle = 0;
        this.focusKey = null;
        this.parentsHavingFocusedChild = [];
        this.focusableComponents = {};
        this.paused = false;
        this.keyMap = DEFAULT_KEY_MAP;

        this.unbindEventHandlers();
      }
    }
  }, {
    key: 'getEventType',
    value: function getEventType(keyCode) {
      return (0, _findKey2.default)(this.getKeyMap(), function (code) {
        return keyCode === code;
      });
    }
  }, {
    key: 'bindEventHandlers',
    value: function bindEventHandlers() {
      var _this3 = this;

      if (typeof window !== "undefined") {
        this.keyDownEventListener = function (event) {
          if (_this3.paused === true) {
            return;
          }

          if (_this3.debug) {
            _this3.logIndex += 1;
          }

          var eventType = _this3.getEventType(event.keyCode);

          if (!eventType) {
            return;
          }

          _this3.pressedKeys[eventType] = _this3.pressedKeys[eventType] ? _this3.pressedKeys[eventType] + 1 : 1;

          event.preventDefault();
          event.stopPropagation();

          var details = {
            pressedKeys: _this3.pressedKeys
          };

          if (eventType === KEY_ENTER && _this3.focusKey) {
            _this3.onEnterPress(details);

            return;
          }

          var preventDefaultNavigation = _this3.onArrowPress(eventType, details) === false;

          if (preventDefaultNavigation) {
            _this3.log('keyDownEventListener', 'default navigation prevented');
            _this3.visualDebugger && _this3.visualDebugger.clear();
          } else {
            _this3.onKeyEvent(event);
          }
        };

        // Apply throttle only if the option we got is > 0 to avoid limiting the listener to every animation frame
        if (this.throttle) {
          this.keyDownEventListener = (0, _throttle2.default)(this.keyDownEventListener.bind(this), this.throttle, THROTTLE_OPTIONS);
        }

        // When throttling then make sure to only throttle key down and cancel any queued functions in case of key up
        this.keyUpEventListener = function (event) {
          var eventType = _this3.getEventType(event.keyCode);

          Reflect.deleteProperty(_this3.pressedKeys, eventType);

          if (_this3.throttle) {
            _this3.keyDownEventListener.cancel();
          }
        };

        window.addEventListener('keyup', this.keyUpEventListener);
        window.addEventListener('keydown', this.keyDownEventListener);
      }
    }
  }, {
    key: 'unbindEventHandlers',
    value: function unbindEventHandlers() {
      if (typeof window !== "undefined") {
        window.removeEventListener('keydown', this.keyDownEventListener);
        this.keyDownEventListener = null;

        if (this.throttle) {
          window.removeEventListener('keyup', this.keyUpEventListener);
          this.keyUpEventListener = null;
        }
      }
    }
  }, {
    key: 'onEnterPress',
    value: function onEnterPress(details) {
      var component = this.focusableComponents[this.focusKey];

      /* Guard against last-focused component being unmounted at time of onEnterPress (e.g due to UI fading out) */
      if (!component) {
        this.log('onEnterPress', 'noComponent');

        return;
      }

      /* Suppress onEnterPress if the last-focused item happens to lose its 'focused' status. */
      if (!component.focusable) {
        this.log('onEnterPress', 'componentNotFocusable');

        return;
      }

      component.onEnterPressHandler && component.onEnterPressHandler(details);
    }
  }, {
    key: 'onArrowPress',
    value: function onArrowPress() {
      var component = this.focusableComponents[this.focusKey];

      /* Guard against last-focused component being unmounted at time of onArrowPress (e.g due to UI fading out) */
      if (!component) {
        this.log('onArrowPress', 'noComponent');

        return undefined;
      }

      /* It's okay to navigate AWAY from an item that has lost its 'focused' status, so we don't inspect
       * component.focusable. */

      return component && component.onArrowPressHandler && component.onArrowPressHandler.apply(component, arguments);
    }

    /**
     * Move focus by direction, if you can't use buttons or focusing by key.
     *
     * @param {string} direction
     * @param {object} details
     *
     * @example
     * navigateByDirection('right') // The focus is moved to right
     */

  }, {
    key: 'navigateByDirection',
    value: function navigateByDirection(direction) {
      var details = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.paused === true) {
        return;
      }

      var validDirections = [DIRECTION_DOWN, DIRECTION_UP, DIRECTION_LEFT, DIRECTION_RIGHT];

      if (validDirections.includes(direction)) {
        this.log('navigateByDirection', 'direction', direction);
        this.smartNavigate(direction, null, details);
      } else {
        this.log('navigateByDirection', 'Invalid direction. You passed: `' + direction + '`, but you can use only these: ', validDirections);
      }
    }
  }, {
    key: 'onKeyEvent',
    value: function onKeyEvent(event) {
      this.visualDebugger && this.visualDebugger.clear();

      var direction = (0, _findKey2.default)(this.getKeyMap(), function (code) {
        return event.keyCode === code;
      });

      this.smartNavigate(direction, null, { event: event });
    }

    /**
     * This function navigates between siblings OR goes up by the Tree
     * Based on the Direction
     */

  }, {
    key: 'smartNavigate',
    value: function smartNavigate(direction, fromParentFocusKey, details) {
      this.log('smartNavigate', 'direction', direction);
      this.log('smartNavigate', 'fromParentFocusKey', fromParentFocusKey);
      this.log('smartNavigate', 'this.focusKey', this.focusKey);

      var currentComponent = this.focusableComponents[fromParentFocusKey || this.focusKey];

      this.log('smartNavigate', 'currentComponent', currentComponent ? currentComponent.focusKey : undefined, currentComponent ? currentComponent.node : undefined);

      if (currentComponent) {
        var parentFocusKey = currentComponent.parentFocusKey,
            focusKey = currentComponent.focusKey,
            layout = currentComponent.layout;


        var isVerticalDirection = direction === DIRECTION_DOWN || direction === DIRECTION_UP;
        var isIncrementalDirection = direction === DIRECTION_DOWN || direction === DIRECTION_RIGHT;

        var currentCutoffCoordinate = SpatialNavigation.getCutoffCoordinate(isVerticalDirection, isIncrementalDirection, false, layout);

        /**
         * Get only the siblings with the coords on the way of our moving direction
         */
        var siblings = (0, _filter2.default)(this.focusableComponents, function (component) {
          if (component.parentFocusKey === parentFocusKey && component.focusable) {
            var siblingCutoffCoordinate = SpatialNavigation.getCutoffCoordinate(isVerticalDirection, isIncrementalDirection, true, component.layout);

            return isIncrementalDirection ? siblingCutoffCoordinate >= currentCutoffCoordinate : siblingCutoffCoordinate <= currentCutoffCoordinate;
          }

          return false;
        });

        if (this.debug) {
          this.log('smartNavigate', 'currentCutoffCoordinate', currentCutoffCoordinate);
          this.log('smartNavigate', 'siblings', siblings.length + ' elements:', siblings.map(function (sibling) {
            return sibling.focusKey;
          }).join(', '), siblings.map(function (sibling) {
            return sibling.node;
          }));
        }

        if (this.visualDebugger) {
          var refCorners = SpatialNavigation.getRefCorners(direction, false, layout);

          this.visualDebugger.drawPoint(refCorners.a.x, refCorners.a.y);
          this.visualDebugger.drawPoint(refCorners.b.x, refCorners.b.y);
        }

        var sortedSiblings = this.sortSiblingsByPriority(siblings, layout, direction, focusKey);

        var nextComponent = (0, _first2.default)(sortedSiblings);

        this.log('smartNavigate', 'nextComponent', nextComponent ? nextComponent.focusKey : undefined, nextComponent ? nextComponent.node : undefined);

        if (nextComponent) {
          this.setFocus(nextComponent.focusKey, null, details);
        } else {
          var parentComponent = this.focusableComponents[parentFocusKey];

          this.saveLastFocusedChildKey(parentComponent, focusKey);

          this.smartNavigate(direction, parentFocusKey, details);
        }
      }
    }
  }, {
    key: 'saveLastFocusedChildKey',
    value: function saveLastFocusedChildKey(component, focusKey) {
      if (component) {
        this.log('saveLastFocusedChildKey', component.focusKey + ' lastFocusedChildKey set', focusKey);
        component.lastFocusedChildKey = focusKey;
      }
    }
  }, {
    key: 'log',
    value: function log(functionName, debugString) {
      if (this.debug) {
        var _console;

        for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          rest[_key - 2] = arguments[_key];
        }

        (_console = console).log.apply(_console, ['%c' + functionName + '%c' + debugString, 'background: ' + DEBUG_FN_COLORS[this.logIndex % DEBUG_FN_COLORS.length] + '; color: black; padding: 1px 5px;', 'background: #333; color: #BADA55; padding: 1px 5px;'].concat(rest));
      }
    }

    /**
     * This function tries to determine the next component to Focus
     * It's either the target node OR the one down by the Tree if node has children components
     * Based on "targetFocusKey" that means the "intended component to focus"
     */

  }, {
    key: 'getNextFocusKey',
    value: function getNextFocusKey(targetFocusKey) {
      var targetComponent = this.focusableComponents[targetFocusKey];

      /**
       * Security check, if component doesn't exist, stay on the same focusKey
       */
      if (!targetComponent || this.nativeMode) {
        return targetFocusKey;
      }

      var children = (0, _filter2.default)(this.focusableComponents, function (component) {
        return component.parentFocusKey === targetFocusKey && component.focusable;
      });

      if (children.length > 0) {
        var lastFocusedChildKey = targetComponent.lastFocusedChildKey,
            preferredChildFocusKey = targetComponent.preferredChildFocusKey;


        this.log('getNextFocusKey', 'lastFocusedChildKey is', lastFocusedChildKey);
        this.log('getNextFocusKey', 'preferredChildFocusKey is', preferredChildFocusKey);

        /**
         * First of all trying to focus last focused child
         */
        if (lastFocusedChildKey && !targetComponent.forgetLastFocusedChild && this.isParticipatingFocusableComponent(lastFocusedChildKey)) {
          this.log('getNextFocusKey', 'lastFocusedChildKey will be focused', lastFocusedChildKey);

          return this.getNextFocusKey(lastFocusedChildKey);
        }

        /**
         * If there is no lastFocusedChild, trying to focus the preferred focused key
         */
        if (preferredChildFocusKey && this.isParticipatingFocusableComponent(preferredChildFocusKey)) {
          this.log('getNextFocusKey', 'preferredChildFocusKey will be focused', preferredChildFocusKey);

          return this.getNextFocusKey(preferredChildFocusKey);
        }

        /**
         * Otherwise, trying to focus something by coordinates
         */

        var _getChildClosestToOri = getChildClosestToOrigin(children),
            childKey = _getChildClosestToOri.focusKey;

        this.log('getNextFocusKey', 'childKey will be focused', childKey);

        return this.getNextFocusKey(childKey);
      }

      /**
       * If no children, just return targetFocusKey back
       */
      this.log('getNextFocusKey', 'targetFocusKey', targetFocusKey);

      return targetFocusKey;
    }
  }, {
    key: 'addFocusable',
    value: function addFocusable(_ref3) {
      var focusKey = _ref3.focusKey,
          node = _ref3.node,
          parentFocusKey = _ref3.parentFocusKey,
          onEnterPressHandler = _ref3.onEnterPressHandler,
          onArrowPressHandler = _ref3.onArrowPressHandler,
          onBecameFocusedHandler = _ref3.onBecameFocusedHandler,
          onBecameBlurredHandler = _ref3.onBecameBlurredHandler,
          forgetLastFocusedChild = _ref3.forgetLastFocusedChild,
          trackChildren = _ref3.trackChildren,
          onUpdateFocus = _ref3.onUpdateFocus,
          onUpdateHasFocusedChild = _ref3.onUpdateHasFocusedChild,
          preferredChildFocusKey = _ref3.preferredChildFocusKey,
          focusable = _ref3.focusable;

      this.focusableComponents[focusKey] = {
        focusKey: focusKey,
        node: node,
        parentFocusKey: parentFocusKey,
        onEnterPressHandler: onEnterPressHandler,
        onArrowPressHandler: onArrowPressHandler,
        onBecameFocusedHandler: onBecameFocusedHandler,
        onBecameBlurredHandler: onBecameBlurredHandler,
        onUpdateFocus: onUpdateFocus,
        onUpdateHasFocusedChild: onUpdateHasFocusedChild,
        forgetLastFocusedChild: forgetLastFocusedChild,
        trackChildren: trackChildren,
        lastFocusedChildKey: null,
        preferredChildFocusKey: preferredChildFocusKey,
        focusable: focusable,
        layout: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          left: 0,
          top: 0,

          /**
           * Node ref is also duplicated in layout to be reported in onBecameFocused callback
           * E.g. used in native environments to lazy-measure the layout on focus
           */
          node: node
        }
      };

      if (this.nativeMode) {
        return;
      }

      this.updateLayout(focusKey);

      /**
       * If for some reason this component was already focused before it was added, call the update
       */
      if (focusKey === this.focusKey) {
        this.setFocus(focusKey);
      }
    }
  }, {
    key: 'removeFocusable',
    value: function removeFocusable(_ref4) {
      var focusKey = _ref4.focusKey;

      var componentToRemove = this.focusableComponents[focusKey];

      if (componentToRemove) {
        var parentFocusKey = componentToRemove.parentFocusKey;


        Reflect.deleteProperty(this.focusableComponents, focusKey);

        var parentComponent = this.focusableComponents[parentFocusKey];
        var isFocused = focusKey === this.focusKey;

        /**
         * If the component was stored as lastFocusedChild, clear lastFocusedChildKey from parent
         */
        parentComponent && parentComponent.lastFocusedChildKey === focusKey && (parentComponent.lastFocusedChildKey = null);

        if (this.nativeMode) {
          return;
        }

        /**
         * If the component was also focused at this time, focus another one
         */
        if (isFocused) {
          this.setFocus(parentFocusKey);
        }
      }
    }
  }, {
    key: 'getNodeLayoutByFocusKey',
    value: function getNodeLayoutByFocusKey(focusKey) {
      var component = this.focusableComponents[focusKey];

      if (component) {
        return component.layout;
      }

      return null;
    }
  }, {
    key: 'setCurrentFocusedKey',
    value: function setCurrentFocusedKey(newFocusKey, details) {
      if (this.isFocusableComponent(this.focusKey) && newFocusKey !== this.focusKey) {
        var oldComponent = this.focusableComponents[this.focusKey];
        var parentComponent = this.focusableComponents[oldComponent.parentFocusKey];

        this.saveLastFocusedChildKey(parentComponent, this.focusKey);

        oldComponent.onUpdateFocus(false);
        oldComponent.onBecameBlurredHandler(this.getNodeLayoutByFocusKey(this.focusKey), details);
      }

      this.focusKey = newFocusKey;

      if (this.isFocusableComponent(this.focusKey)) {
        var newComponent = this.focusableComponents[this.focusKey];

        newComponent.onUpdateFocus(true);
        newComponent.onBecameFocusedHandler(this.getNodeLayoutByFocusKey(this.focusKey), details);
      }
    }
  }, {
    key: 'updateParentsHasFocusedChild',
    value: function updateParentsHasFocusedChild(focusKey, details) {
      var _this4 = this;

      var parents = [];

      var currentComponent = this.focusableComponents[focusKey];

      /**
       * Recursively iterate the tree up and find all the parents' focus keys
       */
      while (currentComponent) {
        var _currentComponent = currentComponent,
            parentFocusKey = _currentComponent.parentFocusKey;


        var parentComponent = this.focusableComponents[parentFocusKey];

        if (parentComponent) {
          var currentParentFocusKey = parentComponent.focusKey;


          parents.push(currentParentFocusKey);
        }

        currentComponent = parentComponent;
      }

      var parentsToRemoveFlag = (0, _difference2.default)(this.parentsHavingFocusedChild, parents);
      var parentsToAddFlag = (0, _difference2.default)(parents, this.parentsHavingFocusedChild);

      (0, _forEach2.default)(parentsToRemoveFlag, function (parentFocusKey) {
        var parentComponent = _this4.focusableComponents[parentFocusKey];

        parentComponent && parentComponent.trackChildren && parentComponent.onUpdateHasFocusedChild(false);
        _this4.onIntermediateNodeBecameBlurred(parentFocusKey, details);
      });

      (0, _forEach2.default)(parentsToAddFlag, function (parentFocusKey) {
        var parentComponent = _this4.focusableComponents[parentFocusKey];

        parentComponent && parentComponent.trackChildren && parentComponent.onUpdateHasFocusedChild(true);
        _this4.onIntermediateNodeBecameFocused(parentFocusKey, details);
      });

      this.parentsHavingFocusedChild = parents;
    }
  }, {
    key: 'updateParentsLastFocusedChild',
    value: function updateParentsLastFocusedChild(focusKey) {
      var currentComponent = this.focusableComponents[focusKey];

      /**
       * Recursively iterate the tree up and update all the parent's lastFocusedChild
       */
      while (currentComponent) {
        var _currentComponent2 = currentComponent,
            parentFocusKey = _currentComponent2.parentFocusKey;


        var parentComponent = this.focusableComponents[parentFocusKey];

        if (parentComponent) {
          this.saveLastFocusedChildKey(parentComponent, currentComponent.focusKey);
        }

        currentComponent = parentComponent;
      }
    }
  }, {
    key: 'getKeyMap',
    value: function getKeyMap() {
      return this.keyMap;
    }
  }, {
    key: 'setKeyMap',
    value: function setKeyMap(keyMap) {
      this.keyMap = _extends({}, this.getKeyMap(), keyMap);
    }
  }, {
    key: 'isFocusableComponent',
    value: function isFocusableComponent(focusKey) {
      return !!this.focusableComponents[focusKey];
    }

    /**
     * Checks whether the focusableComponent is actually participating in spatial navigation (in other words, is a
     * 'focusable' focusableComponent). Seems less confusing than calling it isFocusableFocusableComponent()
     */

  }, {
    key: 'isParticipatingFocusableComponent',
    value: function isParticipatingFocusableComponent(focusKey) {
      return this.isFocusableComponent(focusKey) && this.focusableComponents[focusKey].focusable;
    }
  }, {
    key: 'onIntermediateNodeBecameFocused',
    value: function onIntermediateNodeBecameFocused(focusKey, details) {
      this.isParticipatingFocusableComponent(focusKey) && this.focusableComponents[focusKey].onBecameFocusedHandler(this.getNodeLayoutByFocusKey(focusKey), details);
    }
  }, {
    key: 'onIntermediateNodeBecameBlurred',
    value: function onIntermediateNodeBecameBlurred(focusKey, details) {
      this.isParticipatingFocusableComponent(focusKey) && this.focusableComponents[focusKey].onBecameBlurredHandler(this.getNodeLayoutByFocusKey(focusKey), details);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.paused = false;
    }
  }, {
    key: 'setFocus',
    value: function setFocus(focusKey, overwriteFocusKey) {
      var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!this.enabled) {
        return;
      }

      var targetFocusKey = overwriteFocusKey || focusKey;

      this.log('setFocus', 'targetFocusKey', targetFocusKey);

      var lastFocusedKey = this.focusKey;
      var newFocusKey = this.getNextFocusKey(targetFocusKey);

      this.log('setFocus', 'newFocusKey', newFocusKey);

      this.setCurrentFocusedKey(newFocusKey, details);
      this.updateParentsHasFocusedChild(newFocusKey, details);
      this.updateParentsLastFocusedChild(lastFocusedKey);

      if (!this.nativeMode) {
        this.updateAllLayouts();
      }
    }
  }, {
    key: 'updateAllLayouts',
    value: function updateAllLayouts() {
      var _this5 = this;

      if (this.nativeMode) {
        return;
      }

      (0, _forOwn2.default)(this.focusableComponents, function (component, focusKey) {
        _this5.updateLayout(focusKey);
      });
    }
  }, {
    key: 'updateLayout',
    value: function updateLayout(focusKey) {
      var component = this.focusableComponents[focusKey];

      if (!component || this.nativeMode) {
        return;
      }

      var node = component.node;


      (0, _measureLayout2.default)(node, function (x, y, width, height, left, top) {
        component.layout = {
          x: x,
          y: y,
          width: width,
          height: height,
          left: left,
          top: top,
          node: node
        };
      });
    }
  }, {
    key: 'updateFocusable',
    value: function updateFocusable(focusKey, _ref5) {
      var node = _ref5.node,
          preferredChildFocusKey = _ref5.preferredChildFocusKey,
          focusable = _ref5.focusable;

      if (this.nativeMode) {
        return;
      }

      var component = this.focusableComponents[focusKey];

      if (component) {
        component.preferredChildFocusKey = preferredChildFocusKey;
        component.focusable = focusable;

        if (node) {
          component.node = node;
        }
      }
    }
  }, {
    key: 'isNativeMode',
    value: function isNativeMode() {
      return this.nativeMode;
    }
  }]);

  return SpatialNavigation;
}();

/**
 * Export singleton
 */


exports.default = new SpatialNavigation();