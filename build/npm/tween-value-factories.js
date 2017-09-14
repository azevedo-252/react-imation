'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _tween = require('./tween');

var rgb = (0, _tween.createTweenValueFactory)(function (value) {
  return 'rgb(' + value.join(',') + ')';
});
exports.rgb = rgb;
var rgba = (0, _tween.createTweenValueFactory)(function (value) {
  return 'rgba(' + value.join(',') + ')';
});
exports.rgba = rgba;
var scale = (0, _tween.createTweenValueFactory)(function (value) {
  return 'scale(' + value.join(',') + ')';
});
exports.scale = scale;
var deg = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'deg';
});
exports.deg = deg;
var grad = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'grad';
});
exports.grad = grad;
var rad = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'rad';
});
exports.rad = rad;
var turn = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'turn';
});
exports.turn = turn;
var rotate = (0, _tween.createTweenValueFactory)(function (value) {
  return 'rotate(' + value + ')';
}, deg);
exports.rotate = rotate;
var rotateX = (0, _tween.createTweenValueFactory)(function (value) {
  return 'rotateX(' + value + ')';
}, deg);
exports.rotateX = rotateX;
var rotateY = (0, _tween.createTweenValueFactory)(function (value) {
  return 'rotateY(' + value + ')';
}, deg);
exports.rotateY = rotateY;
var rotateZ = (0, _tween.createTweenValueFactory)(function (value) {
  return 'rotateZ(' + value + ')';
}, deg);
exports.rotateZ = rotateZ;
var skewX = (0, _tween.createTweenValueFactory)(function (value) {
  return 'skewX(' + value + ')';
}, deg);
exports.skewX = skewX;
var skewY = (0, _tween.createTweenValueFactory)(function (value) {
  return 'skewY(' + value + ')';
}, deg);
exports.skewY = skewY;
var px = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'px';
});
exports.px = px;
var em = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'em';
});
exports.em = em;
var vw = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'vw';
});
exports.vw = vw;
var vh = (0, _tween.createTweenValueFactory)(function (value) {
  return value + 'vh';
});
exports.vh = vh;
var percent = (0, _tween.createTweenValueFactory)(function (value) {
  return value + '%';
});
exports.percent = percent;
var translateX = (0, _tween.createTweenValueFactory)(function (value) {
  return 'translateX(' + value + ')';
}, px);
exports.translateX = translateX;
var translateY = (0, _tween.createTweenValueFactory)(function (value) {
  return 'translateY(' + value + ')';
}, px);
exports.translateY = translateY;
var translate = (0, _tween.createTweenValueFactory)(function (value) {
  return 'translate(' + value.join(',') + ')';
}, px);
exports.translate = translate;
var translate3d = (0, _tween.createTweenValueFactory)(function (value) {
  return 'translate3d(' + value.join(',') + ')';
}, px);
exports.translate3d = translate3d;