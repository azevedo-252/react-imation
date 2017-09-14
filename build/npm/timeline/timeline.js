'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports['default'] = timelineFactory;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _tween = require('../tween');

function timelineFactory(React, raf) {
  var Component = React.Component;

  var Timeline = (function (_Component) {
    _inherits(Timeline, _Component);

    // todo: prop types & default props

    function Timeline(props, context) {
      _classCallCheck(this, Timeline);

      _get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this, props, context);

      var _props$timeliner = props.timeliner;
      var timeliner = _props$timeliner === undefined ? new Timeliner(props) : _props$timeliner;

      this.state = {
        time: timeliner.time
      };

      this.timeliner = timeliner;
    }

    _createClass(Timeline, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.playOnMount) this.timeliner.play();
        this._addListener();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._removeListener();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this = this;

        if (nextProps.timeliner && nextProps.timeliner !== this.timeliner) {
          this._removeListener();
          this.timeliner = nextProps.timeliner;
          this._addListener();
        }
        if (this.timeliner) {
          Object.keys(nextProps).forEach(function (key) {
            return _this.timeliner[key] = nextProps[key];
          });
        }
      }
    }, {
      key: '_addListener',
      value: function _addListener() {
        var _this2 = this;

        this._listenerId = this.timeliner.addListener(function (time) {
          return _this2.setState({ time: time });
        });
      }
    }, {
      key: '_removeListener',
      value: function _removeListener() {
        this.timeliner.removeListener(this._listenerId);
      }
    }, {
      key: 'render',
      value: function render() {
        return this.props.children(this.timeliner);
      }
    }]);

    return Timeline;
  })(Component);

  var Timeliner = (function () {
    function Timeliner() {
      var _this3 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Timeliner);

      this.listeners = {};
      this.lastListenerId = 0;

      this._tick = this._tick.bind(this);
      this.play = this.play.bind(this);
      this.pause = this.pause.bind(this);
      this.setPlay = this.setPlay.bind(this);
      this.setTime = this.setTime.bind(this);
      this.playFrom = this.playFrom.bind(this);
      this.togglePlay = this.togglePlay.bind(this);

      Object.keys(options).forEach(function (option) {
        return _this3[option] || (_this3[option] = options[option]);
      });

      this.setTime(options.initialTime || this.time || 0);
      this.increment = this.increment || 1;

      if (this.playing) raf(this._tick);
    }

    _createClass(Timeliner, [{
      key: '_emitChange',
      value: function _emitChange() {
        var _this4 = this;

        Object.keys(this.listeners).forEach(function (id) {
          return _this4.listeners[id](_this4.time);
        });
      }
    }, {
      key: '_tick',
      value: function _tick() {
        var playing = this.playing;
        var time = this.time;

        if (time >= this.max) {
          if (this.onComplete) this.onComplete(time);
          if (this.loop) {
            this.setTime(this.min);
          } else {
            this.playing = false;
          }
        } else {
          this.setTime(time + this.increment);
          this._emitChange();
        }

        if (playing) raf(this._tick);
      }
    }, {
      key: 'setTime',
      value: function setTime(time) {
        this.time = typeof time === 'function' ? time(this.time) : time;
        this.tween = function (keyframes, easer) {
          return (0, _tween.tween)(time, keyframes, easer);
        };
        if (!this.playing) this._emitChange();
      }
    }, {
      key: 'play',
      value: function play() {
        this.setPlay(true);
      }
    }, {
      key: 'pause',
      value: function pause() {
        this.setPlay(false);
      }
    }, {
      key: 'playFrom',
      value: function playFrom(time) {
        this.setTime(time);
        this.setPlay(true);
      }
    }, {
      key: 'setPlay',
      value: function setPlay(playing) {
        if (!this.playing && playing) raf(this._tick);
        this.playing = playing;
      }
    }, {
      key: 'togglePlay',
      value: function togglePlay(playing) {
        if (!this.playing) raf(this._tick);
        this.playing = !this.playing;
      }
    }, {
      key: 'addListener',
      value: function addListener(callback) {
        this.listeners[++this.lastListenerId] = callback;
        return this.lastListenerId;
      }
    }, {
      key: 'removeListener',
      value: function removeListener(id) {
        delete this.listeners[id];
      }
    }]);

    return Timeliner;
  })();

  return { Timeline: Timeline, Timeliner: Timeliner };
}

module.exports = exports['default'];