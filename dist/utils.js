'use strict';

/**
 * Whether element contains classname
 * @param {HTMLElement} e
 * @param {string} name
 * @returns {boolean}
 */
function containsClassName(e, name) {
    if (e.className) {
        var list = e.className.split(' ');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var entry = _step.value;

                if (entry === name) {
                    return true;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return false;
}

/**
 * measure distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * find closest distance from UIEvent to a corner of an element
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} element
 */
function distanceToClosestCorner(x, y, element) {
    var pos = toGlobal(element);
    var topLeft = distance(x, y, pos.x, pos.y);
    var topRight = distance(x, y, pos.x + element.offsetWidth, pos.y);
    var bottomLeft = distance(x, y, pos.x, pos.y + element.offsetHeight);
    var bottomRight = distance(x, y, pos.x + element.offsetWidth, pos.y + element.offsetHeight);
    return Math.min(topLeft, topRight, bottomLeft, bottomRight);
}

/**
 * determine whether the mouse is inside an element
     * @param {HTMLElement} dragging
 * @param {HTMLElement} element
 */
function inside(x, y, element) {
    var pos = toGlobal(element);
    var x1 = pos.x;
    var y1 = pos.y;
    var w1 = element.offsetWidth;
    var h1 = element.offsetHeight;
    return x >= x1 && x <= x1 + w1 && y >= y1 && y <= y1 + h1;
}

/**
 * determines global location of a div
 * from https://stackoverflow.com/a/26230989/1955997
 * @param {HTMLElement} e
 * @returns {PointLike}
 */
function toGlobal(e) {
    var box = e.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { y: Math.round(top), x: Math.round(left) };
}

/**
 * @typedef {object} PointLike
 * @property {number} x
 * @property {number} y
 */

/**
 * combines options and default options
 * @param {object} options
 * @param {object} defaults
 * @returns {object} options+defaults
 */
function options(options, defaults) {
    options = options || {};
    for (var option in defaults) {
        options[option] = typeof options[option] !== 'undefined' ? options[option] : defaults[option];
    }
    return options;
}

/**
 * set a style on an element
 * @param {HTMLElement} element
 * @param {string} style
 * @param {(string|string[])} value - single value or list of possible values (test each one in order to see if it works)
 */
function style(element, style, value) {
    if (Array.isArray(value)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var entry = _step2.value;

                element.style[style] = entry;
                if (element.style[style] === entry) {
                    break;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    } else {
        element.style[style] = value;
    }
}

/**
 * calculate percentage of overlap between two boxes
 * from https://stackoverflow.com/a/21220004/1955997
 * @param {number} xa1
 * @param {number} ya1
 * @param {number} xa2
 * @param {number} xa2
 * @param {number} xb1
 * @param {number} yb1
 * @param {number} xb2
 * @param {number} yb2
 */
function percentage(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2) {
    var sa = (xa2 - xa1) * (ya2 - ya1);
    var sb = (xb2 - xb1) * (yb2 - yb1);
    var si = Math.max(0, Math.min(xa2, xb2) - Math.max(xa1, xb1)) * Math.max(0, Math.min(ya2, yb2) - Math.max(ya1, yb1));
    var union = sa + sb - si;
    if (union !== 0) {
        return si / union;
    } else {
        return 0;
    }
}

module.exports = {
    containsClassName: containsClassName,
    distance: distance,
    distanceToClosestCorner: distanceToClosestCorner,
    inside: inside,
    toGlobal: toGlobal,
    options: options,
    style: style,
    percentage: percentage
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJjb250YWluc0NsYXNzTmFtZSIsImUiLCJuYW1lIiwiY2xhc3NOYW1lIiwibGlzdCIsInNwbGl0IiwiZW50cnkiLCJkaXN0YW5jZSIsIngxIiwieTEiLCJ4MiIsInkyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJkaXN0YW5jZVRvQ2xvc2VzdENvcm5lciIsIngiLCJ5IiwiZWxlbWVudCIsInBvcyIsInRvR2xvYmFsIiwidG9wTGVmdCIsInRvcFJpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJib3R0b21MZWZ0Iiwib2Zmc2V0SGVpZ2h0IiwiYm90dG9tUmlnaHQiLCJtaW4iLCJpbnNpZGUiLCJ3MSIsImgxIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm9keSIsImRvY3VtZW50IiwiZG9jRWwiLCJkb2N1bWVudEVsZW1lbnQiLCJzY3JvbGxUb3AiLCJ3aW5kb3ciLCJwYWdlWU9mZnNldCIsInNjcm9sbExlZnQiLCJwYWdlWE9mZnNldCIsImNsaWVudFRvcCIsImNsaWVudExlZnQiLCJ0b3AiLCJsZWZ0Iiwicm91bmQiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJvcHRpb24iLCJzdHlsZSIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwicGVyY2VudGFnZSIsInhhMSIsInlhMSIsInhhMiIsInlhMiIsInhiMSIsInliMSIsInhiMiIsInliMiIsInNhIiwic2IiLCJzaSIsIm1heCIsInVuaW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0FBTUEsU0FBU0EsaUJBQVQsQ0FBMkJDLENBQTNCLEVBQThCQyxJQUE5QixFQUNBO0FBQ0ksUUFBSUQsRUFBRUUsU0FBTixFQUNBO0FBQ0ksWUFBTUMsT0FBT0gsRUFBRUUsU0FBRixDQUFZRSxLQUFaLENBQWtCLEdBQWxCLENBQWI7QUFESjtBQUFBO0FBQUE7O0FBQUE7QUFFSSxpQ0FBa0JELElBQWxCLDhIQUNBO0FBQUEsb0JBRFNFLEtBQ1Q7O0FBQ0ksb0JBQUlBLFVBQVVKLElBQWQsRUFDQTtBQUNJLDJCQUFPLElBQVA7QUFDSDtBQUNKO0FBUkw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNDO0FBQ0QsV0FBTyxLQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQSxTQUFTSyxRQUFULENBQWtCQyxFQUFsQixFQUFzQkMsRUFBdEIsRUFBMEJDLEVBQTFCLEVBQThCQyxFQUE5QixFQUNBO0FBQ0ksV0FBT0MsS0FBS0MsSUFBTCxDQUFVRCxLQUFLRSxHQUFMLENBQVNOLEtBQUtFLEVBQWQsRUFBa0IsQ0FBbEIsSUFBdUJFLEtBQUtFLEdBQUwsQ0FBU0wsS0FBS0UsRUFBZCxFQUFrQixDQUFsQixDQUFqQyxDQUFQO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BLFNBQVNJLHVCQUFULENBQWlDQyxDQUFqQyxFQUFvQ0MsQ0FBcEMsRUFBdUNDLE9BQXZDLEVBQ0E7QUFDSSxRQUFNQyxNQUFNQyxTQUFTRixPQUFULENBQVo7QUFDQSxRQUFNRyxVQUFVZCxTQUFTUyxDQUFULEVBQVlDLENBQVosRUFBZUUsSUFBSUgsQ0FBbkIsRUFBc0JHLElBQUlGLENBQTFCLENBQWhCO0FBQ0EsUUFBTUssV0FBV2YsU0FBU1MsQ0FBVCxFQUFZQyxDQUFaLEVBQWVFLElBQUlILENBQUosR0FBUUUsUUFBUUssV0FBL0IsRUFBNENKLElBQUlGLENBQWhELENBQWpCO0FBQ0EsUUFBTU8sYUFBYWpCLFNBQVNTLENBQVQsRUFBWUMsQ0FBWixFQUFlRSxJQUFJSCxDQUFuQixFQUFzQkcsSUFBSUYsQ0FBSixHQUFRQyxRQUFRTyxZQUF0QyxDQUFuQjtBQUNBLFFBQU1DLGNBQWNuQixTQUFTUyxDQUFULEVBQVlDLENBQVosRUFBZUUsSUFBSUgsQ0FBSixHQUFRRSxRQUFRSyxXQUEvQixFQUE0Q0osSUFBSUYsQ0FBSixHQUFRQyxRQUFRTyxZQUE1RCxDQUFwQjtBQUNBLFdBQU9iLEtBQUtlLEdBQUwsQ0FBU04sT0FBVCxFQUFrQkMsUUFBbEIsRUFBNEJFLFVBQTVCLEVBQXdDRSxXQUF4QyxDQUFQO0FBQ0g7O0FBR0Q7Ozs7O0FBS0EsU0FBU0UsTUFBVCxDQUFnQlosQ0FBaEIsRUFBbUJDLENBQW5CLEVBQXNCQyxPQUF0QixFQUNBO0FBQ0ksUUFBTUMsTUFBTUMsU0FBU0YsT0FBVCxDQUFaO0FBQ0EsUUFBTVYsS0FBS1csSUFBSUgsQ0FBZjtBQUNBLFFBQU1QLEtBQUtVLElBQUlGLENBQWY7QUFDQSxRQUFNWSxLQUFLWCxRQUFRSyxXQUFuQjtBQUNBLFFBQU1PLEtBQUtaLFFBQVFPLFlBQW5CO0FBQ0EsV0FBT1QsS0FBS1IsRUFBTCxJQUFXUSxLQUFLUixLQUFLcUIsRUFBckIsSUFBMkJaLEtBQUtSLEVBQWhDLElBQXNDUSxLQUFLUixLQUFLcUIsRUFBdkQ7QUFBMEQ7O0FBRTlEOzs7Ozs7QUFNQSxTQUFTVixRQUFULENBQWtCbkIsQ0FBbEIsRUFDQTtBQUNJLFFBQU04QixNQUFNOUIsRUFBRStCLHFCQUFGLEVBQVo7O0FBRUEsUUFBTUMsT0FBT0MsU0FBU0QsSUFBdEI7QUFDQSxRQUFNRSxRQUFRRCxTQUFTRSxlQUF2Qjs7QUFFQSxRQUFNQyxZQUFZQyxPQUFPQyxXQUFQLElBQXNCSixNQUFNRSxTQUE1QixJQUF5Q0osS0FBS0ksU0FBaEU7QUFDQSxRQUFNRyxhQUFhRixPQUFPRyxXQUFQLElBQXNCTixNQUFNSyxVQUE1QixJQUEwQ1AsS0FBS08sVUFBbEU7O0FBRUEsUUFBTUUsWUFBWVAsTUFBTU8sU0FBTixJQUFtQlQsS0FBS1MsU0FBeEIsSUFBcUMsQ0FBdkQ7QUFDQSxRQUFNQyxhQUFhUixNQUFNUSxVQUFOLElBQW9CVixLQUFLVSxVQUF6QixJQUF1QyxDQUExRDs7QUFFQSxRQUFNQyxNQUFNYixJQUFJYSxHQUFKLEdBQVVQLFNBQVYsR0FBc0JLLFNBQWxDO0FBQ0EsUUFBTUcsT0FBT2QsSUFBSWMsSUFBSixHQUFXTCxVQUFYLEdBQXdCRyxVQUFyQzs7QUFFQSxXQUFPLEVBQUUxQixHQUFHTCxLQUFLa0MsS0FBTCxDQUFXRixHQUFYLENBQUwsRUFBc0I1QixHQUFHSixLQUFLa0MsS0FBTCxDQUFXRCxJQUFYLENBQXpCLEVBQVA7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7Ozs7OztBQU1BLFNBQVNFLE9BQVQsQ0FBaUJBLE9BQWpCLEVBQTBCQyxRQUExQixFQUNBO0FBQ0lELGNBQVVBLFdBQVcsRUFBckI7QUFDQSxTQUFLLElBQUlFLE1BQVQsSUFBbUJELFFBQW5CLEVBQ0E7QUFDSUQsZ0JBQVFFLE1BQVIsSUFBa0IsT0FBT0YsUUFBUUUsTUFBUixDQUFQLEtBQTJCLFdBQTNCLEdBQXlDRixRQUFRRSxNQUFSLENBQXpDLEdBQTJERCxTQUFTQyxNQUFULENBQTdFO0FBQ0g7QUFDRCxXQUFPRixPQUFQO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BLFNBQVNHLEtBQVQsQ0FBZWhDLE9BQWYsRUFBd0JnQyxLQUF4QixFQUErQkMsS0FBL0IsRUFDQTtBQUNJLFFBQUlDLE1BQU1DLE9BQU4sQ0FBY0YsS0FBZCxDQUFKLEVBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDSSxrQ0FBa0JBLEtBQWxCLG1JQUNBO0FBQUEsb0JBRFM3QyxLQUNUOztBQUNJWSx3QkFBUWdDLEtBQVIsQ0FBY0EsS0FBZCxJQUF1QjVDLEtBQXZCO0FBQ0Esb0JBQUlZLFFBQVFnQyxLQUFSLENBQWNBLEtBQWQsTUFBeUI1QyxLQUE3QixFQUNBO0FBQ0k7QUFDSDtBQUNKO0FBUkw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNDLEtBVkQsTUFZQTtBQUNJWSxnQkFBUWdDLEtBQVIsQ0FBY0EsS0FBZCxJQUF1QkMsS0FBdkI7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7Ozs7QUFZQSxTQUFTRyxVQUFULENBQW9CQyxHQUFwQixFQUF5QkMsR0FBekIsRUFBOEJDLEdBQTlCLEVBQW1DQyxHQUFuQyxFQUF3Q0MsR0FBeEMsRUFBNkNDLEdBQTdDLEVBQWtEQyxHQUFsRCxFQUF1REMsR0FBdkQsRUFDQTtBQUNJLFFBQU1DLEtBQUssQ0FBQ04sTUFBTUYsR0FBUCxLQUFlRyxNQUFNRixHQUFyQixDQUFYO0FBQ0EsUUFBTVEsS0FBSyxDQUFDSCxNQUFNRixHQUFQLEtBQWVHLE1BQU1GLEdBQXJCLENBQVg7QUFDQSxRQUFNSyxLQUFLckQsS0FBS3NELEdBQUwsQ0FBUyxDQUFULEVBQVl0RCxLQUFLZSxHQUFMLENBQVM4QixHQUFULEVBQWNJLEdBQWQsSUFBcUJqRCxLQUFLc0QsR0FBTCxDQUFTWCxHQUFULEVBQWNJLEdBQWQsQ0FBakMsSUFBdUQvQyxLQUFLc0QsR0FBTCxDQUFTLENBQVQsRUFBWXRELEtBQUtlLEdBQUwsQ0FBUytCLEdBQVQsRUFBY0ksR0FBZCxJQUFxQmxELEtBQUtzRCxHQUFMLENBQVNWLEdBQVQsRUFBY0ksR0FBZCxDQUFqQyxDQUFsRTtBQUNBLFFBQU1PLFFBQVFKLEtBQUtDLEVBQUwsR0FBVUMsRUFBeEI7QUFDQSxRQUFJRSxVQUFVLENBQWQsRUFDQTtBQUNJLGVBQU9GLEtBQUtFLEtBQVo7QUFDSCxLQUhELE1BS0E7QUFDSSxlQUFPLENBQVA7QUFDSDtBQUNKOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2JyRSx3Q0FEYTtBQUViTyxzQkFGYTtBQUdiUSxvREFIYTtBQUliYSxrQkFKYTtBQUtiUixzQkFMYTtBQU1iMkIsb0JBTmE7QUFPYkcsZ0JBUGE7QUFRYkk7QUFSYSxDQUFqQiIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBXaGV0aGVyIGVsZW1lbnQgY29udGFpbnMgY2xhc3NuYW1lXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBjb250YWluc0NsYXNzTmFtZShlLCBuYW1lKVxyXG57XHJcbiAgICBpZiAoZS5jbGFzc05hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IGUuY2xhc3NOYW1lLnNwbGl0KCcgJylcclxuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBsaXN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGVudHJ5ID09PSBuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBtZWFzdXJlIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xyXG4gKiBAcGFyYW0ge251bWJlcn0geDFcclxuICogQHBhcmFtIHtudW1iZXJ9IHkxXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTJcclxuICovXHJcbmZ1bmN0aW9uIGRpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKVxyXG57XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHgxIC0geDIsIDIpICsgTWF0aC5wb3coeTEgLSB5MiwgMikpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBmaW5kIGNsb3Nlc3QgZGlzdGFuY2UgZnJvbSBVSUV2ZW50IHRvIGEgY29ybmVyIG9mIGFuIGVsZW1lbnRcclxuICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gZGlzdGFuY2VUb0Nsb3Nlc3RDb3JuZXIoeCwgeSwgZWxlbWVudClcclxue1xyXG4gICAgY29uc3QgcG9zID0gdG9HbG9iYWwoZWxlbWVudClcclxuICAgIGNvbnN0IHRvcExlZnQgPSBkaXN0YW5jZSh4LCB5LCBwb3MueCwgcG9zLnkpXHJcbiAgICBjb25zdCB0b3BSaWdodCA9IGRpc3RhbmNlKHgsIHksIHBvcy54ICsgZWxlbWVudC5vZmZzZXRXaWR0aCwgcG9zLnkpXHJcbiAgICBjb25zdCBib3R0b21MZWZ0ID0gZGlzdGFuY2UoeCwgeSwgcG9zLngsIHBvcy55ICsgZWxlbWVudC5vZmZzZXRIZWlnaHQpXHJcbiAgICBjb25zdCBib3R0b21SaWdodCA9IGRpc3RhbmNlKHgsIHksIHBvcy54ICsgZWxlbWVudC5vZmZzZXRXaWR0aCwgcG9zLnkgKyBlbGVtZW50Lm9mZnNldEhlaWdodClcclxuICAgIHJldHVybiBNYXRoLm1pbih0b3BMZWZ0LCB0b3BSaWdodCwgYm90dG9tTGVmdCwgYm90dG9tUmlnaHQpXHJcbn1cclxuXHJcblxyXG4vKipcclxuICogZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIG1vdXNlIGlzIGluc2lkZSBhbiBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkcmFnZ2luZ1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnNpZGUoeCwgeSwgZWxlbWVudClcclxue1xyXG4gICAgY29uc3QgcG9zID0gdG9HbG9iYWwoZWxlbWVudClcclxuICAgIGNvbnN0IHgxID0gcG9zLnhcclxuICAgIGNvbnN0IHkxID0gcG9zLnlcclxuICAgIGNvbnN0IHcxID0gZWxlbWVudC5vZmZzZXRXaWR0aFxyXG4gICAgY29uc3QgaDEgPSBlbGVtZW50Lm9mZnNldEhlaWdodFxyXG4gICAgcmV0dXJuIHggPj0geDEgJiYgeCA8PSB4MSArIHcxICYmIHkgPj0geTEgJiYgeSA8PSB5MSArIGgxfVxyXG5cclxuLyoqXHJcbiAqIGRldGVybWluZXMgZ2xvYmFsIGxvY2F0aW9uIG9mIGEgZGl2XHJcbiAqIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2MjMwOTg5LzE5NTU5OTdcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZVxyXG4gKiBAcmV0dXJucyB7UG9pbnRMaWtlfVxyXG4gKi9cclxuZnVuY3Rpb24gdG9HbG9iYWwoZSlcclxue1xyXG4gICAgY29uc3QgYm94ID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5XHJcbiAgICBjb25zdCBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxyXG5cclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2NFbC5zY3JvbGxUb3AgfHwgYm9keS5zY3JvbGxUb3BcclxuICAgIGNvbnN0IHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsTGVmdCB8fCBib2R5LnNjcm9sbExlZnRcclxuXHJcbiAgICBjb25zdCBjbGllbnRUb3AgPSBkb2NFbC5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMFxyXG4gICAgY29uc3QgY2xpZW50TGVmdCA9IGRvY0VsLmNsaWVudExlZnQgfHwgYm9keS5jbGllbnRMZWZ0IHx8IDBcclxuXHJcbiAgICBjb25zdCB0b3AgPSBib3gudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wXHJcbiAgICBjb25zdCBsZWZ0ID0gYm94LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdFxyXG5cclxuICAgIHJldHVybiB7IHk6IE1hdGgucm91bmQodG9wKSwgeDogTWF0aC5yb3VuZChsZWZ0KSB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQb2ludExpa2VcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHhcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHlcclxuICovXHJcblxyXG4vKipcclxuICogY29tYmluZXMgb3B0aW9ucyBhbmQgZGVmYXVsdCBvcHRpb25zXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkZWZhdWx0c1xyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBvcHRpb25zK2RlZmF1bHRzXHJcbiAqL1xyXG5mdW5jdGlvbiBvcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzKVxyXG57XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxyXG4gICAgZm9yIChsZXQgb3B0aW9uIGluIGRlZmF1bHRzKVxyXG4gICAge1xyXG4gICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IHR5cGVvZiBvcHRpb25zW29wdGlvbl0gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1tvcHRpb25dIDogZGVmYXVsdHNbb3B0aW9uXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wdGlvbnNcclxufVxyXG5cclxuLyoqXHJcbiAqIHNldCBhIHN0eWxlIG9uIGFuIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGVcclxuICogQHBhcmFtIHsoc3RyaW5nfHN0cmluZ1tdKX0gdmFsdWUgLSBzaW5nbGUgdmFsdWUgb3IgbGlzdCBvZiBwb3NzaWJsZSB2YWx1ZXMgKHRlc3QgZWFjaCBvbmUgaW4gb3JkZXIgdG8gc2VlIGlmIGl0IHdvcmtzKVxyXG4gKi9cclxuZnVuY3Rpb24gc3R5bGUoZWxlbWVudCwgc3R5bGUsIHZhbHVlKVxyXG57XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3N0eWxlXSA9IGVudHJ5XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnN0eWxlW3N0eWxlXSA9PT0gZW50cnkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZVtzdHlsZV0gPSB2YWx1ZVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogY2FsY3VsYXRlIHBlcmNlbnRhZ2Ugb2Ygb3ZlcmxhcCBiZXR3ZWVuIHR3byBib3hlc1xyXG4gKiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTIyMDAwNC8xOTU1OTk3XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4YTFcclxuICogQHBhcmFtIHtudW1iZXJ9IHlhMVxyXG4gKiBAcGFyYW0ge251bWJlcn0geGEyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4YTJcclxuICogQHBhcmFtIHtudW1iZXJ9IHhiMVxyXG4gKiBAcGFyYW0ge251bWJlcn0geWIxXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4YjJcclxuICogQHBhcmFtIHtudW1iZXJ9IHliMlxyXG4gKi9cclxuZnVuY3Rpb24gcGVyY2VudGFnZSh4YTEsIHlhMSwgeGEyLCB5YTIsIHhiMSwgeWIxLCB4YjIsIHliMilcclxue1xyXG4gICAgY29uc3Qgc2EgPSAoeGEyIC0geGExKSAqICh5YTIgLSB5YTEpXHJcbiAgICBjb25zdCBzYiA9ICh4YjIgLSB4YjEpICogKHliMiAtIHliMSlcclxuICAgIGNvbnN0IHNpID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeGEyLCB4YjIpIC0gTWF0aC5tYXgoeGExLCB4YjEpKSAqIE1hdGgubWF4KDAsIE1hdGgubWluKHlhMiwgeWIyKSAtIE1hdGgubWF4KHlhMSwgeWIxKSlcclxuICAgIGNvbnN0IHVuaW9uID0gc2EgKyBzYiAtIHNpXHJcbiAgICBpZiAodW5pb24gIT09IDApXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHNpIC8gdW5pb25cclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gMFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGNvbnRhaW5zQ2xhc3NOYW1lLFxyXG4gICAgZGlzdGFuY2UsXHJcbiAgICBkaXN0YW5jZVRvQ2xvc2VzdENvcm5lcixcclxuICAgIGluc2lkZSxcclxuICAgIHRvR2xvYmFsLFxyXG4gICAgb3B0aW9ucyxcclxuICAgIHN0eWxlLFxyXG4gICAgcGVyY2VudGFnZVxyXG59Il19