'use strict';

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
 * find shortest distance from point to HTMLElement's bounding box
 * from: https://gamedev.stackexchange.com/questions/44483/how-do-i-calculate-distance-between-a-point-and-an-axis-aligned-rectangle
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} element
 */
function distancePointElement(px, py, element) {
    var pos = toGlobal(element);
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    var x = pos.x + width / 2;
    var y = pos.y + height / 2;
    var dx = Math.max(Math.abs(px - x) - width / 2, 0);
    var dy = Math.max(Math.abs(py - y) - height / 2, 0);
    return dx * dx + dy * dy;
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
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var entry = _step.value;

                element.style[style] = entry;
                if (element.style[style] === entry) {
                    break;
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

function removeChildren(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

function html(options) {
    options = options || {};
    var object = document.createElement(options.type || 'div');
    if (options.parent) {
        options.parent.appendChild(object);
    }
    if (options.defaultStyles) {
        styles(object, options.defaultStyles);
    }
    if (options.styles) {
        styles(object, options.styles);
    }
    if (options.html) {
        object.innerHTML = options.html;
    }
    if (options.id) {
        object.id = options.id;
    }
    return object;
}

function styles(object, styles) {
    for (var _style in styles) {
        if (Array.isArray(styles[_style])) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = styles[_style][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var entry = _step2.value;

                    object.style[_style] = entry;
                    if (object.style[_style] === entry) {
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
            object.style[_style] = styles[_style];
        }
    }
}

function getChildIndex(parent, child) {
    var index = 0;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = parent.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var entry = _step3.value;

            if (entry === child) {
                return index;
            }
            index++;
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return -1;
}

module.exports = {
    removeChildren: removeChildren,
    distance: distance,
    distancePointElement: distancePointElement,
    inside: inside,
    toGlobal: toGlobal,
    options: options,
    style: style,
    percentage: percentage,
    html: html,
    styles: styles,
    getChildIndex: getChildIndex
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJkaXN0YW5jZSIsIngxIiwieTEiLCJ4MiIsInkyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJkaXN0YW5jZVBvaW50RWxlbWVudCIsInB4IiwicHkiLCJlbGVtZW50IiwicG9zIiwidG9HbG9iYWwiLCJ3aWR0aCIsIm9mZnNldFdpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwieCIsInkiLCJkeCIsIm1heCIsImFicyIsImR5IiwiaW5zaWRlIiwidzEiLCJoMSIsImUiLCJib3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib2R5IiwiZG9jdW1lbnQiLCJkb2NFbCIsImRvY3VtZW50RWxlbWVudCIsInNjcm9sbFRvcCIsIndpbmRvdyIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsTGVmdCIsInBhZ2VYT2Zmc2V0IiwiY2xpZW50VG9wIiwiY2xpZW50TGVmdCIsInRvcCIsImxlZnQiLCJyb3VuZCIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsIm9wdGlvbiIsInN0eWxlIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJlbnRyeSIsInBlcmNlbnRhZ2UiLCJ4YTEiLCJ5YTEiLCJ4YTIiLCJ5YTIiLCJ4YjEiLCJ5YjEiLCJ4YjIiLCJ5YjIiLCJzYSIsInNiIiwic2kiLCJtaW4iLCJ1bmlvbiIsInJlbW92ZUNoaWxkcmVuIiwiZmlyc3RDaGlsZCIsInJlbW92ZSIsImh0bWwiLCJvYmplY3QiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsInBhcmVudCIsImFwcGVuZENoaWxkIiwiZGVmYXVsdFN0eWxlcyIsInN0eWxlcyIsImlubmVySFRNTCIsImlkIiwiZ2V0Q2hpbGRJbmRleCIsImNoaWxkIiwiaW5kZXgiLCJjaGlsZHJlbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFPQSxTQUFTQSxRQUFULENBQWtCQyxFQUFsQixFQUFzQkMsRUFBdEIsRUFBMEJDLEVBQTFCLEVBQThCQyxF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OlsiLyoqXHJcbiAqIG1lYXN1cmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MVxyXG4gKiBAcGFyYW0ge251bWJlcn0geTFcclxuICogQHBhcmFtIHtudW1iZXJ9IHgyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MlxyXG4gKi9cclxuZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpXHJcbntcclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDEgLSB4MiwgMikgKyBNYXRoLnBvdyh5MSAtIHkyLCAyKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIGZpbmQgc2hvcnRlc3QgZGlzdGFuY2UgZnJvbSBwb2ludCB0byBIVE1MRWxlbWVudCdzIGJvdW5kaW5nIGJveFxyXG4gKiBmcm9tOiBodHRwczovL2dhbWVkZXYuc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzQ0NDgzL2hvdy1kby1pLWNhbGN1bGF0ZS1kaXN0YW5jZS1iZXR3ZWVuLWEtcG9pbnQtYW5kLWFuLWF4aXMtYWxpZ25lZC1yZWN0YW5nbGVcclxuICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gZGlzdGFuY2VQb2ludEVsZW1lbnQocHgsIHB5LCBlbGVtZW50KVxyXG57XHJcbiAgICBjb25zdCBwb3MgPSB0b0dsb2JhbChlbGVtZW50KVxyXG4gICAgY29uc3Qgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoXHJcbiAgICBjb25zdCBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodFxyXG4gICAgY29uc3QgeCA9IHBvcy54ICsgd2lkdGggLyAyXHJcbiAgICBjb25zdCB5ID0gcG9zLnkgKyBoZWlnaHQgLyAyXHJcbiAgICBjb25zdCBkeCA9IE1hdGgubWF4KE1hdGguYWJzKHB4IC0geCkgLSB3aWR0aCAvIDIsIDApXHJcbiAgICBjb25zdCBkeSA9IE1hdGgubWF4KE1hdGguYWJzKHB5IC0geSkgLSBoZWlnaHQgLyAyLCAwKVxyXG4gICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBkZXRlcm1pbmUgd2hldGhlciB0aGUgbW91c2UgaXMgaW5zaWRlIGFuIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZHJhZ2dpbmdcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gaW5zaWRlKHgsIHksIGVsZW1lbnQpXHJcbntcclxuICAgIGNvbnN0IHBvcyA9IHRvR2xvYmFsKGVsZW1lbnQpXHJcbiAgICBjb25zdCB4MSA9IHBvcy54XHJcbiAgICBjb25zdCB5MSA9IHBvcy55XHJcbiAgICBjb25zdCB3MSA9IGVsZW1lbnQub2Zmc2V0V2lkdGhcclxuICAgIGNvbnN0IGgxID0gZWxlbWVudC5vZmZzZXRIZWlnaHRcclxuICAgIHJldHVybiB4ID49IHgxICYmIHggPD0geDEgKyB3MSAmJiB5ID49IHkxICYmIHkgPD0geTEgKyBoMVxyXG59XHJcblxyXG4vKipcclxuICogZGV0ZXJtaW5lcyBnbG9iYWwgbG9jYXRpb24gb2YgYSBkaXZcclxuICogZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjYyMzA5ODkvMTk1NTk5N1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlXHJcbiAqIEByZXR1cm5zIHtQb2ludExpa2V9XHJcbiAqL1xyXG5mdW5jdGlvbiB0b0dsb2JhbChlKVxyXG57XHJcbiAgICBjb25zdCBib3ggPSBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHlcclxuICAgIGNvbnN0IGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XHJcblxyXG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbFRvcCB8fCBib2R5LnNjcm9sbFRvcFxyXG4gICAgY29uc3Qgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2NFbC5zY3JvbGxMZWZ0IHx8IGJvZHkuc2Nyb2xsTGVmdFxyXG5cclxuICAgIGNvbnN0IGNsaWVudFRvcCA9IGRvY0VsLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwXHJcbiAgICBjb25zdCBjbGllbnRMZWZ0ID0gZG9jRWwuY2xpZW50TGVmdCB8fCBib2R5LmNsaWVudExlZnQgfHwgMFxyXG5cclxuICAgIGNvbnN0IHRvcCA9IGJveC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3BcclxuICAgIGNvbnN0IGxlZnQgPSBib3gubGVmdCArIHNjcm9sbExlZnQgLSBjbGllbnRMZWZ0XHJcblxyXG4gICAgcmV0dXJuIHsgeTogTWF0aC5yb3VuZCh0b3ApLCB4OiBNYXRoLnJvdW5kKGxlZnQpIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFBvaW50TGlrZVxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geFxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBjb21iaW5lcyBvcHRpb25zIGFuZCBkZWZhdWx0IG9wdGlvbnNcclxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICogQHBhcmFtIHtvYmplY3R9IGRlZmF1bHRzXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IG9wdGlvbnMrZGVmYXVsdHNcclxuICovXHJcbmZ1bmN0aW9uIG9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMpXHJcbntcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgICBmb3IgKGxldCBvcHRpb24gaW4gZGVmYXVsdHMpXHJcbiAgICB7XHJcbiAgICAgICAgb3B0aW9uc1tvcHRpb25dID0gdHlwZW9mIG9wdGlvbnNbb3B0aW9uXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zW29wdGlvbl0gOiBkZWZhdWx0c1tvcHRpb25dXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3B0aW9uc1xyXG59XHJcblxyXG4vKipcclxuICogc2V0IGEgc3R5bGUgb24gYW4gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZVxyXG4gKiBAcGFyYW0geyhzdHJpbmd8c3RyaW5nW10pfSB2YWx1ZSAtIHNpbmdsZSB2YWx1ZSBvciBsaXN0IG9mIHBvc3NpYmxlIHZhbHVlcyAodGVzdCBlYWNoIG9uZSBpbiBvcmRlciB0byBzZWUgaWYgaXQgd29ya3MpXHJcbiAqL1xyXG5mdW5jdGlvbiBzdHlsZShlbGVtZW50LCBzdHlsZSwgdmFsdWUpXHJcbntcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSlcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbc3R5bGVdID0gZW50cnlcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGVbc3R5bGVdID09PSBlbnRyeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlW3N0eWxlXSA9IHZhbHVlXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBjYWxjdWxhdGUgcGVyY2VudGFnZSBvZiBvdmVybGFwIGJldHdlZW4gdHdvIGJveGVzXHJcbiAqIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMjIwMDA0LzE5NTU5OTdcclxuICogQHBhcmFtIHtudW1iZXJ9IHhhMVxyXG4gKiBAcGFyYW0ge251bWJlcn0geWExXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4YTJcclxuICogQHBhcmFtIHtudW1iZXJ9IHhhMlxyXG4gKiBAcGFyYW0ge251bWJlcn0geGIxXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5YjFcclxuICogQHBhcmFtIHtudW1iZXJ9IHhiMlxyXG4gKiBAcGFyYW0ge251bWJlcn0geWIyXHJcbiAqL1xyXG5mdW5jdGlvbiBwZXJjZW50YWdlKHhhMSwgeWExLCB4YTIsIHlhMiwgeGIxLCB5YjEsIHhiMiwgeWIyKVxyXG57XHJcbiAgICBjb25zdCBzYSA9ICh4YTIgLSB4YTEpICogKHlhMiAtIHlhMSlcclxuICAgIGNvbnN0IHNiID0gKHhiMiAtIHhiMSkgKiAoeWIyIC0geWIxKVxyXG4gICAgY29uc3Qgc2kgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih4YTIsIHhiMikgLSBNYXRoLm1heCh4YTEsIHhiMSkpICogTWF0aC5tYXgoMCwgTWF0aC5taW4oeWEyLCB5YjIpIC0gTWF0aC5tYXgoeWExLCB5YjEpKVxyXG4gICAgY29uc3QgdW5pb24gPSBzYSArIHNiIC0gc2lcclxuICAgIGlmICh1bmlvbiAhPT0gMClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gc2kgLyB1bmlvblxyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAwXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKGVsZW1lbnQpXHJcbntcclxuICAgIHdoaWxlIChlbGVtZW50LmZpcnN0Q2hpbGQpXHJcbiAgICB7XHJcbiAgICAgICAgZWxlbWVudC5maXJzdENoaWxkLnJlbW92ZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh0bWwob3B0aW9ucylcclxue1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuICAgIGNvbnN0IG9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0aW9ucy50eXBlIHx8ICdkaXYnKVxyXG4gICAgaWYgKG9wdGlvbnMucGFyZW50KVxyXG4gICAge1xyXG4gICAgICAgIG9wdGlvbnMucGFyZW50LmFwcGVuZENoaWxkKG9iamVjdClcclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLmRlZmF1bHRTdHlsZXMpXHJcbiAgICB7XHJcbiAgICAgICAgc3R5bGVzKG9iamVjdCwgb3B0aW9ucy5kZWZhdWx0U3R5bGVzKVxyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuc3R5bGVzKVxyXG4gICAge1xyXG4gICAgICAgIHN0eWxlcyhvYmplY3QsIG9wdGlvbnMuc3R5bGVzKVxyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuaHRtbClcclxuICAgIHtcclxuICAgICAgICBvYmplY3QuaW5uZXJIVE1MID0gb3B0aW9ucy5odG1sXHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5pZClcclxuICAgIHtcclxuICAgICAgICBvYmplY3QuaWQgPSBvcHRpb25zLmlkXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0eWxlcyhvYmplY3QsIHN0eWxlcylcclxue1xyXG4gICAgZm9yIChsZXQgc3R5bGUgaW4gc3R5bGVzKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHN0eWxlc1tzdHlsZV0pKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgZW50cnkgb2Ygc3R5bGVzW3N0eWxlXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnN0eWxlW3N0eWxlXSA9IGVudHJ5XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LnN0eWxlW3N0eWxlXSA9PT0gZW50cnkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBvYmplY3Quc3R5bGVbc3R5bGVdID0gc3R5bGVzW3N0eWxlXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hpbGRJbmRleChwYXJlbnQsIGNoaWxkKVxyXG57XHJcbiAgICBsZXQgaW5kZXggPSAwXHJcbiAgICBmb3IgKGxldCBlbnRyeSBvZiBwYXJlbnQuY2hpbGRyZW4pXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGVudHJ5ID09PSBjaGlsZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRleFxyXG4gICAgICAgIH1cclxuICAgICAgICBpbmRleCsrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTFcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICByZW1vdmVDaGlsZHJlbixcclxuICAgIGRpc3RhbmNlLFxyXG4gICAgZGlzdGFuY2VQb2ludEVsZW1lbnQsXHJcbiAgICBpbnNpZGUsXHJcbiAgICB0b0dsb2JhbCxcclxuICAgIG9wdGlvbnMsXHJcbiAgICBzdHlsZSxcclxuICAgIHBlcmNlbnRhZ2UsXHJcbiAgICBodG1sLFxyXG4gICAgc3R5bGVzLFxyXG4gICAgZ2V0Q2hpbGRJbmRleFxyXG59Il19