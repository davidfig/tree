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
            this.holdTimeout = null;
            this._edit(this.target);
        }

        /**
         * edit the name entry using the data
         * @param {object} data element of leaf
         */

    }, {
        key: 'editData',
        value: function editData(data) {
            var children = this._getChildren(null, true);
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = children[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var child = _step8.value;

                    if (child.data === data) {
                        this.edit(child);
                    }
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

        /**
         * edit the name entry using the created element
         * @param {HTMLElement} leaf
         */

    }, {
        key: 'edit',
        value: function edit(leaf) {
            var _this4 = this;

            this.edit = leaf;
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
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this._getChildren(entry)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
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
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = this._getChildren()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var child = _step10.value;

                        this._findClosest(e, child);
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
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
        value: function _up(e) {
            if (this.target) {
                if (!this.moving) {
                    if (this.options.expandOnClick) {
                        this.toggleExpand(this.target);
                    }
                    this.emit('clicked', this.target, e, this);
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
  * @property {UIEvent} event
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90cmVlLmpzIl0sIm5hbWVzIjpbIkV2ZW50cyIsInJlcXVpcmUiLCJjbGlja2VkIiwiZGVmYXVsdHMiLCJ1dGlscyIsImljb25zIiwiVHJlZSIsImVsZW1lbnQiLCJ0cmVlIiwib3B0aW9ucyIsImRhdGEiLCJkb2N1bWVudCIsImJvZHkiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIl9tb3ZlIiwiX3VwIiwiX2NyZWF0ZUluZGljYXRvciIsInVwZGF0ZSIsImluZGljYXRvciIsImh0bWwiLCJjb250ZW50IiwicGFyZW50Iiwic3R5bGVzIiwiZGlzcGxheSIsImluZGVudGF0aW9uIiwiaWNvbiIsImRlZmF1bHRTdHlsZXMiLCJleHBhbmRTdHlsZXMiLCJoZWlnaHQiLCJsaW5lIiwiaW5kaWNhdG9yU3R5bGVzIiwibGV2ZWwiLCJsZWFmIiwiaXNMZWFmIiwiYWxpZ25JdGVtcyIsIndpZHRoIiwiZXhwYW5kZWQiLCJvcGVuIiwiY2xvc2VkIiwibmFtZSIsIm5hbWVTdHlsZXMiLCJfZG93biIsImNoaWxkcmVuIiwiY2hpbGQiLCJhZGQiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiX2dldENoaWxkcmVuIiwibGVuZ3RoIiwiX2hpZGVJY29uIiwidG9nZ2xlRXhwYW5kIiwiZW1pdCIsImFsbCIsInB1c2giLCJvcGFjaXR5IiwiY3Vyc29yIiwiX2V4cGFuZENoaWxkcmVuIiwiZXhwYW5kIiwiX2NvbGxhcHNlQ2hpbGRyZW4iLCJjb2xsYXBzZSIsImlubmVySFRNTCIsInNjcm9sbCIsInNjcm9sbFRvcCIsInJlbW92ZUNoaWxkcmVuIiwidGFyZ2V0IiwiY3VycmVudFRhcmdldCIsInBhcmVudE5vZGUiLCJkb3duIiwieCIsInBhZ2VYIiwieSIsInBhZ2VZIiwicG9zIiwidG9HbG9iYWwiLCJvZmZzZXQiLCJob2xkVGltZSIsImhvbGRUaW1lb3V0Iiwid2luZG93Iiwic2V0VGltZW91dCIsIl9ob2xkIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJfZWRpdCIsImVkaXQiLCJpbnB1dCIsInR5cGUiLCJjb21wdXRlZCIsImdldENvbXB1dGVkU3R5bGUiLCJib3hTaXppbmciLCJmb250RmFtaWx5IiwiZ2V0UHJvcGVydHlWYWx1ZSIsImZvbnRTaXplIiwidmFsdWUiLCJpbm5lclRleHQiLCJzZXRTZWxlY3Rpb25SYW5nZSIsImZvY3VzIiwibmFtZUNoYW5nZSIsIl9ob2xkQ2xvc2UiLCJjb2RlIiwicmVtb3ZlIiwidHJhdmVyc2UiLCJjbGVhclRpbWVvdXQiLCJpbnNlcnRCZWZvcmUiLCJfc2V0SW5kaWNhdG9yIiwib2xkIiwicG9zaXRpb24iLCJib3hTaGFkb3ciLCJsZWZ0IiwidG9wIiwiZHJhZ09wYWNpdHkiLCJtb3ZlIiwibW92aW5nIiwiZGlzdGFuY2UiLCJfcGlja3VwIiwiZW50cnkiLCJvZmZzZXRIZWlnaHQiLCJjbG9zZXN0IiwiZm91bmRBYm92ZSIsImluc2lkZSIsImFib3ZlIiwiZGlzdGFuY2VQb2ludEVsZW1lbnQiLCJkaXN0YW5jZUFib3ZlIiwiZm91bmRCZWxvdyIsImJlbG93IiwiZGlzdGFuY2VCZWxvdyIsIl9maW5kQ2xvc2VzdCIsIl9jaGVja1RocmVzaG9sZCIsIkluZmluaXR5IiwiX2dldEZpcnN0Q2hpbGQiLCJfZ2V0UGFyZW50IiwiX2dldExhc3RDaGlsZCIsImV4cGFuZE9uQ2xpY2siLCJfc2hvd0ljb24iLCJvZmZzZXRXaWR0aCIsIl9tb3ZlRGF0YSIsInNwbGljZSIsImluZGV4T2YiLCJnZXRDaGlsZEluZGV4IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLFNBQVNDLFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTUMsVUFBVUQsUUFBUSxTQUFSLENBQWhCOztBQUVBLElBQU1FLFdBQVdGLFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU1HLFFBQVFILFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBTUksUUFBUUosUUFBUSxTQUFSLENBQWQ7O0lBRU1LLEk7OztBQUVGOzs7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Ozs7Ozs7QUFRQSIsImZpbGUiOiJ0cmVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRXZlbnRzID0gcmVxdWlyZSgnZXZlbnRlbWl0dGVyMycpXHJcbmNvbnN0IGNsaWNrZWQgPSByZXF1aXJlKCdjbGlja2VkJylcclxuXHJcbmNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpXHJcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXHJcbmNvbnN0IGljb25zID0gcmVxdWlyZSgnLi9pY29ucycpXHJcblxyXG5jbGFzcyBUcmVlIGV4dGVuZHMgRXZlbnRzXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIFRyZWVcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7VHJlZURhdGF9IHRyZWUgLSBkYXRhIGZvciB0cmVlXHJcbiAgICAgKiBAcGFyYW0ge1RyZWVPcHRpb25zfSBbb3B0aW9uc11cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jaGlsZHJlbj1jaGlsZHJlbl0gbmFtZSBvZiB0cmVlIHBhcmFtZXRlciBjb250YWluaW5nIHRoZSBjaGlsZHJlblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zW3RoaXMub3B0aW9ucy5kYXRhXT1kYXRhXSBuYW1lIG9mIHRyZWUgcGFyYW1ldGVyIGNvbnRhaW5pbmcgdGhlIGRhdGFcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5wYXJlbnQ9cGFyZW50XSBuYW1lIG9mIHRyZWUgcGFyYW1ldGVyIGNvbnRhaW5pbmcgdGhlIHBhcmVudCBsaW5rIGluIGRhdGFcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lPW5hbWVdIG5hbWUgb2YgdHJlZSBwYXJhbWV0ZXIgY29udGFpbmluZyB0aGUgbmFtZSBpbiBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm1vdmU9dHJ1ZV0gYWxsb3cgdHJlZSB0byBiZSByZWFycmFuZ2VkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuaW5kZW50YXRpb249MjBdIG51bWJlciBvZiBwaXhlbHMgdG8gaW5kZW50IGZvciBlYWNoIGxldmVsXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudGhyZXNob2xkPTEwXSBudW1iZXIgb2YgcGl4ZWxzIHRvIG1vdmUgdG8gc3RhcnQgYSBkcmFnXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuaG9sZFRpbWU9MjAwMF0gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBiZWZvcmUgbmFtZSBjYW4gYmUgZWRpdGVkIChzZXQgdG8gMCB0byBkaXNhYmxlKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5leHBhbmRPbkNsaWNrPXRydWVdIGV4cGFuZCBhbmQgY29sbGFwc2Ugbm9kZSBvbiBjbGljayB3aXRob3V0IGRyYWdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5kcmFnT3BhY2l0eT0wLjc1XSBvcGFjaXR5IHNldHRpbmcgZm9yIGRyYWdnZWQgaXRlbVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0gW29wdGlvbnMubmFtZVN0eWxlc11cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLmluZGljYXRvclN0eWxlc11cclxuICAgICAqIEBmaXJlcyByZW5kZXJcclxuICAgICAqIEBmaXJlcyBjbGlja2VkXHJcbiAgICAgKiBAZmlyZXMgZXhwYW5kXHJcbiAgICAgKiBAZmlyZXMgY29sbGFwc2VcclxuICAgICAqIEBmaXJlcyBuYW1lLWNoYW5nZVxyXG4gICAgICogQGZpcmVzIG1vdmVcclxuICAgICAqIEBmaXJlcyBtb3ZlLXBlbmRpbmdcclxuICAgICAqIEBmaXJlcyB1cGRhdGVcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgdHJlZSwgb3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdXRpbHMub3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0cylcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XHJcbiAgICAgICAgdGhpcy5lbGVtZW50W3RoaXMub3B0aW9ucy5kYXRhXSA9IHRyZWVcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB0aGlzLl9tb3ZlKGUpKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgKGUpID0+IHRoaXMuX21vdmUoZSkpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHRoaXMuX3VwKGUpKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZSkgPT4gdGhpcy5fdXAoZSkpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKGUpID0+IHRoaXMuX3VwKGUpKVxyXG4gICAgICAgIHRoaXMuX2NyZWF0ZUluZGljYXRvcigpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogYWxsb3cgdHJlZSB0byBiZSByZWFycmFuZ2VkXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbnN9XHJcbiAgICAgKi9cclxuICAgIGdldCBtb3ZlKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm1vdmVcclxuICAgIH1cclxuICAgIHNldCBtb3ZlKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5tb3ZlID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICBfY3JlYXRlSW5kaWNhdG9yKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmluZGljYXRvciA9IHV0aWxzLmh0bWwoKVxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB1dGlscy5odG1sKHsgcGFyZW50OiB0aGlzLmluZGljYXRvciwgc3R5bGVzOiB7IGRpc3BsYXk6ICdmbGV4JyB9IH0pXHJcbiAgICAgICAgdGhpcy5pbmRpY2F0b3IuaW5kZW50YXRpb24gPSB1dGlscy5odG1sKHsgcGFyZW50OiBjb250ZW50IH0pXHJcbiAgICAgICAgdGhpcy5pbmRpY2F0b3IuaWNvbiA9IHV0aWxzLmh0bWwoeyBwYXJlbnQ6IGNvbnRlbnQsIGRlZmF1bHRTdHlsZXM6IHRoaXMub3B0aW9ucy5leHBhbmRTdHlsZXMsIHN0eWxlczogeyBoZWlnaHQ6IDAgfSB9KVxyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yLmxpbmUgPSB1dGlscy5odG1sKHtcclxuICAgICAgICAgICAgcGFyZW50OiBjb250ZW50LFxyXG4gICAgICAgICAgICBzdHlsZXM6IHRoaXMub3B0aW9ucy5pbmRpY2F0b3JTdHlsZXNcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGxlYWYoZGF0YSwgbGV2ZWwpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbGVhZiA9IHV0aWxzLmh0bWwoKVxyXG4gICAgICAgIGxlYWYuaXNMZWFmID0gdHJ1ZVxyXG4gICAgICAgIGxlYWZbdGhpcy5vcHRpb25zLmRhdGFdID0gZGF0YVxyXG4gICAgICAgIGxlYWYuY29udGVudCA9IHV0aWxzLmh0bWwoeyBwYXJlbnQ6IGxlYWYsIHN0eWxlczogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInIH0gfSlcclxuICAgICAgICBsZWFmLmluZGVudGF0aW9uID0gdXRpbHMuaHRtbCh7IHBhcmVudDogbGVhZi5jb250ZW50LCBzdHlsZXM6IHsgd2lkdGg6IGxldmVsICogdGhpcy5vcHRpb25zLmluZGVudGF0aW9uICsgJ3B4JyB9IH0pXHJcbiAgICAgICAgbGVhZi5pY29uID0gdXRpbHMuaHRtbCh7IHBhcmVudDogbGVhZi5jb250ZW50LCBodG1sOiBkYXRhW3RoaXMub3B0aW9ucy5leHBhbmRlZF0gPyBpY29ucy5vcGVuIDogaWNvbnMuY2xvc2VkLCBzdHlsZXM6IHRoaXMub3B0aW9ucy5leHBhbmRTdHlsZXMgfSlcclxuICAgICAgICBsZWFmLm5hbWUgPSB1dGlscy5odG1sKHsgcGFyZW50OiBsZWFmLmNvbnRlbnQsIGh0bWw6IGRhdGFbdGhpcy5vcHRpb25zLm5hbWVdLCBzdHlsZXM6IHRoaXMub3B0aW9ucy5uYW1lU3R5bGVzIH0pXHJcblxyXG4gICAgICAgIGxlYWYubmFtZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4gdGhpcy5fZG93bihlKSlcclxuICAgICAgICBsZWFmLm5hbWUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKSA9PiB0aGlzLl9kb3duKGUpKVxyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGRhdGFbdGhpcy5vcHRpb25zLmNoaWxkcmVuXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkZCA9IHRoaXMubGVhZihjaGlsZCwgbGV2ZWwgKyAxKVxyXG4gICAgICAgICAgICBhZGRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudCA9IGRhdGFcclxuICAgICAgICAgICAgbGVhZi5hcHBlbmRDaGlsZChhZGQpXHJcbiAgICAgICAgICAgIGlmICghZGF0YVt0aGlzLm9wdGlvbnMuZXhwYW5kZWRdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhZGQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9nZXRDaGlsZHJlbihsZWFmLCB0cnVlKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9oaWRlSWNvbihsZWFmKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjbGlja2VkKGxlYWYuaWNvbiwgKCkgPT4gdGhpcy50b2dnbGVFeHBhbmQobGVhZikpXHJcbiAgICAgICAgdGhpcy5lbWl0KCdyZW5kZXInLCBsZWFmLCB0aGlzKVxyXG4gICAgICAgIHJldHVybiBsZWFmXHJcbiAgICB9XHJcblxyXG4gICAgX2dldENoaWxkcmVuKGxlYWYsIGFsbClcclxuICAgIHtcclxuICAgICAgICBsZWFmID0gbGVhZiB8fCB0aGlzLmVsZW1lbnRcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgbGVhZi5jaGlsZHJlbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5pc0xlYWYgJiYgKGFsbCB8fCBjaGlsZC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGlsZHJlblxyXG4gICAgfVxyXG5cclxuICAgIF9oaWRlSWNvbihsZWFmKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChsZWFmLmlzTGVhZilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlYWYuaWNvbi5zdHlsZS5vcGFjaXR5ID0gMFxyXG4gICAgICAgICAgICBsZWFmLmljb24uc3R5bGUuY3Vyc29yID0gJ3Vuc2V0J1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfc2hvd0ljb24obGVhZilcclxuICAgIHtcclxuICAgICAgICBpZiAobGVhZi5pc0xlYWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWFmLmljb24uc3R5bGUub3BhY2l0eSA9IDFcclxuICAgICAgICAgICAgbGVhZi5pY29uLnN0eWxlLmN1cnNvciA9IHRoaXMub3B0aW9ucy5leHBhbmRTdHlsZXMuY3Vyc29yXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cGFuZEFsbCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fZXhwYW5kQ2hpbGRyZW4odGhpcy5lbGVtZW50KVxyXG4gICAgfVxyXG5cclxuICAgIF9leHBhbmRDaGlsZHJlbihsZWFmKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX2dldENoaWxkcmVuKGxlYWYsIHRydWUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoY2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZENoaWxkcmVuKGNoaWxkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb2xsYXBzZUFsbCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fY29sbGFwc2VDaGlsZHJlbih0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIF9jb2xsYXBzZUNoaWxkcmVuKGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fZ2V0Q2hpbGRyZW4obGVhZiwgdHJ1ZSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlKGNoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLl9jb2xsYXBzZUNoaWxkcmVuKGNoaWxkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVFeHBhbmQobGVhZilcclxuICAgIHtcclxuICAgICAgICBpZiAobGVhZi5pY29uLnN0eWxlLm9wYWNpdHkgIT09ICcwJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsZWFmW3RoaXMub3B0aW9ucy5kYXRhXVt0aGlzLm9wdGlvbnMuZXhwYW5kZWRdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxhcHNlKGxlYWYpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGFuZChsZWFmKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cGFuZChsZWFmKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChsZWFmLmlzTGVhZilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fZ2V0Q2hpbGRyZW4obGVhZiwgdHJ1ZSlcclxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxlYWZbdGhpcy5vcHRpb25zLmRhdGFdW3RoaXMub3B0aW9ucy5leHBhbmRlZF0gPSB0cnVlXHJcbiAgICAgICAgICAgICAgICBsZWFmLmljb24uaW5uZXJIVE1MID0gaWNvbnMub3BlblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdleHBhbmQnLCBsZWFmLCB0aGlzKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsZWFmLCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbGxhcHNlKGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGxlYWYuaXNMZWFmKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRDaGlsZHJlbihsZWFmLCB0cnVlKVxyXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZWFmW3RoaXMub3B0aW9ucy5kYXRhXVt0aGlzLm9wdGlvbnMuZXhwYW5kZWRdID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIGxlYWYuaWNvbi5pbm5lckhUTUwgPSBpY29ucy5jbG9zZWRcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY29sbGFwc2UnLCBsZWFmLCB0aGlzKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsZWFmLCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCB0aGlzIGFmdGVyIHRyZWUncyBkYXRhIGhhcyBiZWVuIHVwZGF0ZWQgb3V0c2lkZSBvZiB0aGlzIGxpYnJhcnlcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBzY3JvbGwgPSB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wXHJcbiAgICAgICAgdXRpbHMucmVtb3ZlQ2hpbGRyZW4odGhpcy5lbGVtZW50KVxyXG4gICAgICAgIGZvciAobGV0IGxlYWYgb2YgdGhpcy5lbGVtZW50W3RoaXMub3B0aW9ucy5kYXRhXVt0aGlzLm9wdGlvbnMuY2hpbGRyZW5dKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgYWRkID0gdGhpcy5sZWFmKGxlYWYsIDApXHJcbiAgICAgICAgICAgIGFkZFt0aGlzLm9wdGlvbnMuZGF0YV0ucGFyZW50ID0gdGhpcy5lbGVtZW50W3RoaXMub3B0aW9ucy5kYXRhXVxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoYWRkKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gc2Nyb2xsICsgJ3B4J1xyXG4gICAgfVxyXG5cclxuICAgIF9kb3duKGUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlXHJcbiAgICAgICAgdGhpcy5kb3duID0geyB4OiBlLnBhZ2VYLCB5OiBlLnBhZ2VZIH1cclxuICAgICAgICBjb25zdCBwb3MgPSB1dGlscy50b0dsb2JhbCh0aGlzLnRhcmdldClcclxuICAgICAgICB0aGlzLm9mZnNldCA9IHsgeDogZS5wYWdlWCAtIHBvcy54LCB5OiBlLnBhZ2VZIC0gcG9zLnkgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaG9sZFRpbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmhvbGRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5faG9sZCgpLCB0aGlzLm9wdGlvbnMuaG9sZFRpbWUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICBfaG9sZCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5ob2xkVGltZW91dCA9IG51bGxcclxuICAgICAgICB0aGlzLl9lZGl0KHRoaXMudGFyZ2V0KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZWRpdCB0aGUgbmFtZSBlbnRyeSB1c2luZyB0aGUgZGF0YVxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgZWxlbWVudCBvZiBsZWFmXHJcbiAgICAgKi9cclxuICAgIGVkaXREYXRhKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRDaGlsZHJlbihudWxsLCB0cnVlKVxyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGEgPT09IGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdChjaGlsZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVkaXQgdGhlIG5hbWUgZW50cnkgdXNpbmcgdGhlIGNyZWF0ZWQgZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbGVhZlxyXG4gICAgICovXHJcbiAgICBlZGl0KGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5lZGl0ID0gbGVhZlxyXG4gICAgICAgIHRoaXMuaW5wdXQgPSB1dGlscy5odG1sKHsgcGFyZW50OiB0aGlzLmVkaXQubmFtZS5wYXJlbnROb2RlLCB0eXBlOiAnaW5wdXQnLCBzdHlsZXM6IHRoaXMub3B0aW9ucy5uYW1lU3R5bGVzIH0pXHJcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXQubmFtZSlcclxuICAgICAgICB0aGlzLmlucHV0LnN0eWxlLmJveFNpemluZyA9ICdjb250ZW50LWJveCdcclxuICAgICAgICB0aGlzLmlucHV0LnN0eWxlLmZvbnRGYW1pbHkgPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LWZhbWlseScpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5zdHlsZS5mb250U2l6ZSA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtc2l6ZScpXHJcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHRoaXMuZWRpdC5uYW1lLmlubmVyVGV4dFxyXG4gICAgICAgIHRoaXMuaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgdGhpcy5pbnB1dC52YWx1ZS5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5mb2N1cygpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lQ2hhbmdlKHRoaXMuZWRpdCwgdGhpcy5pbnB1dC52YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5faG9sZENsb3NlKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09ICdFc2NhcGUnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ob2xkQ2xvc2UoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09ICdFbnRlcicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZUNoYW5nZSh0aGlzLmVkaXQsIHRoaXMuaW5wdXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ob2xkQ2xvc2UoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmVkaXQubmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgX2hvbGRDbG9zZSgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWRpdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQucmVtb3ZlKClcclxuICAgICAgICAgICAgdGhpcy5lZGl0Lm5hbWUuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgdGhpcy5lZGl0ID0gdGhpcy5pbnB1dCA9IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZUNoYW5nZShsZWFmLCBuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGxlYWZbdGhpcy5vcHRpb25zLmRhdGFdLm5hbWUgPSB0aGlzLmlucHV0LnZhbHVlXHJcbiAgICAgICAgbGVhZi5uYW1lLmlubmVySFRNTCA9IG5hbWVcclxuICAgICAgICB0aGlzLmVtaXQoJ25hbWUtY2hhbmdlJywgbGVhZiwgdGhpcy5pbnB1dC52YWx1ZSwgdGhpcylcclxuICAgICAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIGxlYWYsIHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgX3NldEluZGljYXRvcigpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGxldmVsID0gMFxyXG4gICAgICAgIGxldCB0cmF2ZXJzZSA9IHRoaXMuaW5kaWNhdG9yLnBhcmVudE5vZGVcclxuICAgICAgICB3aGlsZSAodHJhdmVyc2UgIT09IHRoaXMuZWxlbWVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldmVsKytcclxuICAgICAgICAgICAgdHJhdmVyc2UgPSB0cmF2ZXJzZS5wYXJlbnROb2RlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yLmluZGVudGF0aW9uLnN0eWxlLndpZHRoID0gbGV2ZWwgKiB0aGlzLm9wdGlvbnMuaW5kZW50YXRpb24gKyAncHgnXHJcbiAgICB9XHJcblxyXG4gICAgX3BpY2t1cCgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZFRpbWVvdXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaG9sZFRpbWVvdXQpXHJcbiAgICAgICAgICAgIHRoaXMuaG9sZFRpbWVvdXQgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW1pdCgnbW92ZS1wZW5kaW5nJywgdGhpcy50YXJnZXQsIHRoaXMpXHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy50YXJnZXQucGFyZW50Tm9kZVxyXG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMudGFyZ2V0KVxyXG4gICAgICAgIHRoaXMuX3NldEluZGljYXRvcigpXHJcbiAgICAgICAgY29uc3QgcG9zID0gdXRpbHMudG9HbG9iYWwodGhpcy50YXJnZXQpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRhcmdldClcclxuICAgICAgICB0aGlzLm9sZCA9IHtcclxuICAgICAgICAgICAgb3BhY2l0eTogdGhpcy50YXJnZXQuc3R5bGUub3BhY2l0eSB8fCAndW5zZXQnLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy50YXJnZXQuc3R5bGUucG9zaXRpb24gfHwgJ3Vuc2V0JyxcclxuICAgICAgICAgICAgYm94U2hhZG93OiB0aGlzLnRhcmdldC5uYW1lLnN0eWxlLmJveFNoYWRvdyB8fCAndW5zZXQnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Lm5hbWUuc3R5bGUuYm94U2hhZG93ID0gJzNweCAzcHggNXB4IHJnYmEoMCwwLDAsMC4yNSknXHJcbiAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUubGVmdCA9IHBvcy54ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRvcCA9IHBvcy55ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSB0aGlzLm9wdGlvbnMuZHJhZ09wYWNpdHlcclxuICAgICAgICBpZiAodGhpcy5fZ2V0Q2hpbGRyZW4ocGFyZW50LCB0cnVlKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9oaWRlSWNvbihwYXJlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9jaGVja1RocmVzaG9sZChlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLm1vdmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodXRpbHMuZGlzdGFuY2UodGhpcy5kb3duLngsIHRoaXMuZG93bi55LCBlLnBhZ2VYLCBlLnBhZ2VZKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9waWNrdXAoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9maW5kQ2xvc2VzdChlLCBlbnRyeSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb3MgPSB1dGlscy50b0dsb2JhbChlbnRyeS5uYW1lKVxyXG4gICAgICAgIGlmIChwb3MueSArIGVudHJ5Lm5hbWUub2Zmc2V0SGVpZ2h0IC8gMiA8PSBlLnBhZ2VZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsb3Nlc3QuZm91bmRBYm92ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzLmluc2lkZShlLnBhZ2VYLCBlLnBhZ2VZLCBlbnRyeS5uYW1lKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuZm91bmRBYm92ZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUgPSBlbnRyeVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdXRpbHMuZGlzdGFuY2VQb2ludEVsZW1lbnQoZS5wYWdlWCwgZS5wYWdlWSwgZW50cnkubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCB0aGlzLmNsb3Nlc3QuZGlzdGFuY2VBYm92ZSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5kaXN0YW5jZUFib3ZlID0gZGlzdGFuY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlID0gZW50cnlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuY2xvc2VzdC5mb3VuZEJlbG93KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHV0aWxzLmluc2lkZShlLnBhZ2VYLCBlLnBhZ2VZLCBlbnRyeS5uYW1lKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmZvdW5kQmVsb3cgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYmVsb3cgPSBlbnRyeVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB1dGlscy5kaXN0YW5jZVBvaW50RWxlbWVudChlLnBhZ2VYLCBlLnBhZ2VZLCBlbnRyeS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgdGhpcy5jbG9zZXN0LmRpc3RhbmNlQmVsb3cpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmRpc3RhbmNlQmVsb3cgPSBkaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5iZWxvdyA9IGVudHJ5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fZ2V0Q2hpbGRyZW4oZW50cnkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZmluZENsb3Nlc3QoZSwgY2hpbGQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRGaXJzdENoaWxkKGVsZW1lbnQsIGFsbClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldENoaWxkcmVuKGVsZW1lbnQsIGFsbClcclxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRMYXN0Q2hpbGQoZWxlbWVudCwgYWxsKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fZ2V0Q2hpbGRyZW4oZWxlbWVudCwgYWxsKVxyXG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2dldFBhcmVudChlbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcclxuICAgICAgICB3aGlsZSAoZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50XHJcbiAgICB9XHJcblxyXG4gICAgX21vdmUoZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgJiYgdGhpcy5fY2hlY2tUaHJlc2hvbGQoZSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmluZGljYXRvci5yZW1vdmUoKVxyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5sZWZ0ID0gZS5wYWdlWCAtIHRoaXMub2Zmc2V0LnggKyAncHgnXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRvcCA9IGUucGFnZVkgLSB0aGlzLm9mZnNldC55ICsgJ3B4J1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdXRpbHMudG9HbG9iYWwodGhpcy50YXJnZXQubmFtZSkueFxyXG4gICAgICAgICAgICB0aGlzLmNsb3Nlc3QgPSB7IGRpc3RhbmNlQWJvdmU6IEluZmluaXR5LCBkaXN0YW5jZUJlbG93OiBJbmZpbml0eSB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX2dldENoaWxkcmVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbmRDbG9zZXN0KGUsIGNoaWxkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbG9zZXN0LmFib3ZlICYmICF0aGlzLmNsb3Nlc3QuYmVsb3cpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5jbG9zZXN0LmFib3ZlKSAvLyBudWxsIFtdIGxlYWZcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLmluZGljYXRvciwgdGhpcy5fZ2V0Rmlyc3RDaGlsZCh0aGlzLmVsZW1lbnQpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLmNsb3Nlc3QuYmVsb3cpIC8vIGxlYWYgW10gbnVsbFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gdXRpbHMudG9HbG9iYWwodGhpcy5jbG9zZXN0LmFib3ZlLm5hbWUpXHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IHBvcy54ICsgdGhpcy5vcHRpb25zLmluZGVudGF0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5hYm92ZS5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuX2dldEZpcnN0Q2hpbGQodGhpcy5jbG9zZXN0LmFib3ZlLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHggPiBwb3MueCAtIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jbG9zZXN0LmFib3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCAhPT0gdGhpcy5lbGVtZW50ICYmIHggPCBwb3MueClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHRoaXMuX2dldFBhcmVudChwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQgIT09IHRoaXMuZWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zID0gdXRpbHMudG9HbG9iYWwocGFyZW50Lm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuaW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmNsb3Nlc3QuYmVsb3cucGFyZW50Tm9kZSA9PT0gdGhpcy5jbG9zZXN0LmFib3ZlKSAvLyBwYXJlbnQgW10gY2hpbGRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlLmluc2VydEJlZm9yZSh0aGlzLmluZGljYXRvciwgdGhpcy5jbG9zZXN0LmJlbG93KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY2xvc2VzdC5iZWxvdy5wYXJlbnROb2RlID09PSB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZSkgLy8gc2libGluZyBbXSBzaWJsaW5nXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IHV0aWxzLnRvR2xvYmFsKHRoaXMuY2xvc2VzdC5hYm92ZS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgaWYgKHggPiBwb3MueCArIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLl9nZXRMYXN0Q2hpbGQodGhpcy5jbG9zZXN0LmFib3ZlLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuY2xvc2VzdC5iZWxvdylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIC8vIGNoaWxkIFtdIHBhcmVudF5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IHV0aWxzLnRvR2xvYmFsKHRoaXMuY2xvc2VzdC5hYm92ZS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgaWYgKHggPiBwb3MueCArIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLl9nZXRMYXN0Q2hpbGQodGhpcy5jbG9zZXN0LmFib3ZlLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHggPiBwb3MueCAtIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHggPCB1dGlscy50b0dsb2JhbCh0aGlzLmNsb3Nlc3QuYmVsb3cubmFtZSkueClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYmVsb3cucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuY2xvc2VzdC5iZWxvdylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jbG9zZXN0LmFib3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudC5wYXJlbnROb2RlICE9PSB0aGlzLmNsb3Nlc3QuYmVsb3cucGFyZW50Tm9kZSAmJiB4IDwgcG9zLngpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnQocGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSB1dGlscy50b0dsb2JhbChwYXJlbnQubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuaW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3NldEluZGljYXRvcigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF91cChlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb3ZpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwYW5kT25DbGljaylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUV4cGFuZCh0aGlzLnRhcmdldClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY2xpY2tlZCcsIHRoaXMudGFyZ2V0LCBlLCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3IucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy50YXJnZXQsIHRoaXMuaW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmQodGhpcy5pbmRpY2F0b3IucGFyZW50Tm9kZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3dJY29uKHRoaXMuaW5kaWNhdG9yLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5wb3NpdGlvbiA9IHRoaXMub2xkLnBvc2l0aW9uID09PSAndW5zZXQnID8gJycgOiB0aGlzLm9sZC5wb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQubmFtZS5zdHlsZS5ib3hTaGFkb3cgPSB0aGlzLm9sZC5ib3hTaGFkb3cgPT09ICd1bnNldCcgPyAnJyA6IHRoaXMub2xkLmJveFNoYWRvd1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUub3BhY2l0eSA9IHRoaXMub2xkLm9wYWNpdHkgPT09ICd1bnNldCcgPyAnJyA6IHRoaXMub2xkLm9wYWNpdHlcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LmluZGVudGF0aW9uLnN0eWxlLndpZHRoID0gdGhpcy5pbmRpY2F0b3IuaW5kZW50YXRpb24ub2Zmc2V0V2lkdGggKyAncHgnXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljYXRvci5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW92ZURhdGEoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdtb3ZlJywgdGhpcy50YXJnZXQsIHRoaXMpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudGFyZ2V0LCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvbGRUaW1lb3V0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaG9sZFRpbWVvdXQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvbGRUaW1lb3V0ID0gbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5tb3ZpbmcgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9tb3ZlRGF0YSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UodGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMudGFyZ2V0W3RoaXMub3B0aW9ucy5kYXRhXSksIDEpXHJcbiAgICAgICAgdGhpcy50YXJnZXQucGFyZW50Tm9kZVt0aGlzLm9wdGlvbnMuZGF0YV0uY2hpbGRyZW4uc3BsaWNlKHV0aWxzLmdldENoaWxkSW5kZXgodGhpcy50YXJnZXQucGFyZW50Tm9kZSwgdGhpcy50YXJnZXQpLCAwLCB0aGlzLnRhcmdldFt0aGlzLm9wdGlvbnMuZGF0YV0pXHJcbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudCA9IHRoaXMudGFyZ2V0LnBhcmVudE5vZGVbdGhpcy5vcHRpb25zLmRhdGFdXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJlZVxyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRyZWV+VHJlZURhdGFcclxuICogQHByb3BlcnR5IHtUcmVlRGF0YVtdfSBjaGlsZHJlblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZVxyXG4gKiBAcHJvcGVydHkge3BhcmVudH0gW3BhcmVudF0gaWYgbm90IHByb3ZpZGVkIHRoZW4gd2lsbCB0cmF2ZXJzZSB0cmVlIHRvIGZpbmQgcGFyZW50XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gZXhwYW5kIGlzIGNhbGxlZCBlaXRoZXIgdGhyb3VnaCBVSSBpbnRlcmFjdGlvbiBvciBUcmVlLmV4cGFuZCgpXHJcbiAgKiBAZXZlbnQgVHJlZX5leHBhbmRcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBjb2xsYXBzZSBpcyBjYWxsZWQgZWl0aGVyIHRocm91Z2ggVUkgaW50ZXJhY3Rpb24gb3IgVHJlZS5leHBhbmQoKVxyXG4gICogQGV2ZW50IFRyZWV+Y29sbGFwc2VcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBuYW1lIGlzIGNoYW5nZSBlaXRoZXIgdGhyb3VnaCBVSSBpbnRlcmFjdGlvbiBvciBUcmVlLm5hbWVDaGFuZ2UoKVxyXG4gICogQGV2ZW50IFRyZWV+bmFtZS1jaGFuZ2VcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lXHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmIGlzIHBpY2tlZCB1cCB0aHJvdWdoIFVJIGludGVyYWN0aW9uXHJcbiAgKiBAZXZlbnQgVHJlZX5tb3ZlLXBlbmRpbmdcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBhIGxlYWYncyBsb2NhdGlvbiBpcyBjaGFuZ2VkXHJcbiAgKiBAZXZlbnQgVHJlZX5tb3ZlXHJcbiAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdHJlZSBlbGVtZW50XHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmIGlzIGNsaWNrZWQgYW5kIG5vdCBkcmFnZ2VkIG9yIGhlbGRcclxuICAqIEBldmVudCBUcmVlfmNsaWNrZWRcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VUlFdmVudH0gZXZlbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBhIGxlYWYgaXMgY2hhbmdlZCAoaS5lLiwgbW92ZWQsIG5hbWUtY2hhbmdlKVxyXG4gICogQGV2ZW50IFRyZWV+dXBkYXRlXHJcbiAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdHJlZSBlbGVtZW50XHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmJ3MgZGl2IGlzIGNyZWF0ZWRcclxuICAqIEBldmVudCBUcmVlfnJlbmRlclxyXG4gICogQHR5cGUge29iamVjdH1cclxuICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRyZWUgZWxlbWVudFxyXG4gICogQHByb3BlcnR5IHtUcmVlfSBUcmVlXHJcbiAgKi8iXX0=