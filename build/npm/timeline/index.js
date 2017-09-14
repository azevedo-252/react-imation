'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _timeline = require('./timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var timeline = (0, _timeline2['default'])(_react2['default'], _raf2['default']);

exports['default'] = _extends({}, timeline);
module.exports = exports['default'];