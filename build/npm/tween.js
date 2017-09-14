/*
* The following concepts are essential to this code:
*
* A VALUE FACTORY is a function which
*   - accepts any number of arguments representing the desired value and
*   - returns a WRAPPED VALUE object
*
* A WRAPPED VALUE is an object with a `tween` method and a `resolveValue` method.
*   - `resolveValue` returns the formatted string representation of the value.
*   - `tween` returns the formatted string representation of the result of tweening
*     two different WRAPPED VALUEs created with the same VALUE FACTORY.
*
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.tweenValues = tweenValues;
exports.tween = tween;
exports.createTweenValueFactory = createTweenValueFactory;
exports.combine = combine;
exports.ease = ease;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var isNumber = function isNumber(x) {
  return typeof x === 'number';
};
exports.isNumber = isNumber;
var isWrapped = function isWrapped(x) {
  return !!x.tween;
};
exports.isWrapped = isWrapped;
var isNotWrapped = function isNotWrapped(x) {
  return !x.tween;
};
exports.isNotWrapped = isNotWrapped;
var identity = function identity(x) {
  return x;
};

exports.identity = identity;
function mapObject(fn) {
  var _this = this;

  var result = {};
  Object.keys(this).forEach(function (key) {
    return result[key] = fn(_this[key], key);
  });
  return result;
}

function tweenValues(progress, a, b, easer) {
  // for added flexibility with easing, we don't enforce
  // that b is wrapped
  if (a.tween) return a.tween(progress, a, b, easer);

  // now we enforce that a and b are the same type
  if (process.env.NODE_ENV !== 'production') {
    if (typeof b !== typeof a) throw Error('Tried to tween mismatched types ' + typeof a + ' !== ' + typeof b);
  }

  if (Array.isArray(a)) return a.map(function (value, index) {
    return tweenValues(progress, value, b[index], easer);
  });

  if (typeof a === 'number') return a + easer(progress) * (b - a);

  // object
  return mapObject.call(a, function (v, k) {
    return k !== 'ease' && tweenValues(progress, v, b[k], easer);
  });
}

var _resolveValue = function _resolveValue(x) {
  return x.resolveValue ? x.resolveValue() : // is wrapped value
  typeof x === 'number' ? x : // is number
  mapObject.call(x, _resolveValue);
};exports.resolveValue = _resolveValue;
// is object

/**
 * ## tween
 *
 * `position` is a number representing the current timeline position
 *
 * `keyframes` is an array
 *   - Each item in the array should be a touple (a 2-item array) where the first
 *     value of the touples represent positions on the timeline. Note that your
 *     keyframes must *already* be sorted, `tween` will **not** sort them for you.
 *   - The second value of the touples represent values at the given time.
 *     the values are either numbers, objects, or wrapped values (wrapped values may also be nested)
 *       * when the values are numbers `tween` returns a (tweened) Number
 *       * when the values are objects `tween` returns an object.
 *       * when the values are wrapped values `tween` returns the resolved result of the wrapped
 *         value (usually a string)
 *   - may optionally provide an `ease` property specifying an easing function
 *  Note that all Keyframe values should be exactly the same type or shape.
 *   (a value factory may make exceptions to this rule.
 *    when doing `ease(easer, a)`, `b` does not have to be wrapped in `ease()`)
 *
 * `ease` is an (optional) easing function which should accept a number 0..1
 * and return a number usually 0..1 but for certain types of easing
 * you might want to go outside of the 0..1 range.
 *
 * - Adding an `ease` property to a keyframe will override the `ease`
 *   argument of the `tween()` function.
 *
 * - Wrapping a value with the `ease()` value factory will override
 *   any keyframe or `tween()`-level easing.
 */

function tween(position, keyframes) {
  var easer = arguments.length <= 2 || arguments[2] === undefined ? identity : arguments[2];

  // TODO: remove for v1.0
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(keyframes)) {
      throw Error('tween: as of react-imation@0.5.0, keyframes must be an array');
    }
  }

  var positions = keyframes.map(function (k) {
    return k[0];
  });

  var n = positions.length - 1;
  var position0 = positions[0];
  var positionN = positions[n];

  if (position <= position0) return _resolveValue(keyframes[0][1]);
  if (position >= positionN) return _resolveValue(keyframes[n][1]);

  var indexB = 0;
  while (position > positions[++indexB]);
  var indexA = indexB - 1;

  var positionA = positions[indexA];
  var positionB = positions[indexB];

  if (process.env.NODE_ENV !== 'production') {
    if (typeof positionA === 'function' || typeof positionB === 'function') {
      throw Error('Keyframes are not allowed to contain functions as keys', keyframes);
    }
  }

  var range = positionB - positionA;
  var delta = position - positionA;
  var progress = delta / range;

  return tweenValues(progress, keyframes[indexA][1], keyframes[indexB][1], keyframes[indexA][1].ease || easer);
}

