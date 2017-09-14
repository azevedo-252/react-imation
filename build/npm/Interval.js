// An easy way to repeatedly set an interval with a
// component.
// It extracts away the react lifecycle challenges
// so that all you have to think about is what to do
// every tick and how to schedule the next interval.

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Interval = (function (_Component) {
  _inherits(Interval, _Component);

  function Interval() {
    _classCallCheck(this, Interval);

    _get(Object.getPrototypeOf(Interval.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Interval, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this = this;

      this._updateTick(this.props.onTick);

      this.scheduleNextTick = function (delay) {
        // NOTE: Cancel previous scheduled timeout:
        // this means that calling scheduleTick multiple
        // times will only schedule the last tick, and previous
        // calls will be cancelled.
        clearTimeout(_this.timeoutId);
        _this.timeoutId = setTimeout(_this.tick, delay);
      };

      this.rafId = requestAnimationFrame(this.tick);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.onTick !== nextProps.onTick) {
        this._updateTick(nextProps.onTick);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      cancelAnimationFrame(this.rafId);
      clearTimeout(this.timeoutId);
    }
  }, {
    key: '_updateTick',
    value: function _updateTick(onTick) {
      var _this2 = this;

      this.tick = function () {
        return onTick(_this2.scheduleNextTick);
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }], [{
    key: 'propTypes',
    value: {
      onTick: _react.PropTypes.func.isRequired
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      children: null
    },
    enumerable: true
  }]);

  return Interval;
})(_react.Component);

exports['default'] = Interval;
module.exports = exports['default'];