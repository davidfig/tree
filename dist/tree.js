'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Events = require('eventemitter3');
var clicked = require('clicked');

var defaults = require('./defaults');
var utils = require('./utils');
var icons = require('./icons');

var Tree = function (_Events) {
    _inherits(Tree, _Events);

    /**
     * Create Tree
     * @param {HTMLElement} element
     * @param {TreeData} tree - data for tree
     * @param {TreeOptions} [options]
     * @param {string} [options.children=children] name of tree parameter containing the children
     * @param {string} [options[this.options.data]=data] name of tree parameter containing the data
     * @param {string} [options.parent=parent] name of tree parameter containing the parent link in data
     * @param {string} [options.name=name] name of tree parameter containing the name in data
     * @param {boolean} [options.move=true] allow tree to be rearranged
     * @param {number} [options.indentation=20] number of pixels to indent for each level
     * @param {number} [options.threshold=10] number of pixels to move to start a drag
     * @param {number} [options.holdTime=2000] number of milliseconds before name can be edited (set to 0 to disable)
     * @param {boolean} [options.expandOnClick=true] expand and collapse node on click without drag
     * @param {number} [options.dragOpacity=0.75] opacity setting for dragged item
     * @param {string[]} [options.nameStyles]
     * @param {string[]} [options.indicatorStyles]
     * @fires render
     * @fires clicked
     * @fires expand
     * @fires collapse
     * @fires name-change
     * @fires move
     * @fires move-pending
     * @fires update
     */
    function Tree(element, tree, options) {
        _classCallCheck(this, Tree);

        var _this = _possibleConstructorReturn(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this));

        _this.options = utils.options(options, defaults);
        _this.element = element;
        _this.element[_this.options.data] = tree;
        document.body.addEventListener('mousemove', function (e) {
            return _this._move(e);
        });
        document.body.addEventListener('touchmove', function (e) {
            return _this._move(e);
        });
        document.body.addEventListener('mouseup', function (e) {
            return _this._up(e);
        });
        document.body.addEventListener('touchend', function (e) {
            return _this._up(e);
        });
        document.body.addEventListener('mouseleave', function (e) {
            return _this._up(e);
        });
        _this._createIndicator();
        _this.update();
        return _this;
    }

    /**
     * allow tree to be rearranged
     * @type {booleans}
     */


    _createClass(Tree, [{
        key: '_createIndicator',
        value: function _createIndicator() {
            this.indicator = utils.html();
            var content = utils.html({ parent: this.indicator, styles: { display: 'flex' } });
            this.indicator.indentation = utils.html({ parent: content });
            this.indicator.icon = utils.html({ parent: content, defaultStyles: this.options.expandStyles, styles: { height: 0 } });
            this.indicator.line = utils.html({
                parent: content,
                styles: this.options.indicatorStyles
            });
        }
    }, {
        key: 'leaf',
        value: function leaf(data, level) {
            var _this2 = this;

            var leaf = utils.html();
            leaf.isLeaf = true;
            leaf[this.options.data] = data;
            leaf.content = utils.html({ parent: leaf, styles: { display: 'flex', alignItems: 'center' } });
            leaf.indentation = utils.html({ parent: leaf.content, styles: { width: level * this.options.indentation + 'px' } });
            leaf.icon = utils.html({ parent: leaf.content, html: data[this.options.expanded] ? icons.open : icons.closed, styles: this.options.expandStyles });
            leaf.name = utils.html({ parent: leaf.content, html: data[this.options.name], styles: this.options.nameStyles });

            leaf.name.addEventListener('mousedown', function (e) {
                return _this2._down(e);
            });
            leaf.name.addEventListener('touchstart', function (e) {
                return _this2._down(e);
            });
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data[this.options.children][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var child = _step.value;

                    var add = this.leaf(child, level + 1);
                    add[this.options.data].parent = data;
                    leaf.appendChild(add);
                    if (!data[this.options.expanded]) {
                        add.style.display = 'none';
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

            if (this._getChildren(leaf, true).length === 0) {
                this._hideIcon(leaf);
            }
            clicked(leaf.icon, function () {
                return _this2.toggleExpand(leaf);
            });
            this.emit('render', leaf, this);
            return leaf;
        }
    }, {
        key: '_getChildren',
        value: function _getChildren(leaf, all) {
            leaf = leaf || this.element;
            var children = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = leaf.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var child = _step2.value;

                    if (child.isLeaf && (all || child.style.display !== 'none')) {
                        children.push(child);
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

            return children;
        }
    }, {
        key: '_hideIcon',
        value: function _hideIcon(leaf) {
            if (leaf.isLeaf) {
                leaf.icon.style.opacity = 0;
                leaf.icon.style.cursor = 'unset';
            }
        }
    }, {
        key: '_showIcon',
        value: function _showIcon(leaf) {
            if (leaf.isLeaf) {
                leaf.icon.style.opacity = 1;
                leaf.icon.style.cursor = this.options.expandStyles.cursor;
            }
        }
    }, {
        key: 'expandAll',
        value: function expandAll() {
            this._expandChildren(this.element);
        }
    }, {
        key: '_expandChildren',
        value: function _expandChildren(leaf) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._getChildren(leaf, true)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var child = _step3.value;

                    this.expand(child);
                    this._expandChildren(child);
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
        }
    }, {
        key: 'collapseAll',
        value: function collapseAll() {
            this._collapseChildren(this);
        }
    }, {
        key: '_collapseChildren',
        value: function _collapseChildren(leaf) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._getChildren(leaf, true)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var child = _step4.value;

                    this.collapse(child);
                    this._collapseChildren(child);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: 'toggleExpand',
        value: function toggleExpand(leaf) {
            if (leaf.icon.style.opacity !== '0') {
                if (leaf[this.options.data][this.options.expanded]) {
                    this.collapse(leaf);
                } else {
                    this.expand(leaf);
                }
            }
        }
    }, {
        key: 'expand',
        value: function expand(leaf) {
            if (leaf.isLeaf) {
                var children = this._getChildren(leaf, true);
                if (children.length) {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var child = _step5.value;

                            child.style.display = 'block';
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    leaf[this.options.data][this.options.expanded] = true;
                    leaf.icon.innerHTML = icons.open;
                    this.emit('expand', leaf, this);
                    this.emit('update', leaf, this);
                }
            }
        }
    }, {
        key: 'collapse',
        value: function collapse(leaf) {
            if (leaf.isLeaf) {
                var children = this._getChildren(leaf, true);
                if (children.length) {
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var child = _step6.value;

                            child.style.display = 'none';
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }

                    leaf[this.options.data][this.options.expanded] = false;
                    leaf.icon.innerHTML = icons.closed;
                    this.emit('collapse', leaf, this);
                    this.emit('update', leaf, this);
                }
            }
        }

        /**
         * call this after tree's data has been updated outside of this library
         */

    }, {
        key: 'update',
        value: function update() {
            var scroll = this.element.scrollTop;
            utils.removeChildren(this.element);
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.element[this.options.data][this.options.children][Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var leaf = _step7.value;

                    var add = this.leaf(leaf, 0);
                    add[this.options.data].parent = this.element[this.options.data];
                    this.element.appendChild(add);
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            this.element.scrollTop = scroll + 'px';
        }
    }, {
        key: '_down',
        value: function _down(e) {
            var _this3 = this;

            this.target = e.currentTarget.parentNode.parentNode;
            this.down = { x: e.pageX, y: e.pageY };
            var pos = utils.toGlobal(this.target);
            this.offset = { x: e.pageX - pos.x, y: e.pageY - pos.y };
            if (this.options.holdTime) {
                this.holdTimeout = window.setTimeout(function () {
                    return _this3._hold();
                }, this.options.holdTime);
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }, {
        key: '_hold',
        value: function _hold() {
            var _this4 = this;

            this.holdTimeout = null;
            this.edit = this.target;
            this.input = utils.html({ parent: this.edit.name.parentNode, type: 'input', styles: this.options.nameStyles });
            var computed = window.getComputedStyle(this.edit.name);
            this.input.style.boxSizing = 'content-box';
            this.input.style.fontFamily = computed.getPropertyValue('font-family');
            this.input.style.fontSize = computed.getPropertyValue('font-size');
            this.input.value = this.edit.name.innerText;
            this.input.setSelectionRange(0, this.input.value.length);
            this.input.focus();
            this.input.addEventListener('update', function () {
                _this4.nameChange(_this4.edit, _this4.input.value);
                _this4._holdClose();
            });
            this.input.addEventListener('keyup', function (e) {
                if (e.code === 'Escape') {
                    _this4._holdClose();
                }
                if (e.code === 'Enter') {
                    _this4.nameChange(_this4.edit, _this4.input.value);
                    _this4._holdClose();
                }
            });
            this.edit.name.style.display = 'none';
            this.target = null;
        }
    }, {
        key: '_holdClose',
        value: function _holdClose() {
            if (this.edit) {
                this.input.remove();
                this.edit.name.style.display = 'block';
                this.edit = this.input = null;
            }
        }
    }, {
        key: 'nameChange',
        value: function nameChange(leaf, name) {
            leaf[this.options.data].name = this.input.value;
            leaf.name.innerHTML = name;
            this.emit('name-change', leaf, this.input.value, this);
            this.emit('update', leaf, this);
        }
    }, {
        key: '_setIndicator',
        value: function _setIndicator() {
            var level = 0;
            var traverse = this.indicator.parentNode;
            while (traverse !== this.element) {
                level++;
                traverse = traverse.parentNode;
            }
            this.indicator.indentation.style.width = level * this.options.indentation + 'px';
        }
    }, {
        key: '_pickup',
        value: function _pickup() {
            if (this.holdTimeout) {
                window.clearTimeout(this.holdTimeout);
                this.holdTimeout = null;
            }
            this.emit('move-pending', this.target, this);
            var parent = this.target.parentNode;
            parent.insertBefore(this.indicator, this.target);
            this._setIndicator();
            var pos = utils.toGlobal(this.target);
            document.body.appendChild(this.target);
            this.old = {
                opacity: this.target.style.opacity || 'unset',
                position: this.target.style.position || 'unset',
                boxShadow: this.target.name.style.boxShadow || 'unset'
            };
            this.target.style.position = 'absolute';
            this.target.name.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.25)';
            this.target.style.left = pos.x + 'px';
            this.target.style.top = pos.y + 'px';
            this.target.style.opacity = this.options.dragOpacity;
            if (this._getChildren(parent, true).length === 0) {
                this._hideIcon(parent);
            }
        }
    }, {
        key: '_checkThreshold',
        value: function _checkThreshold(e) {
            if (!this.options.move) {
                return false;
            } else if (this.moving) {
                return true;
            } else {
                if (utils.distance(this.down.x, this.down.y, e.pageX, e.pageY)) {
                    this.moving = true;
                    this._pickup();
                    return true;
                } else {
                    return false;
                }
            }
        }
    }, {
        key: '_findClosest',
        value: function _findClosest(e, entry) {
            var pos = utils.toGlobal(entry.name);
            if (pos.y + entry.name.offsetHeight / 2 <= e.pageY) {
                if (!this.closest.foundAbove) {
                    if (utils.inside(e.pageX, e.pageY, entry.name)) {
                        this.closest.foundAbove = true;
                        this.closest.above = entry;
                    } else {
                        var distance = utils.distancePointElement(e.pageX, e.pageY, entry.name);
                        if (distance < this.closest.distanceAbove) {
                            this.closest.distanceAbove = distance;
                            this.closest.above = entry;
                        }
                    }
                }
            } else if (!this.closest.foundBelow) {
                if (utils.inside(e.pageX, e.pageY, entry.name)) {
                    this.closest.foundBelow = true;
                    this.closest.below = entry;
                } else {
                    var _distance = utils.distancePointElement(e.pageX, e.pageY, entry.name);
                    if (_distance < this.closest.distanceBelow) {
                        this.closest.distanceBelow = _distance;
                        this.closest.below = entry;
                    }
                }
            }
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this._getChildren(entry)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var child = _step8.value;

                    this._findClosest(e, child);
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }
        }
    }, {
        key: '_getFirstChild',
        value: function _getFirstChild(element, all) {
            var children = this._getChildren(element, all);
            if (children.length) {
                return children[0];
            }
        }
    }, {
        key: '_getLastChild',
        value: function _getLastChild(element, all) {
            var children = this._getChildren(element, all);
            if (children.length) {
                return children[children.length - 1];
            }
        }
    }, {
        key: '_getParent',
        value: function _getParent(element) {
            element = element.parentNode;
            while (element.style.display === 'none') {
                element = element.parentNode;
            }
            return element;
        }
    }, {
        key: '_move',
        value: function _move(e) {
            if (this.target && this._checkThreshold(e)) {
                this.indicator.remove();
                this.target.style.left = e.pageX - this.offset.x + 'px';
                this.target.style.top = e.pageY - this.offset.y + 'px';
                var x = utils.toGlobal(this.target.name).x;
                this.closest = { distanceAbove: Infinity, distanceBelow: Infinity };
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = this._getChildren()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var child = _step9.value;

                        this._findClosest(e, child);
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                if (!this.closest.above && !this.closest.below) {
                    this.element.appendChild(this.indicator);
                } else if (!this.closest.above) // null [] leaf
                    {
                        this.element.insertBefore(this.indicator, this._getFirstChild(this.element));
                    } else if (!this.closest.below) // leaf [] null
                    {
                        var pos = utils.toGlobal(this.closest.above.name);
                        if (x > pos.x + this.options.indentation) {
                            this.closest.above.insertBefore(this.indicator, this._getFirstChild(this.closest.above, true));
                        } else if (x > pos.x - this.options.indentation) {
                            this.closest.above.parentNode.appendChild(this.indicator);
                        } else {
                            var parent = this.closest.above;
                            while (parent !== this.element && x < pos.x) {
                                parent = this._getParent(parent);
                                if (parent !== this.element) {
                                    pos = utils.toGlobal(parent.name);
                                }
                            }
                            parent.appendChild(this.indicator);
                        }
                    } else if (this.closest.below.parentNode === this.closest.above) // parent [] child
                    {
                        this.closest.above.insertBefore(this.indicator, this.closest.below);
                    } else if (this.closest.below.parentNode === this.closest.above.parentNode) // sibling [] sibling
                    {
                        var _pos = utils.toGlobal(this.closest.above.name);
                        if (x > _pos.x + this.options.indentation) {
                            this.closest.above.insertBefore(this.indicator, this._getLastChild(this.closest.above, true));
                        } else {
                            this.closest.above.parentNode.insertBefore(this.indicator, this.closest.below);
                        }
                    } else // child [] parent^
                    {
                        var _pos2 = utils.toGlobal(this.closest.above.name);
                        if (x > _pos2.x + this.options.indentation) {
                            this.closest.above.insertBefore(this.indicator, this._getLastChild(this.closest.above, true));
                        } else if (x > _pos2.x - this.options.indentation) {
                            this.closest.above.parentNode.appendChild(this.indicator);
                        } else if (x < utils.toGlobal(this.closest.below.name).x) {
                            this.closest.below.parentNode.insertBefore(this.indicator, this.closest.below);
                        } else {
                            var _parent = this.closest.above;
                            while (_parent.parentNode !== this.closest.below.parentNode && x < _pos2.x) {
                                _parent = this._getParent(_parent);
                                _pos2 = utils.toGlobal(_parent.name);
                            }
                            _parent.appendChild(this.indicator);
                        }
                    }
                this._setIndicator();
            }
        }
    }, {
        key: '_up',
        value: function _up() {
            if (this.target) {
                if (!this.moving) {
                    if (this.options.expandOnClick) {
                        this.toggleExpand(this.target);
                    }
                    this.emit('clicked', this.target, this);
                } else {
                    this.indicator.parentNode.insertBefore(this.target, this.indicator);
                    this.expand(this.indicator.parentNode);
                    this._showIcon(this.indicator.parentNode);
                    this.target.style.position = this.old.position === 'unset' ? '' : this.old.position;
                    this.target.name.style.boxShadow = this.old.boxShadow === 'unset' ? '' : this.old.boxShadow;
                    this.target.style.opacity = this.old.opacity === 'unset' ? '' : this.old.opacity;
                    this.target.indentation.style.width = this.indicator.indentation.offsetWidth + 'px';
                    this.indicator.remove();
                    this._moveData();
                    this.emit('move', this.target, this);
                    this.emit('update', this.target, this);
                }
                if (this.holdTimeout) {
                    window.clearTimeout(this.holdTimeout);
                    this.holdTimeout = null;
                }
                this.target = this.moving = null;
            }
        }
    }, {
        key: '_moveData',
        value: function _moveData() {
            this.target[this.options.data].parent.children.splice(this.target[this.options.data].parent.children.indexOf(this.target[this.options.data]), 1);
            this.target.parentNode[this.options.data].children.splice(utils.getChildIndex(this.target.parentNode, this.target), 0, this.target[this.options.data]);
            this.target[this.options.data].parent = this.target.parentNode[this.options.data];
        }
    }, {
        key: 'move',
        get: function get() {
            return this.options.move;
        },
        set: function set(value) {
            this.options.move = value;
        }
    }]);

    return Tree;
}(Events);

module.exports = Tree;

/**
 * @typedef {Object} Tree~TreeData
 * @property {TreeData[]} children
 * @property {string} name
 * @property {parent} [parent] if not provided then will traverse tree to find parent
 */

/**
  * trigger when expand is called either through UI interaction or Tree.expand()
  * @event Tree~expand
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when collapse is called either through UI interaction or Tree.expand()
  * @event Tree~collapse
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when name is change either through UI interaction or Tree.nameChange()
  * @event Tree~name-change
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {string} name
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf is picked up through UI interaction
  * @event Tree~move-pending
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf's location is changed
  * @event Tree~move
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf is clicked and not dragged or held
  * @event Tree~clicked
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf is changed (i.e., moved, name-change)
  * @event Tree~update
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf's div is created
  * @event Tree~render
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90cmVlLmpzIl0sIm5hbWVzIjpbIkV2ZW50cyIsInJlcXVpcmUiLCJjbGlja2VkIiwiZGVmYXVsdHMiLCJ1dGlscyIsImljb25zIiwiVHJlZSIsImVsZW1lbnQiLCJ0cmVlIiwib3B0aW9ucyIsImRhdGEiLCJkb2N1bWVudCIsImJvZHkiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIl9tb3ZlIiwiX3VwIiwiX2NyZWF0ZUluZGljYXRvciIsInVwZGF0ZSIsImluZGljYXRvciIsImh0bWwiLCJjb250ZW50IiwicGFyZW50Iiwic3R5bGVzIiwiZGlzcGxheSIsImluZGVudGF0aW9uIiwiaWNvbiIsImRlZmF1bHRTdHlsZXMiLCJleHBhbmRTdHlsZXMiLCJoZWlnaHQiLCJsaW5lIiwiaW5kaWNhdG9yU3R5bGVzIiwibGV2ZWwiLCJsZWFmIiwiaXNMZWFmIiwiYWxpZ25JdGVtcyIsIndpZHRoIiwiZXhwYW5kZWQiLCJvcGVuIiwiY2xvc2VkIiwibmFtZSIsIm5hbWVTdHlsZXMiLCJfZG93biIsImNoaWxkcmVuIiwiY2hpbGQiLCJhZGQiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiX2dldENoaWxkcmVuIiwibGVuZ3RoIiwiX2hpZGVJY29uIiwidG9nZ2xlRXhwYW5kIiwiZW1pdCIsImFsbCIsInB1c2giLCJvcGFjaXR5IiwiY3Vyc29yIiwiX2V4cGFuZENoaWxkcmVuIiwiZXhwYW5kIiwiX2NvbGxhcHNlQ2hpbGRyZW4iLCJjb2xsYXBzZSIsImlubmVySFRNTCIsInNjcm9sbCIsInNjcm9sbFRvcCIsInJlbW92ZUNoaWxkcmVuIiwidGFyZ2V0IiwiY3VycmVudFRhcmdldCIsInBhcmVudE5vZGUiLCJkb3duIiwieCIsInBhZ2VYIiwieSIsInBhZ2VZIiwicG9zIiwidG9HbG9iYWwiLCJvZmZzZXQiLCJob2xkVGltZSIsImhvbGRUaW1lb3V0Iiwid2luZG93Iiwic2V0VGltZW91dCIsIl9ob2xkIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJlZGl0IiwiaW5wdXQiLCJ0eXBlIiwiY29tcHV0ZWQiLCJnZXRDb21wdXRlZFN0eWxlIiwiYm94U2l6aW5nIiwiZm9udEZhbWlseSIsImdldFByb3BlcnR5VmFsdWUiLCJmb250U2l6ZSIsInZhbHVlIiwiaW5uZXJUZXh0Iiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJmb2N1cyIsIm5hbWVDaGFuZ2UiLCJfaG9sZENsb3NlIiwiY29kZSIsInJlbW92ZSIsInRyYXZlcnNlIiwiY2xlYXJUaW1lb3V0IiwiaW5zZXJ0QmVmb3JlIiwiX3NldEluZGljYXRvciIsIm9sZCIsInBvc2l0aW9uIiwiYm94U2hhZG93IiwibGVmdCIsInRvcCIsImRyYWdPcGFjaXR5IiwibW92ZSIsIm1vdmluZyIsImRpc3RhbmNlIiwiX3BpY2t1cCIsImVudHJ5Iiwib2Zmc2V0SGVpZ2h0IiwiY2xvc2VzdCIsImZvdW5kQWJvdmUiLCJpbnNpZGUiLCJhYm92ZSIsImRpc3RhbmNlUG9pbnRFbGVtZW50IiwiZGlzdGFuY2VBYm92ZSIsImZvdW5kQmVsb3ciLCJiZWxvdyIsImRpc3RhbmNlQmVsb3ciLCJfZmluZENsb3Nlc3QiLCJfY2hlY2tUaHJlc2hvbGQiLCJJbmZpbml0eSIsIl9nZXRGaXJzdENoaWxkIiwiX2dldFBhcmVudCIsIl9nZXRMYXN0Q2hpbGQiLCJleHBhbmRPbkNsaWNrIiwiX3Nob3dJY29uIiwib2Zmc2V0V2lkdGgiLCJfbW92ZURhdGEiLCJzcGxpY2UiLCJpbmRleE9mIiwiZ2V0Q2hpbGRJbmRleCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxTQUFTQyxRQUFRLGVBQVIsQ0FBZjtBQUNBLElBQU1DLFVBQVVELFFBQVEsU0FBUixDQUFoQjs7QUFFQSxJQUFNRSxXQUFXRixRQUFRLFlBQVIsQ0FBakI7QUFDQSxJQUFNRyxRQUFRSCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU1JLFFBQVFKLFFBQVEsU0FBUixDQUFkOztJQUVNSyxJOzs7QUFFRjs7Ozs7Ozs7Ozs7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QW9CLEtBQUt4RSxNQUFMLENBQVlFLFVBQWhDLEVBQTRDLEtBQUtGLE1BQWpELENBQTFELEVBQW9ILENBQXBILEVBQXVILEtBQUtBLE1BQUwsQ0FBWSxLQUFLeEQsT0FBTCxDQUFhQyxJQUF6QixDQUF2SDtBQUNBLGlCQUFLdUQsTUFBTCxDQUFZLEtBQUt4RCxPQUFMLENBQWFDLElBQXpCLEVBQStCWSxNQUEvQixHQUF3QyxLQUFLMkMsTUFBTCxDQUFZRSxVQUFaLENBQXVCLEtBQUsxRCxPQUFMLENBQWFDLElBQXBDLENBQXhDO0FBQ0g7Ozs0QkF0Z0JEO0FBQ0ksbUJBQU8sS0FBS0QsT0FBTCxDQUFhcUcsSUFBcEI7QUFDSCxTOzBCQUNRbEIsSyxFQUNUO0FBQ0ksaUJBQUtuRixPQUFMLENBQWFxRyxJQUFiLEdBQW9CbEIsS0FBcEI7QUFDSDs7OztFQXREYzVGLE07O0FBeWpCbkIwSSxPQUFPQyxPQUFQLEdBQWlCckksSUFBakI7O0FBRUE7Ozs7Ozs7QUFPQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBUUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7O0FBUUEiLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50ZW1pdHRlcjMnKVxyXG5jb25zdCBjbGlja2VkID0gcmVxdWlyZSgnY2xpY2tlZCcpXHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKVxyXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxyXG5jb25zdCBpY29ucyA9IHJlcXVpcmUoJy4vaWNvbnMnKVxyXG5cclxuY2xhc3MgVHJlZSBleHRlbmRzIEV2ZW50c1xyXG57XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBUcmVlXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge1RyZWVEYXRhfSB0cmVlIC0gZGF0YSBmb3IgdHJlZVxyXG4gICAgICogQHBhcmFtIHtUcmVlT3B0aW9uc30gW29wdGlvbnNdXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY2hpbGRyZW49Y2hpbGRyZW5dIG5hbWUgb2YgdHJlZSBwYXJhbWV0ZXIgY29udGFpbmluZyB0aGUgY2hpbGRyZW5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uc1t0aGlzLm9wdGlvbnMuZGF0YV09ZGF0YV0gbmFtZSBvZiB0cmVlIHBhcmFtZXRlciBjb250YWluaW5nIHRoZSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucGFyZW50PXBhcmVudF0gbmFtZSBvZiB0cmVlIHBhcmFtZXRlciBjb250YWluaW5nIHRoZSBwYXJlbnQgbGluayBpbiBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT1uYW1lXSBuYW1lIG9mIHRyZWUgcGFyYW1ldGVyIGNvbnRhaW5pbmcgdGhlIG5hbWUgaW4gZGF0YVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5tb3ZlPXRydWVdIGFsbG93IHRyZWUgdG8gYmUgcmVhcnJhbmdlZFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmluZGVudGF0aW9uPTIwXSBudW1iZXIgb2YgcGl4ZWxzIHRvIGluZGVudCBmb3IgZWFjaCBsZXZlbFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD0xMF0gbnVtYmVyIG9mIHBpeGVscyB0byBtb3ZlIHRvIHN0YXJ0IGEgZHJhZ1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmhvbGRUaW1lPTIwMDBdIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmVmb3JlIG5hbWUgY2FuIGJlIGVkaXRlZCAoc2V0IHRvIDAgdG8gZGlzYWJsZSlcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZXhwYW5kT25DbGljaz10cnVlXSBleHBhbmQgYW5kIGNvbGxhcHNlIG5vZGUgb24gY2xpY2sgd2l0aG91dCBkcmFnXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZHJhZ09wYWNpdHk9MC43NV0gb3BhY2l0eSBzZXR0aW5nIGZvciBkcmFnZ2VkIGl0ZW1cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLm5hbWVTdHlsZXNdXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBbb3B0aW9ucy5pbmRpY2F0b3JTdHlsZXNdXHJcbiAgICAgKiBAZmlyZXMgcmVuZGVyXHJcbiAgICAgKiBAZmlyZXMgY2xpY2tlZFxyXG4gICAgICogQGZpcmVzIGV4cGFuZFxyXG4gICAgICogQGZpcmVzIGNvbGxhcHNlXHJcbiAgICAgKiBAZmlyZXMgbmFtZS1jaGFuZ2VcclxuICAgICAqIEBmaXJlcyBtb3ZlXHJcbiAgICAgKiBAZmlyZXMgbW92ZS1wZW5kaW5nXHJcbiAgICAgKiBAZmlyZXMgdXBkYXRlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHRyZWUsIG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHV0aWxzLm9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxyXG4gICAgICAgIHRoaXMuZWxlbWVudFt0aGlzLm9wdGlvbnMuZGF0YV0gPSB0cmVlXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4gdGhpcy5fbW92ZShlKSlcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChlKSA9PiB0aGlzLl9tb3ZlKGUpKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChlKSA9PiB0aGlzLl91cChlKSlcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGUpID0+IHRoaXMuX3VwKGUpKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKSA9PiB0aGlzLl91cChlKSlcclxuICAgICAgICB0aGlzLl9jcmVhdGVJbmRpY2F0b3IoKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFsbG93IHRyZWUgdG8gYmUgcmVhcnJhbmdlZFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW5zfVxyXG4gICAgICovXHJcbiAgICBnZXQgbW92ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tb3ZlXHJcbiAgICB9XHJcbiAgICBzZXQgbW92ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubW92ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgX2NyZWF0ZUluZGljYXRvcigpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pbmRpY2F0b3IgPSB1dGlscy5odG1sKClcclxuICAgICAgICBjb25zdCBjb250ZW50ID0gdXRpbHMuaHRtbCh7IHBhcmVudDogdGhpcy5pbmRpY2F0b3IsIHN0eWxlczogeyBkaXNwbGF5OiAnZmxleCcgfSB9KVxyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yLmluZGVudGF0aW9uID0gdXRpbHMuaHRtbCh7IHBhcmVudDogY29udGVudCB9KVxyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yLmljb24gPSB1dGlscy5odG1sKHsgcGFyZW50OiBjb250ZW50LCBkZWZhdWx0U3R5bGVzOiB0aGlzLm9wdGlvbnMuZXhwYW5kU3R5bGVzLCBzdHlsZXM6IHsgaGVpZ2h0OiAwIH0gfSlcclxuICAgICAgICB0aGlzLmluZGljYXRvci5saW5lID0gdXRpbHMuaHRtbCh7XHJcbiAgICAgICAgICAgIHBhcmVudDogY29udGVudCxcclxuICAgICAgICAgICAgc3R5bGVzOiB0aGlzLm9wdGlvbnMuaW5kaWNhdG9yU3R5bGVzXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBsZWFmKGRhdGEsIGxldmVsKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxlYWYgPSB1dGlscy5odG1sKClcclxuICAgICAgICBsZWFmLmlzTGVhZiA9IHRydWVcclxuICAgICAgICBsZWFmW3RoaXMub3B0aW9ucy5kYXRhXSA9IGRhdGFcclxuICAgICAgICBsZWFmLmNvbnRlbnQgPSB1dGlscy5odG1sKHsgcGFyZW50OiBsZWFmLCBzdHlsZXM6IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9IH0pXHJcbiAgICAgICAgbGVhZi5pbmRlbnRhdGlvbiA9IHV0aWxzLmh0bWwoeyBwYXJlbnQ6IGxlYWYuY29udGVudCwgc3R5bGVzOiB7IHdpZHRoOiBsZXZlbCAqIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbiArICdweCcgfSB9KVxyXG4gICAgICAgIGxlYWYuaWNvbiA9IHV0aWxzLmh0bWwoeyBwYXJlbnQ6IGxlYWYuY29udGVudCwgaHRtbDogZGF0YVt0aGlzLm9wdGlvbnMuZXhwYW5kZWRdID8gaWNvbnMub3BlbiA6IGljb25zLmNsb3NlZCwgc3R5bGVzOiB0aGlzLm9wdGlvbnMuZXhwYW5kU3R5bGVzIH0pXHJcbiAgICAgICAgbGVhZi5uYW1lID0gdXRpbHMuaHRtbCh7IHBhcmVudDogbGVhZi5jb250ZW50LCBodG1sOiBkYXRhW3RoaXMub3B0aW9ucy5uYW1lXSwgc3R5bGVzOiB0aGlzLm9wdGlvbnMubmFtZVN0eWxlcyB9KVxyXG5cclxuICAgICAgICBsZWFmLm5hbWUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHRoaXMuX2Rvd24oZSkpXHJcbiAgICAgICAgbGVhZi5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4gdGhpcy5fZG93bihlKSlcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBkYXRhW3RoaXMub3B0aW9ucy5jaGlsZHJlbl0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBhZGQgPSB0aGlzLmxlYWYoY2hpbGQsIGxldmVsICsgMSlcclxuICAgICAgICAgICAgYWRkW3RoaXMub3B0aW9ucy5kYXRhXS5wYXJlbnQgPSBkYXRhXHJcbiAgICAgICAgICAgIGxlYWYuYXBwZW5kQ2hpbGQoYWRkKVxyXG4gICAgICAgICAgICBpZiAoIWRhdGFbdGhpcy5vcHRpb25zLmV4cGFuZGVkXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWRkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZ2V0Q2hpbGRyZW4obGVhZiwgdHJ1ZSkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5faGlkZUljb24obGVhZilcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xpY2tlZChsZWFmLmljb24sICgpID0+IHRoaXMudG9nZ2xlRXhwYW5kKGxlYWYpKVxyXG4gICAgICAgIHRoaXMuZW1pdCgncmVuZGVyJywgbGVhZiwgdGhpcylcclxuICAgICAgICByZXR1cm4gbGVhZlxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRDaGlsZHJlbihsZWFmLCBhbGwpXHJcbiAgICB7XHJcbiAgICAgICAgbGVhZiA9IGxlYWYgfHwgdGhpcy5lbGVtZW50XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGxlYWYuY2hpbGRyZW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuaXNMZWFmICYmIChhbGwgfHwgY2hpbGQuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2hpbGRyZW5cclxuICAgIH1cclxuXHJcbiAgICBfaGlkZUljb24obGVhZilcclxuICAgIHtcclxuICAgICAgICBpZiAobGVhZi5pc0xlYWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWFmLmljb24uc3R5bGUub3BhY2l0eSA9IDBcclxuICAgICAgICAgICAgbGVhZi5pY29uLnN0eWxlLmN1cnNvciA9ICd1bnNldCdcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3Nob3dJY29uKGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGxlYWYuaXNMZWFmKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVhZi5pY29uLnN0eWxlLm9wYWNpdHkgPSAxXHJcbiAgICAgICAgICAgIGxlYWYuaWNvbi5zdHlsZS5jdXJzb3IgPSB0aGlzLm9wdGlvbnMuZXhwYW5kU3R5bGVzLmN1cnNvclxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBhbmRBbGwoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2V4cGFuZENoaWxkcmVuKHRoaXMuZWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICBfZXhwYW5kQ2hpbGRyZW4obGVhZilcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9nZXRDaGlsZHJlbihsZWFmLCB0cnVlKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGNoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRDaGlsZHJlbihjaGlsZClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29sbGFwc2VBbGwoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2NvbGxhcHNlQ2hpbGRyZW4odGhpcylcclxuICAgIH1cclxuXHJcbiAgICBfY29sbGFwc2VDaGlsZHJlbihsZWFmKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX2dldENoaWxkcmVuKGxlYWYsIHRydWUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZShjaGlsZClcclxuICAgICAgICAgICAgdGhpcy5fY29sbGFwc2VDaGlsZHJlbihjaGlsZClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlRXhwYW5kKGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGxlYWYuaWNvbi5zdHlsZS5vcGFjaXR5ICE9PSAnMCcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobGVhZlt0aGlzLm9wdGlvbnMuZGF0YV1bdGhpcy5vcHRpb25zLmV4cGFuZGVkXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsYXBzZShsZWFmKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmQobGVhZilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBhbmQobGVhZilcclxuICAgIHtcclxuICAgICAgICBpZiAobGVhZi5pc0xlYWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldENoaWxkcmVuKGxlYWYsIHRydWUpXHJcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZWFmW3RoaXMub3B0aW9ucy5kYXRhXVt0aGlzLm9wdGlvbnMuZXhwYW5kZWRdID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgbGVhZi5pY29uLmlubmVySFRNTCA9IGljb25zLm9wZW5cclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXhwYW5kJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndXBkYXRlJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb2xsYXBzZShsZWFmKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChsZWFmLmlzTGVhZilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fZ2V0Q2hpbGRyZW4obGVhZiwgdHJ1ZSlcclxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGVhZlt0aGlzLm9wdGlvbnMuZGF0YV1bdGhpcy5vcHRpb25zLmV4cGFuZGVkXSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICBsZWFmLmljb24uaW5uZXJIVE1MID0gaWNvbnMuY2xvc2VkXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2NvbGxhcHNlJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndXBkYXRlJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgdGhpcyBhZnRlciB0cmVlJ3MgZGF0YSBoYXMgYmVlbiB1cGRhdGVkIG91dHNpZGUgb2YgdGhpcyBsaWJyYXJ5XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5lbGVtZW50LnNjcm9sbFRvcFxyXG4gICAgICAgIHV0aWxzLnJlbW92ZUNoaWxkcmVuKHRoaXMuZWxlbWVudClcclxuICAgICAgICBmb3IgKGxldCBsZWFmIG9mIHRoaXMuZWxlbWVudFt0aGlzLm9wdGlvbnMuZGF0YV1bdGhpcy5vcHRpb25zLmNoaWxkcmVuXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkZCA9IHRoaXMubGVhZihsZWFmLCAwKVxyXG4gICAgICAgICAgICBhZGRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudCA9IHRoaXMuZWxlbWVudFt0aGlzLm9wdGlvbnMuZGF0YV1cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGFkZClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IHNjcm9sbCArICdweCdcclxuICAgIH1cclxuXHJcbiAgICBfZG93bihlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZVxyXG4gICAgICAgIHRoaXMuZG93biA9IHsgeDogZS5wYWdlWCwgeTogZS5wYWdlWSB9XHJcbiAgICAgICAgY29uc3QgcG9zID0gdXRpbHMudG9HbG9iYWwodGhpcy50YXJnZXQpXHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSB7IHg6IGUucGFnZVggLSBwb3MueCwgeTogZS5wYWdlWSAtIHBvcy55IH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhvbGRUaW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5ob2xkVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMuX2hvbGQoKSwgdGhpcy5vcHRpb25zLmhvbGRUaW1lKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICB9XHJcblxyXG4gICAgX2hvbGQoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaG9sZFRpbWVvdXQgPSBudWxsXHJcbiAgICAgICAgdGhpcy5lZGl0ID0gdGhpcy50YXJnZXRcclxuICAgICAgICB0aGlzLmlucHV0ID0gdXRpbHMuaHRtbCh7IHBhcmVudDogdGhpcy5lZGl0Lm5hbWUucGFyZW50Tm9kZSwgdHlwZTogJ2lucHV0Jywgc3R5bGVzOiB0aGlzLm9wdGlvbnMubmFtZVN0eWxlcyB9KVxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lZGl0Lm5hbWUpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5zdHlsZS5ib3hTaXppbmcgPSAnY29udGVudC1ib3gnXHJcbiAgICAgICAgdGhpcy5pbnB1dC5zdHlsZS5mb250RmFtaWx5ID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnZm9udC1mYW1pbHknKVxyXG4gICAgICAgIHRoaXMuaW5wdXQuc3R5bGUuZm9udFNpemUgPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LXNpemUnKVxyXG4gICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSB0aGlzLmVkaXQubmFtZS5pbm5lclRleHRcclxuICAgICAgICB0aGlzLmlucHV0LnNldFNlbGVjdGlvblJhbmdlKDAsIHRoaXMuaW5wdXQudmFsdWUubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuaW5wdXQuZm9jdXMoKVxyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgKCkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZUNoYW5nZSh0aGlzLmVkaXQsIHRoaXMuaW5wdXQudmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuX2hvbGRDbG9zZSgpXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSAnRXNjYXBlJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faG9sZENsb3NlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSAnRW50ZXInKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWVDaGFuZ2UodGhpcy5lZGl0LCB0aGlzLmlucHV0LnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5faG9sZENsb3NlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5lZGl0Lm5hbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIF9ob2xkQ2xvc2UoKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmVkaXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0LnJlbW92ZSgpXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdC5uYW1lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdCA9IHRoaXMuaW5wdXQgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hbWVDaGFuZ2UobGVhZiwgbmFtZSlcclxuICAgIHtcclxuICAgICAgICBsZWFmW3RoaXMub3B0aW9ucy5kYXRhXS5uYW1lID0gdGhpcy5pbnB1dC52YWx1ZVxyXG4gICAgICAgIGxlYWYubmFtZS5pbm5lckhUTUwgPSBuYW1lXHJcbiAgICAgICAgdGhpcy5lbWl0KCduYW1lLWNoYW5nZScsIGxlYWYsIHRoaXMuaW5wdXQudmFsdWUsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsZWFmLCB0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIF9zZXRJbmRpY2F0b3IoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBsZXZlbCA9IDBcclxuICAgICAgICBsZXQgdHJhdmVyc2UgPSB0aGlzLmluZGljYXRvci5wYXJlbnROb2RlXHJcbiAgICAgICAgd2hpbGUgKHRyYXZlcnNlICE9PSB0aGlzLmVsZW1lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXZlbCsrXHJcbiAgICAgICAgICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluZGljYXRvci5pbmRlbnRhdGlvbi5zdHlsZS53aWR0aCA9IGxldmVsICogdGhpcy5vcHRpb25zLmluZGVudGF0aW9uICsgJ3B4J1xyXG4gICAgfVxyXG5cclxuICAgIF9waWNrdXAoKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmhvbGRUaW1lb3V0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmhvbGRUaW1lb3V0KVxyXG4gICAgICAgICAgICB0aGlzLmhvbGRUaW1lb3V0ID0gbnVsbFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVtaXQoJ21vdmUtcGVuZGluZycsIHRoaXMudGFyZ2V0LCB0aGlzKVxyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMudGFyZ2V0LnBhcmVudE5vZGVcclxuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLnRhcmdldClcclxuICAgICAgICB0aGlzLl9zZXRJbmRpY2F0b3IoKVxyXG4gICAgICAgIGNvbnN0IHBvcyA9IHV0aWxzLnRvR2xvYmFsKHRoaXMudGFyZ2V0KVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy50YXJnZXQpXHJcbiAgICAgICAgdGhpcy5vbGQgPSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IHRoaXMudGFyZ2V0LnN0eWxlLm9wYWNpdHkgfHwgJ3Vuc2V0JyxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMudGFyZ2V0LnN0eWxlLnBvc2l0aW9uIHx8ICd1bnNldCcsXHJcbiAgICAgICAgICAgIGJveFNoYWRvdzogdGhpcy50YXJnZXQubmFtZS5zdHlsZS5ib3hTaGFkb3cgfHwgJ3Vuc2V0J1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcclxuICAgICAgICB0aGlzLnRhcmdldC5uYW1lLnN0eWxlLmJveFNoYWRvdyA9ICczcHggM3B4IDVweCByZ2JhKDAsMCwwLDAuMjUpJ1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLmxlZnQgPSBwb3MueCArICdweCdcclxuICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS50b3AgPSBwb3MueSArICdweCdcclxuICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5vcHRpb25zLmRyYWdPcGFjaXR5XHJcbiAgICAgICAgaWYgKHRoaXMuX2dldENoaWxkcmVuKHBhcmVudCwgdHJ1ZSkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5faGlkZUljb24ocGFyZW50KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfY2hlY2tUaHJlc2hvbGQoZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5tb3ZlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHV0aWxzLmRpc3RhbmNlKHRoaXMuZG93bi54LCB0aGlzLmRvd24ueSwgZS5wYWdlWCwgZS5wYWdlWSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGlja3VwKClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfZmluZENsb3Nlc3QoZSwgZW50cnkpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9zID0gdXRpbHMudG9HbG9iYWwoZW50cnkubmFtZSlcclxuICAgICAgICBpZiAocG9zLnkgKyBlbnRyeS5uYW1lLm9mZnNldEhlaWdodCAvIDIgPD0gZS5wYWdlWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbG9zZXN0LmZvdW5kQWJvdmUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh1dGlscy5pbnNpZGUoZS5wYWdlWCwgZS5wYWdlWSwgZW50cnkubmFtZSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmZvdW5kQWJvdmUgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlID0gZW50cnlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHV0aWxzLmRpc3RhbmNlUG9pbnRFbGVtZW50KGUucGFnZVgsIGUucGFnZVksIGVudHJ5Lm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgdGhpcy5jbG9zZXN0LmRpc3RhbmNlQWJvdmUpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuZGlzdGFuY2VBYm92ZSA9IGRpc3RhbmNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5hYm92ZSA9IGVudHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLmNsb3Nlc3QuZm91bmRCZWxvdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh1dGlscy5pbnNpZGUoZS5wYWdlWCwgZS5wYWdlWSwgZW50cnkubmFtZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5mb3VuZEJlbG93ID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmJlbG93ID0gZW50cnlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdXRpbHMuZGlzdGFuY2VQb2ludEVsZW1lbnQoZS5wYWdlWCwgZS5wYWdlWSwgZW50cnkubmFtZSlcclxuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IHRoaXMuY2xvc2VzdC5kaXN0YW5jZUJlbG93KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5kaXN0YW5jZUJlbG93ID0gZGlzdGFuY2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYmVsb3cgPSBlbnRyeVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX2dldENoaWxkcmVuKGVudHJ5KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbmRDbG9zZXN0KGUsIGNoaWxkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfZ2V0Rmlyc3RDaGlsZChlbGVtZW50LCBhbGwpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRDaGlsZHJlbihlbGVtZW50LCBhbGwpXHJcbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlblswXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfZ2V0TGFzdENoaWxkKGVsZW1lbnQsIGFsbClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldENoaWxkcmVuKGVsZW1lbnQsIGFsbClcclxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuW2NoaWxkcmVuLmxlbmd0aCAtIDFdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRQYXJlbnQoZWxlbWVudClcclxuICAgIHtcclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXHJcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbWVudFxyXG4gICAgfVxyXG5cclxuICAgIF9tb3ZlKGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0ICYmIHRoaXMuX2NoZWNrVGhyZXNob2xkKGUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3IucmVtb3ZlKClcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUubGVmdCA9IGUucGFnZVggLSB0aGlzLm9mZnNldC54ICsgJ3B4J1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS50b3AgPSBlLnBhZ2VZIC0gdGhpcy5vZmZzZXQueSArICdweCdcclxuICAgICAgICAgICAgY29uc3QgeCA9IHV0aWxzLnRvR2xvYmFsKHRoaXMudGFyZ2V0Lm5hbWUpLnhcclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0ID0geyBkaXN0YW5jZUFib3ZlOiBJbmZpbml0eSwgZGlzdGFuY2VCZWxvdzogSW5maW5pdHkgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9nZXRDaGlsZHJlbigpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9maW5kQ2xvc2VzdChlLCBjaGlsZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2xvc2VzdC5hYm92ZSAmJiAhdGhpcy5jbG9zZXN0LmJlbG93KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbmRpY2F0b3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuY2xvc2VzdC5hYm92ZSkgLy8gbnVsbCBbXSBsZWFmXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuX2dldEZpcnN0Q2hpbGQodGhpcy5lbGVtZW50KSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5jbG9zZXN0LmJlbG93KSAvLyBsZWFmIFtdIG51bGxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IHV0aWxzLnRvR2xvYmFsKHRoaXMuY2xvc2VzdC5hYm92ZS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgaWYgKHggPiBwb3MueCArIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLl9nZXRGaXJzdENoaWxkKHRoaXMuY2xvc2VzdC5hYm92ZSwgdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh4ID4gcG9zLnggLSB0aGlzLm9wdGlvbnMuaW5kZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcy5pbmRpY2F0b3IpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuY2xvc2VzdC5hYm92ZVxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwYXJlbnQgIT09IHRoaXMuZWxlbWVudCAmJiB4IDwgcG9zLngpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnQocGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50ICE9PSB0aGlzLmVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcyA9IHV0aWxzLnRvR2xvYmFsKHBhcmVudC5uYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5jbG9zZXN0LmJlbG93LnBhcmVudE5vZGUgPT09IHRoaXMuY2xvc2VzdC5hYm92ZSkgLy8gcGFyZW50IFtdIGNoaWxkXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5hYm92ZS5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuY2xvc2VzdC5iZWxvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmNsb3Nlc3QuYmVsb3cucGFyZW50Tm9kZSA9PT0gdGhpcy5jbG9zZXN0LmFib3ZlLnBhcmVudE5vZGUpIC8vIHNpYmxpbmcgW10gc2libGluZ1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSB1dGlscy50b0dsb2JhbCh0aGlzLmNsb3Nlc3QuYWJvdmUubmFtZSlcclxuICAgICAgICAgICAgICAgIGlmICh4ID4gcG9zLnggKyB0aGlzLm9wdGlvbnMuaW5kZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlLmluc2VydEJlZm9yZSh0aGlzLmluZGljYXRvciwgdGhpcy5fZ2V0TGFzdENoaWxkKHRoaXMuY2xvc2VzdC5hYm92ZSwgdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLmNsb3Nlc3QuYmVsb3cpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSAvLyBjaGlsZCBbXSBwYXJlbnReXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3MgPSB1dGlscy50b0dsb2JhbCh0aGlzLmNsb3Nlc3QuYWJvdmUubmFtZSlcclxuICAgICAgICAgICAgICAgIGlmICh4ID4gcG9zLnggKyB0aGlzLm9wdGlvbnMuaW5kZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlLmluc2VydEJlZm9yZSh0aGlzLmluZGljYXRvciwgdGhpcy5fZ2V0TGFzdENoaWxkKHRoaXMuY2xvc2VzdC5hYm92ZSwgdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh4ID4gcG9zLnggLSB0aGlzLm9wdGlvbnMuaW5kZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcy5pbmRpY2F0b3IpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh4IDwgdXRpbHMudG9HbG9iYWwodGhpcy5jbG9zZXN0LmJlbG93Lm5hbWUpLngpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmJlbG93LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLmNsb3Nlc3QuYmVsb3cpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuY2xvc2VzdC5hYm92ZVxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwYXJlbnQucGFyZW50Tm9kZSAhPT0gdGhpcy5jbG9zZXN0LmJlbG93LnBhcmVudE5vZGUgJiYgeCA8IHBvcy54KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gdGhpcy5fZ2V0UGFyZW50KHBhcmVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zID0gdXRpbHMudG9HbG9iYWwocGFyZW50Lm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zZXRJbmRpY2F0b3IoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfdXAoKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb3ZpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwYW5kT25DbGljaylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUV4cGFuZCh0aGlzLnRhcmdldClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY2xpY2tlZCcsIHRoaXMudGFyZ2V0LCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3IucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy50YXJnZXQsIHRoaXMuaW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmQodGhpcy5pbmRpY2F0b3IucGFyZW50Tm9kZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3dJY29uKHRoaXMuaW5kaWNhdG9yLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5wb3NpdGlvbiA9IHRoaXMub2xkLnBvc2l0aW9uID09PSAndW5zZXQnID8gJycgOiB0aGlzLm9sZC5wb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQubmFtZS5zdHlsZS5ib3hTaGFkb3cgPSB0aGlzLm9sZC5ib3hTaGFkb3cgPT09ICd1bnNldCcgPyAnJyA6IHRoaXMub2xkLmJveFNoYWRvd1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUub3BhY2l0eSA9IHRoaXMub2xkLm9wYWNpdHkgPT09ICd1bnNldCcgPyAnJyA6IHRoaXMub2xkLm9wYWNpdHlcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LmluZGVudGF0aW9uLnN0eWxlLndpZHRoID0gdGhpcy5pbmRpY2F0b3IuaW5kZW50YXRpb24ub2Zmc2V0V2lkdGggKyAncHgnXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljYXRvci5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW92ZURhdGEoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdtb3ZlJywgdGhpcy50YXJnZXQsIHRoaXMpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudGFyZ2V0LCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvbGRUaW1lb3V0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaG9sZFRpbWVvdXQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvbGRUaW1lb3V0ID0gbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5tb3ZpbmcgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9tb3ZlRGF0YSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UodGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMudGFyZ2V0W3RoaXMub3B0aW9ucy5kYXRhXSksIDEpXHJcbiAgICAgICAgdGhpcy50YXJnZXQucGFyZW50Tm9kZVt0aGlzLm9wdGlvbnMuZGF0YV0uY2hpbGRyZW4uc3BsaWNlKHV0aWxzLmdldENoaWxkSW5kZXgodGhpcy50YXJnZXQucGFyZW50Tm9kZSwgdGhpcy50YXJnZXQpLCAwLCB0aGlzLnRhcmdldFt0aGlzLm9wdGlvbnMuZGF0YV0pXHJcbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudCA9IHRoaXMudGFyZ2V0LnBhcmVudE5vZGVbdGhpcy5vcHRpb25zLmRhdGFdXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJlZVxyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRyZWV+VHJlZURhdGFcclxuICogQHByb3BlcnR5IHtUcmVlRGF0YVtdfSBjaGlsZHJlblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZVxyXG4gKiBAcHJvcGVydHkge3BhcmVudH0gW3BhcmVudF0gaWYgbm90IHByb3ZpZGVkIHRoZW4gd2lsbCB0cmF2ZXJzZSB0cmVlIHRvIGZpbmQgcGFyZW50XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gZXhwYW5kIGlzIGNhbGxlZCBlaXRoZXIgdGhyb3VnaCBVSSBpbnRlcmFjdGlvbiBvciBUcmVlLmV4cGFuZCgpXHJcbiAgKiBAZXZlbnQgVHJlZX5leHBhbmRcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBjb2xsYXBzZSBpcyBjYWxsZWQgZWl0aGVyIHRocm91Z2ggVUkgaW50ZXJhY3Rpb24gb3IgVHJlZS5leHBhbmQoKVxyXG4gICogQGV2ZW50IFRyZWV+Y29sbGFwc2VcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBuYW1lIGlzIGNoYW5nZSBlaXRoZXIgdGhyb3VnaCBVSSBpbnRlcmFjdGlvbiBvciBUcmVlLm5hbWVDaGFuZ2UoKVxyXG4gICogQGV2ZW50IFRyZWV+bmFtZS1jaGFuZ2VcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lXHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmIGlzIHBpY2tlZCB1cCB0aHJvdWdoIFVJIGludGVyYWN0aW9uXHJcbiAgKiBAZXZlbnQgVHJlZX5tb3ZlLXBlbmRpbmdcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBhIGxlYWYncyBsb2NhdGlvbiBpcyBjaGFuZ2VkXHJcbiAgKiBAZXZlbnQgVHJlZX5tb3ZlXHJcbiAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdHJlZSBlbGVtZW50XHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmIGlzIGNsaWNrZWQgYW5kIG5vdCBkcmFnZ2VkIG9yIGhlbGRcclxuICAqIEBldmVudCBUcmVlfmNsaWNrZWRcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBhIGxlYWYgaXMgY2hhbmdlZCAoaS5lLiwgbW92ZWQsIG5hbWUtY2hhbmdlKVxyXG4gICogQGV2ZW50IFRyZWV+dXBkYXRlXHJcbiAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdHJlZSBlbGVtZW50XHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmJ3MgZGl2IGlzIGNyZWF0ZWRcclxuICAqIEBldmVudCBUcmVlfnJlbmRlclxyXG4gICogQHR5cGUge29iamVjdH1cclxuICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRyZWUgZWxlbWVudFxyXG4gICogQHByb3BlcnR5IHtUcmVlfSBUcmVlXHJcbiAgKi8iXX0=