/**
 * ## createTweenValueFactory
 *
 * The first argument, `formatter` should be a 1-arity function
 * which accepts an array (`value`) and returns the formatted result.
 * For example, `formatter` might transform the array `[100,0,255]` to "rgb(100,0,255)"
 *
 * The second (optional) argument, `defaultWrapper` will
 * be used to map the elements of the `value` array which is useful
 * for wrapping the values in a default unit (like px, %, deg, etc)
 *
 * return a value factory.
 */

function createTweenValueFactory(formatter, defaultWrapper) {
  var tween = function tween(progress, a, b, easer) {
    return formatter(tweenValues(progress, a.value, b.value, easer));
  };

  var wrap = function wrap(v) {
    return isWrapped(v) ? v : defaultWrapper(v);
  };

  return defaultWrapper ? function () {
    for (var _len = arguments.length, value = Array(_len), _key = 0; _key < _len; _key++) {
      value[_key] = arguments[_key];
    }

    return new TweenValue(value.map(wrap), formatter, tween);
  } : function () {
    for (var _len2 = arguments.length, value = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      value[_key2] = arguments[_key2];
    }

    return new TweenValue(value, formatter, tween);
  };
}

var TweenValue = (function () {
  function TweenValue(value, formatter, tween) {
    _classCallCheck(this, TweenValue);

    this.value = value;
    this.formatter = formatter;
    this.tween = tween;
  }

  /**
   * combine is a value factory that combines wrapped values (or numbers)
   * by seperating them with a space
   *
   * for example:
   *
   *        combine(scale(0.9), translate3d(0,-160,0))
   *
   * note that `scale(0.9)` and `translate3d(0,-160,0)`
   * both return wrapped values. So in the non-tweened case,
   * combine produces:
   *
   *        "scale(0.9) translate3d(0,-160,0)"
   */

  _createClass(TweenValue, [{
    key: 'resolveValue',
    value: function resolveValue() {
      return this.formatter(this.value.map(_resolveValue));
    }
  }]);

  return TweenValue;
})();

function combine() {
  for (var _len3 = arguments.length, wrappedValues = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    wrappedValues[_key3] = arguments[_key3];
  }

  return new Combine(wrappedValues);
}

var Combine = (function () {
  function Combine(wrappedValues) {
    _classCallCheck(this, Combine);

    this.wrappedValues = wrappedValues;
  }

  /**
   * ease is a value factory that will apply
   *      an easing function to any wrapped value or number.
   *      Easing is applied between values a and b, but the
   *      ease factory must wrap value a.
   *
   * Note:
   * Wrapping a value with the `ease()` value factory will override
   * tween and keyframe-level easing
   **/

  _createClass(Combine, [{
    key: 'tween',
    value: function tween(progress, _ref, _ref2, easer) {
      var wrappedValuesA = _ref.wrappedValues;
      var wrappedValuesB = _ref2.wrappedValues;

      return wrappedValuesA.map(function (wrappedValueA, index) {
        return tweenValues(progress, wrappedValueA, wrappedValuesB[index], easer);
      }).join(' ');
    }
  }, {
    key: 'resolveValue',
    value: function resolveValue() {
      return this.wrappedValues.map(_resolveValue).join(' ');
    }
  }]);

  return Combine;
})();

function ease(easer, wrappedValue) {
  if (typeof wrappedValue === 'undefined') {
    // curry
    return function (wrappedValue) {
      return ease(easer, wrappedValue);
    };
  }

  return new Ease(easer, wrappedValue);
}

var Ease = (function () {
  function Ease(easer, wrappedValue) {
    _classCallCheck(this, Ease);

    this.easer = easer;
    this.easedValue = wrappedValue;
  }

  _createClass(Ease, [{
    key: 'tween',
    value: function tween(progress, wrappedValueA, wrappedValueB) {
      return tweenValues(progress, wrappedValueA.easedValue,
      // give flexibility not to wrap b value in the ease factory
      wrappedValueB.easedValue ? wrappedValueB.easedValue : wrappedValueB, this.easer || identity);
    }
  }, {
    key: 'resolveValue',
    value: function resolveValue() {
      return _resolveValue(this.easedValue);
    }
  }]);

  return Ease;
})();