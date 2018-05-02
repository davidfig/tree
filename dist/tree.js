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
            this.edit(this.target);
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

            this.editing = leaf;
            this.input = utils.html({ parent: this.editing.name.parentNode, type: 'input', styles: this.options.nameStyles });
            var computed = window.getComputedStyle(this.editing.name);
            this.input.style.boxSizing = 'content-box';
            this.input.style.fontFamily = computed.getPropertyValue('font-family');
            this.input.style.fontSize = computed.getPropertyValue('font-size');
            this.input.value = this.editing.name.innerText;
            this.input.setSelectionRange(0, this.input.value.length);
            this.input.focus();
            this.input.addEventListener('update', function () {
                _this4.nameChange(_this4.editing, _this4.input.value);
                _this4._holdClose();
            });
            this.input.addEventListener('keyup', function (e) {
                if (e.code === 'Escape') {
                    _this4._holdClose();
                }
                if (e.code === 'Enter') {
                    _this4.nameChange(_this4.editing, _this4.input.value);
                    _this4._holdClose();
                }
            });
            this.editing.name.style.display = 'none';
            this.target = null;
        }
    }, {
        key: '_holdClose',
        value: function _holdClose() {
            if (this.editing) {
                this.input.remove();
                this.editing.name.style.display = 'block';
                this.editing = this.input = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90cmVlLmpzIl0sIm5hbWVzIjpbIkV2ZW50cyIsInJlcXVpcmUiLCJjbGlja2VkIiwiZGVmYXVsdHMiLCJ1dGlscyIsImljb25zIiwiVHJlZSIsImVsZW1lbnQiLCJ0cmVlIiwib3B0aW9ucyIsImRhdGEiLCJkb2N1bWVudCIsImJvZHkiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIl9tb3ZlIiwiX3VwIiwiX2NyZWF0ZUluZGljYXRvciIsInVwZGF0ZSIsImluZGljYXRvciIsImh0bWwiLCJjb250ZW50IiwicGFyZW50Iiwic3R5bGVzIiwiZGlzcGxheSIsImluZGVudGF0aW9uIiwiaWNvbiIsImRlZmF1bHRTdHlsZXMiLCJleHBhbmRTdHlsZXMiLCJoZWlnaHQiLCJsaW5lIiwiaW5kaWNhdG9yU3R5bGVzIiwibGV2ZWwiLCJsZWFmIiwiaXNMZWFmIiwiYWxpZ25JdGVtcyIsIndpZHRoIiwiZXhwYW5kZWQiLCJvcGVuIiwiY2xvc2VkIiwibmFtZSIsIm5hbWVTdHlsZXMiLCJfZG93biIsImNoaWxkcmVuIiwiY2hpbGQiLCJhZGQiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiX2dldENoaWxkcmVuIiwibGVuZ3RoIiwiX2hpZGVJY29uIiwidG9nZ2xlRXhwYW5kIiwiZW1pdCIsImFsbCIsInB1c2giLCJvcGFjaXR5IiwiY3Vyc29yIiwiX2V4cGFuZENoaWxkcmVuIiwiZXhwYW5kIiwiX2NvbGxhcHNlQ2hpbGRyZW4iLCJjb2xsYXBzZSIsImlubmVySFRNTCIsInNjcm9sbCIsInNjcm9sbFRvcCIsInJlbW92ZUNoaWxkcmVuIiwidGFyZ2V0IiwiY3VycmVudFRhcmdldCIsInBhcmVudE5vZGUiLCJkb3duIiwieCIsInBhZ2VYIiwieSIsInBhZ2VZIiwicG9zIiwidG9HbG9iYWwiLCJvZmZzZXQiLCJob2xkVGltZSIsImhvbGRUaW1lb3V0Iiwid2luZG93Iiwic2V0VGltZW91dCIsIl9ob2xkIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJlZGl0IiwiZWRpdGluZyIsImlucHV0IiwidHlwZSIsImNvbXB1dGVkIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImJveFNpemluZyIsImZvbnRGYW1pbHkiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiZm9udFNpemUiLCJ2YWx1ZSIsImlubmVyVGV4dCIsInNldFNlbGVjdGlvblJhbmdlIiwiZm9jdXMiLCJuYW1lQ2hhbmdlIiwiX2hvbGRDbG9zZSIsImNvZGUiLCJyZW1vdmUiLCJ0cmF2ZXJzZSIsImNsZWFyVGltZW91dCIsImluc2VydEJlZm9yZSIsIl9zZXRJbmRpY2F0b3IiLCJvbGQiLCJwb3NpdGlvbiIsImJveFNoYWRvdyIsImxlZnQiLCJ0b3AiLCJkcmFnT3BhY2l0eSIsIm1vdmUiLCJtb3ZpbmciLCJkaXN0YW5jZSIsIl9waWNrdXAiLCJlbnRyeSIsIm9mZnNldEhlaWdodCIsImNsb3Nlc3QiLCJmb3VuZEFib3ZlIiwiaW5zaWRlIiwiYWJvdmUiLCJkaXN0YW5jZVBvaW50RWxlbWVudCIsImRpc3RhbmNlQWJvdmUiLCJmb3VuZEJlbG93IiwiYmVsb3ciLCJkaXN0YW5jZUJlbG93IiwiX2ZpbmRDbG9zZXN0IiwiX2NoZWNrVGhyZXNob2xkIiwiSW5maW5pdHkiLCJfZ2V0Rmlyc3RDaGlsZCIsIl9nZXRQYXJlbnQiLCJfZ2V0TGFzdENoaWxkIiwiZXhwYW5kT25DbGljayIsIl9zaG93SWNvbiIsIm9mZnNldFdpZHRoIiwiX21vdmVEYXRhIiwic3BsaWNlIiwiaW5kZXhPZiIsImdldENoaWxkSW5kZXgiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTUEsU0FBU0MsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNQyxVQUFVRCxRQUFRLFNBQVIsQ0FBaEI7O0FBRUEsSUFBTUUsV0FBV0YsUUFBUSxZQUFSLENBQWpCO0FBQ0EsSUFBTUcsUUFBUUgsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFNSSxRQUFRSixRQUFRLFNBQVIsQ0FBZDs7SUFFTUssSTs7O0FBRUY7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O0FBU0E7Ozs7Ozs7O0FBUUEiLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50ZW1pdHRlcjMnKVxyXG5jb25zdCBjbGlja2VkID0gcmVxdWlyZSgnY2xpY2tlZCcpXHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKVxyXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxyXG5jb25zdCBpY29ucyA9IHJlcXVpcmUoJy4vaWNvbnMnKVxyXG5cclxuY2xhc3MgVHJlZSBleHRlbmRzIEV2ZW50c1xyXG57XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBUcmVlXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge1RyZWVEYXRhfSB0cmVlIC0gZGF0YSBmb3IgdHJlZVxyXG4gICAgICogQHBhcmFtIHtUcmVlT3B0aW9uc30gW29wdGlvbnNdXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY2hpbGRyZW49Y2hpbGRyZW5dIG5hbWUgb2YgdHJlZSBwYXJhbWV0ZXIgY29udGFpbmluZyB0aGUgY2hpbGRyZW5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uc1t0aGlzLm9wdGlvbnMuZGF0YV09ZGF0YV0gbmFtZSBvZiB0cmVlIHBhcmFtZXRlciBjb250YWluaW5nIHRoZSBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucGFyZW50PXBhcmVudF0gbmFtZSBvZiB0cmVlIHBhcmFtZXRlciBjb250YWluaW5nIHRoZSBwYXJlbnQgbGluayBpbiBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT1uYW1lXSBuYW1lIG9mIHRyZWUgcGFyYW1ldGVyIGNvbnRhaW5pbmcgdGhlIG5hbWUgaW4gZGF0YVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5tb3ZlPXRydWVdIGFsbG93IHRyZWUgdG8gYmUgcmVhcnJhbmdlZFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmluZGVudGF0aW9uPTIwXSBudW1iZXIgb2YgcGl4ZWxzIHRvIGluZGVudCBmb3IgZWFjaCBsZXZlbFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD0xMF0gbnVtYmVyIG9mIHBpeGVscyB0byBtb3ZlIHRvIHN0YXJ0IGEgZHJhZ1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmhvbGRUaW1lPTIwMDBdIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmVmb3JlIG5hbWUgY2FuIGJlIGVkaXRlZCAoc2V0IHRvIDAgdG8gZGlzYWJsZSlcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZXhwYW5kT25DbGljaz10cnVlXSBleHBhbmQgYW5kIGNvbGxhcHNlIG5vZGUgb24gY2xpY2sgd2l0aG91dCBkcmFnXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZHJhZ09wYWNpdHk9MC43NV0gb3BhY2l0eSBzZXR0aW5nIGZvciBkcmFnZ2VkIGl0ZW1cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLm5hbWVTdHlsZXNdXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBbb3B0aW9ucy5pbmRpY2F0b3JTdHlsZXNdXHJcbiAgICAgKiBAZmlyZXMgcmVuZGVyXHJcbiAgICAgKiBAZmlyZXMgY2xpY2tlZFxyXG4gICAgICogQGZpcmVzIGV4cGFuZFxyXG4gICAgICogQGZpcmVzIGNvbGxhcHNlXHJcbiAgICAgKiBAZmlyZXMgbmFtZS1jaGFuZ2VcclxuICAgICAqIEBmaXJlcyBtb3ZlXHJcbiAgICAgKiBAZmlyZXMgbW92ZS1wZW5kaW5nXHJcbiAgICAgKiBAZmlyZXMgdXBkYXRlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHRyZWUsIG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHV0aWxzLm9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxyXG4gICAgICAgIHRoaXMuZWxlbWVudFt0aGlzLm9wdGlvbnMuZGF0YV0gPSB0cmVlXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4gdGhpcy5fbW92ZShlKSlcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChlKSA9PiB0aGlzLl9tb3ZlKGUpKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChlKSA9PiB0aGlzLl91cChlKSlcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGUpID0+IHRoaXMuX3VwKGUpKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKSA9PiB0aGlzLl91cChlKSlcclxuICAgICAgICB0aGlzLl9jcmVhdGVJbmRpY2F0b3IoKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFsbG93IHRyZWUgdG8gYmUgcmVhcnJhbmdlZFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW5zfVxyXG4gICAgICovXHJcbiAgICBnZXQgbW92ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tb3ZlXHJcbiAgICB9XHJcbiAgICBzZXQgbW92ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubW92ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgX2NyZWF0ZUluZGljYXRvcigpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pbmRpY2F0b3IgPSB1dGlscy5odG1sKClcclxuICAgICAgICBjb25zdCBjb250ZW50ID0gdXRpbHMuaHRtbCh7IHBhcmVudDogdGhpcy5pbmRpY2F0b3IsIHN0eWxlczogeyBkaXNwbGF5OiAnZmxleCcgfSB9KVxyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yLmluZGVudGF0aW9uID0gdXRpbHMuaHRtbCh7IHBhcmVudDogY29udGVudCB9KVxyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yLmljb24gPSB1dGlscy5odG1sKHsgcGFyZW50OiBjb250ZW50LCBkZWZhdWx0U3R5bGVzOiB0aGlzLm9wdGlvbnMuZXhwYW5kU3R5bGVzLCBzdHlsZXM6IHsgaGVpZ2h0OiAwIH0gfSlcclxuICAgICAgICB0aGlzLmluZGljYXRvci5saW5lID0gdXRpbHMuaHRtbCh7XHJcbiAgICAgICAgICAgIHBhcmVudDogY29udGVudCxcclxuICAgICAgICAgICAgc3R5bGVzOiB0aGlzLm9wdGlvbnMuaW5kaWNhdG9yU3R5bGVzXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBsZWFmKGRhdGEsIGxldmVsKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxlYWYgPSB1dGlscy5odG1sKClcclxuICAgICAgICBsZWFmLmlzTGVhZiA9IHRydWVcclxuICAgICAgICBsZWFmW3RoaXMub3B0aW9ucy5kYXRhXSA9IGRhdGFcclxuICAgICAgICBsZWFmLmNvbnRlbnQgPSB1dGlscy5odG1sKHsgcGFyZW50OiBsZWFmLCBzdHlsZXM6IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9IH0pXHJcbiAgICAgICAgbGVhZi5pbmRlbnRhdGlvbiA9IHV0aWxzLmh0bWwoeyBwYXJlbnQ6IGxlYWYuY29udGVudCwgc3R5bGVzOiB7IHdpZHRoOiBsZXZlbCAqIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbiArICdweCcgfSB9KVxyXG4gICAgICAgIGxlYWYuaWNvbiA9IHV0aWxzLmh0bWwoeyBwYXJlbnQ6IGxlYWYuY29udGVudCwgaHRtbDogZGF0YVt0aGlzLm9wdGlvbnMuZXhwYW5kZWRdID8gaWNvbnMub3BlbiA6IGljb25zLmNsb3NlZCwgc3R5bGVzOiB0aGlzLm9wdGlvbnMuZXhwYW5kU3R5bGVzIH0pXHJcbiAgICAgICAgbGVhZi5uYW1lID0gdXRpbHMuaHRtbCh7IHBhcmVudDogbGVhZi5jb250ZW50LCBodG1sOiBkYXRhW3RoaXMub3B0aW9ucy5uYW1lXSwgc3R5bGVzOiB0aGlzLm9wdGlvbnMubmFtZVN0eWxlcyB9KVxyXG5cclxuICAgICAgICBsZWFmLm5hbWUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHRoaXMuX2Rvd24oZSkpXHJcbiAgICAgICAgbGVhZi5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4gdGhpcy5fZG93bihlKSlcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBkYXRhW3RoaXMub3B0aW9ucy5jaGlsZHJlbl0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBhZGQgPSB0aGlzLmxlYWYoY2hpbGQsIGxldmVsICsgMSlcclxuICAgICAgICAgICAgYWRkW3RoaXMub3B0aW9ucy5kYXRhXS5wYXJlbnQgPSBkYXRhXHJcbiAgICAgICAgICAgIGxlYWYuYXBwZW5kQ2hpbGQoYWRkKVxyXG4gICAgICAgICAgICBpZiAoIWRhdGFbdGhpcy5vcHRpb25zLmV4cGFuZGVkXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWRkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZ2V0Q2hpbGRyZW4obGVhZiwgdHJ1ZSkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5faGlkZUljb24obGVhZilcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xpY2tlZChsZWFmLmljb24sICgpID0+IHRoaXMudG9nZ2xlRXhwYW5kKGxlYWYpKVxyXG4gICAgICAgIHRoaXMuZW1pdCgncmVuZGVyJywgbGVhZiwgdGhpcylcclxuICAgICAgICByZXR1cm4gbGVhZlxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRDaGlsZHJlbihsZWFmLCBhbGwpXHJcbiAgICB7XHJcbiAgICAgICAgbGVhZiA9IGxlYWYgfHwgdGhpcy5lbGVtZW50XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGxlYWYuY2hpbGRyZW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuaXNMZWFmICYmIChhbGwgfHwgY2hpbGQuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2hpbGRyZW5cclxuICAgIH1cclxuXHJcbiAgICBfaGlkZUljb24obGVhZilcclxuICAgIHtcclxuICAgICAgICBpZiAobGVhZi5pc0xlYWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWFmLmljb24uc3R5bGUub3BhY2l0eSA9IDBcclxuICAgICAgICAgICAgbGVhZi5pY29uLnN0eWxlLmN1cnNvciA9ICd1bnNldCdcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3Nob3dJY29uKGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGxlYWYuaXNMZWFmKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVhZi5pY29uLnN0eWxlLm9wYWNpdHkgPSAxXHJcbiAgICAgICAgICAgIGxlYWYuaWNvbi5zdHlsZS5jdXJzb3IgPSB0aGlzLm9wdGlvbnMuZXhwYW5kU3R5bGVzLmN1cnNvclxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBhbmRBbGwoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2V4cGFuZENoaWxkcmVuKHRoaXMuZWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICBfZXhwYW5kQ2hpbGRyZW4obGVhZilcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9nZXRDaGlsZHJlbihsZWFmLCB0cnVlKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGNoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRDaGlsZHJlbihjaGlsZClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29sbGFwc2VBbGwoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2NvbGxhcHNlQ2hpbGRyZW4odGhpcylcclxuICAgIH1cclxuXHJcbiAgICBfY29sbGFwc2VDaGlsZHJlbihsZWFmKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX2dldENoaWxkcmVuKGxlYWYsIHRydWUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZShjaGlsZClcclxuICAgICAgICAgICAgdGhpcy5fY29sbGFwc2VDaGlsZHJlbihjaGlsZClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlRXhwYW5kKGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGxlYWYuaWNvbi5zdHlsZS5vcGFjaXR5ICE9PSAnMCcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobGVhZlt0aGlzLm9wdGlvbnMuZGF0YV1bdGhpcy5vcHRpb25zLmV4cGFuZGVkXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsYXBzZShsZWFmKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmQobGVhZilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBhbmQobGVhZilcclxuICAgIHtcclxuICAgICAgICBpZiAobGVhZi5pc0xlYWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldENoaWxkcmVuKGxlYWYsIHRydWUpXHJcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZWFmW3RoaXMub3B0aW9ucy5kYXRhXVt0aGlzLm9wdGlvbnMuZXhwYW5kZWRdID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgbGVhZi5pY29uLmlubmVySFRNTCA9IGljb25zLm9wZW5cclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXhwYW5kJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndXBkYXRlJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb2xsYXBzZShsZWFmKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChsZWFmLmlzTGVhZilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fZ2V0Q2hpbGRyZW4obGVhZiwgdHJ1ZSlcclxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGVhZlt0aGlzLm9wdGlvbnMuZGF0YV1bdGhpcy5vcHRpb25zLmV4cGFuZGVkXSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICBsZWFmLmljb24uaW5uZXJIVE1MID0gaWNvbnMuY2xvc2VkXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2NvbGxhcHNlJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndXBkYXRlJywgbGVhZiwgdGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgdGhpcyBhZnRlciB0cmVlJ3MgZGF0YSBoYXMgYmVlbiB1cGRhdGVkIG91dHNpZGUgb2YgdGhpcyBsaWJyYXJ5XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5lbGVtZW50LnNjcm9sbFRvcFxyXG4gICAgICAgIHV0aWxzLnJlbW92ZUNoaWxkcmVuKHRoaXMuZWxlbWVudClcclxuICAgICAgICBmb3IgKGxldCBsZWFmIG9mIHRoaXMuZWxlbWVudFt0aGlzLm9wdGlvbnMuZGF0YV1bdGhpcy5vcHRpb25zLmNoaWxkcmVuXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkZCA9IHRoaXMubGVhZihsZWFmLCAwKVxyXG4gICAgICAgICAgICBhZGRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudCA9IHRoaXMuZWxlbWVudFt0aGlzLm9wdGlvbnMuZGF0YV1cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGFkZClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IHNjcm9sbCArICdweCdcclxuICAgIH1cclxuXHJcbiAgICBfZG93bihlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZVxyXG4gICAgICAgIHRoaXMuZG93biA9IHsgeDogZS5wYWdlWCwgeTogZS5wYWdlWSB9XHJcbiAgICAgICAgY29uc3QgcG9zID0gdXRpbHMudG9HbG9iYWwodGhpcy50YXJnZXQpXHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSB7IHg6IGUucGFnZVggLSBwb3MueCwgeTogZS5wYWdlWSAtIHBvcy55IH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhvbGRUaW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5ob2xkVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMuX2hvbGQoKSwgdGhpcy5vcHRpb25zLmhvbGRUaW1lKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICB9XHJcblxyXG4gICAgX2hvbGQoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaG9sZFRpbWVvdXQgPSBudWxsXHJcbiAgICAgICAgdGhpcy5lZGl0KHRoaXMudGFyZ2V0KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZWRpdCB0aGUgbmFtZSBlbnRyeSB1c2luZyB0aGUgZGF0YVxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgZWxlbWVudCBvZiBsZWFmXHJcbiAgICAgKi9cclxuICAgIGVkaXREYXRhKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRDaGlsZHJlbihudWxsLCB0cnVlKVxyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGEgPT09IGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdChjaGlsZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVkaXQgdGhlIG5hbWUgZW50cnkgdXNpbmcgdGhlIGNyZWF0ZWQgZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbGVhZlxyXG4gICAgICovXHJcbiAgICBlZGl0KGxlYWYpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5lZGl0aW5nID0gbGVhZlxyXG4gICAgICAgIHRoaXMuaW5wdXQgPSB1dGlscy5odG1sKHsgcGFyZW50OiB0aGlzLmVkaXRpbmcubmFtZS5wYXJlbnROb2RlLCB0eXBlOiAnaW5wdXQnLCBzdHlsZXM6IHRoaXMub3B0aW9ucy5uYW1lU3R5bGVzIH0pXHJcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRpbmcubmFtZSlcclxuICAgICAgICB0aGlzLmlucHV0LnN0eWxlLmJveFNpemluZyA9ICdjb250ZW50LWJveCdcclxuICAgICAgICB0aGlzLmlucHV0LnN0eWxlLmZvbnRGYW1pbHkgPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LWZhbWlseScpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5zdHlsZS5mb250U2l6ZSA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtc2l6ZScpXHJcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHRoaXMuZWRpdGluZy5uYW1lLmlubmVyVGV4dFxyXG4gICAgICAgIHRoaXMuaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgdGhpcy5pbnB1dC52YWx1ZS5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5mb2N1cygpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lQ2hhbmdlKHRoaXMuZWRpdGluZywgdGhpcy5pbnB1dC52YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5faG9sZENsb3NlKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09ICdFc2NhcGUnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ob2xkQ2xvc2UoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09ICdFbnRlcicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZUNoYW5nZSh0aGlzLmVkaXRpbmcsIHRoaXMuaW5wdXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ob2xkQ2xvc2UoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmVkaXRpbmcubmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgX2hvbGRDbG9zZSgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWRpdGluZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQucmVtb3ZlKClcclxuICAgICAgICAgICAgdGhpcy5lZGl0aW5nLm5hbWUuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgdGhpcy5lZGl0aW5nID0gdGhpcy5pbnB1dCA9IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZUNoYW5nZShsZWFmLCBuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGxlYWZbdGhpcy5vcHRpb25zLmRhdGFdLm5hbWUgPSB0aGlzLmlucHV0LnZhbHVlXHJcbiAgICAgICAgbGVhZi5uYW1lLmlubmVySFRNTCA9IG5hbWVcclxuICAgICAgICB0aGlzLmVtaXQoJ25hbWUtY2hhbmdlJywgbGVhZiwgdGhpcy5pbnB1dC52YWx1ZSwgdGhpcylcclxuICAgICAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIGxlYWYsIHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgX3NldEluZGljYXRvcigpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGxldmVsID0gMFxyXG4gICAgICAgIGxldCB0cmF2ZXJzZSA9IHRoaXMuaW5kaWNhdG9yLnBhcmVudE5vZGVcclxuICAgICAgICB3aGlsZSAodHJhdmVyc2UgIT09IHRoaXMuZWxlbWVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldmVsKytcclxuICAgICAgICAgICAgdHJhdmVyc2UgPSB0cmF2ZXJzZS5wYXJlbnROb2RlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yLmluZGVudGF0aW9uLnN0eWxlLndpZHRoID0gbGV2ZWwgKiB0aGlzLm9wdGlvbnMuaW5kZW50YXRpb24gKyAncHgnXHJcbiAgICB9XHJcblxyXG4gICAgX3BpY2t1cCgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuaG9sZFRpbWVvdXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaG9sZFRpbWVvdXQpXHJcbiAgICAgICAgICAgIHRoaXMuaG9sZFRpbWVvdXQgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW1pdCgnbW92ZS1wZW5kaW5nJywgdGhpcy50YXJnZXQsIHRoaXMpXHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy50YXJnZXQucGFyZW50Tm9kZVxyXG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMudGFyZ2V0KVxyXG4gICAgICAgIHRoaXMuX3NldEluZGljYXRvcigpXHJcbiAgICAgICAgY29uc3QgcG9zID0gdXRpbHMudG9HbG9iYWwodGhpcy50YXJnZXQpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRhcmdldClcclxuICAgICAgICB0aGlzLm9sZCA9IHtcclxuICAgICAgICAgICAgb3BhY2l0eTogdGhpcy50YXJnZXQuc3R5bGUub3BhY2l0eSB8fCAndW5zZXQnLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy50YXJnZXQuc3R5bGUucG9zaXRpb24gfHwgJ3Vuc2V0JyxcclxuICAgICAgICAgICAgYm94U2hhZG93OiB0aGlzLnRhcmdldC5uYW1lLnN0eWxlLmJveFNoYWRvdyB8fCAndW5zZXQnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Lm5hbWUuc3R5bGUuYm94U2hhZG93ID0gJzNweCAzcHggNXB4IHJnYmEoMCwwLDAsMC4yNSknXHJcbiAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUubGVmdCA9IHBvcy54ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRvcCA9IHBvcy55ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSB0aGlzLm9wdGlvbnMuZHJhZ09wYWNpdHlcclxuICAgICAgICBpZiAodGhpcy5fZ2V0Q2hpbGRyZW4ocGFyZW50LCB0cnVlKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9oaWRlSWNvbihwYXJlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9jaGVja1RocmVzaG9sZChlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLm1vdmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodXRpbHMuZGlzdGFuY2UodGhpcy5kb3duLngsIHRoaXMuZG93bi55LCBlLnBhZ2VYLCBlLnBhZ2VZKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9waWNrdXAoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9maW5kQ2xvc2VzdChlLCBlbnRyeSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb3MgPSB1dGlscy50b0dsb2JhbChlbnRyeS5uYW1lKVxyXG4gICAgICAgIGlmIChwb3MueSArIGVudHJ5Lm5hbWUub2Zmc2V0SGVpZ2h0IC8gMiA8PSBlLnBhZ2VZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsb3Nlc3QuZm91bmRBYm92ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzLmluc2lkZShlLnBhZ2VYLCBlLnBhZ2VZLCBlbnRyeS5uYW1lKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuZm91bmRBYm92ZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUgPSBlbnRyeVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdXRpbHMuZGlzdGFuY2VQb2ludEVsZW1lbnQoZS5wYWdlWCwgZS5wYWdlWSwgZW50cnkubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCB0aGlzLmNsb3Nlc3QuZGlzdGFuY2VBYm92ZSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5kaXN0YW5jZUFib3ZlID0gZGlzdGFuY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlID0gZW50cnlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuY2xvc2VzdC5mb3VuZEJlbG93KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHV0aWxzLmluc2lkZShlLnBhZ2VYLCBlLnBhZ2VZLCBlbnRyeS5uYW1lKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmZvdW5kQmVsb3cgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYmVsb3cgPSBlbnRyeVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB1dGlscy5kaXN0YW5jZVBvaW50RWxlbWVudChlLnBhZ2VYLCBlLnBhZ2VZLCBlbnRyeS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgdGhpcy5jbG9zZXN0LmRpc3RhbmNlQmVsb3cpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmRpc3RhbmNlQmVsb3cgPSBkaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5iZWxvdyA9IGVudHJ5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fZ2V0Q2hpbGRyZW4oZW50cnkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZmluZENsb3Nlc3QoZSwgY2hpbGQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRGaXJzdENoaWxkKGVsZW1lbnQsIGFsbClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldENoaWxkcmVuKGVsZW1lbnQsIGFsbClcclxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRMYXN0Q2hpbGQoZWxlbWVudCwgYWxsKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fZ2V0Q2hpbGRyZW4oZWxlbWVudCwgYWxsKVxyXG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2dldFBhcmVudChlbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcclxuICAgICAgICB3aGlsZSAoZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50XHJcbiAgICB9XHJcblxyXG4gICAgX21vdmUoZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgJiYgdGhpcy5fY2hlY2tUaHJlc2hvbGQoZSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmluZGljYXRvci5yZW1vdmUoKVxyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5sZWZ0ID0gZS5wYWdlWCAtIHRoaXMub2Zmc2V0LnggKyAncHgnXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLnRvcCA9IGUucGFnZVkgLSB0aGlzLm9mZnNldC55ICsgJ3B4J1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdXRpbHMudG9HbG9iYWwodGhpcy50YXJnZXQubmFtZSkueFxyXG4gICAgICAgICAgICB0aGlzLmNsb3Nlc3QgPSB7IGRpc3RhbmNlQWJvdmU6IEluZmluaXR5LCBkaXN0YW5jZUJlbG93OiBJbmZpbml0eSB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX2dldENoaWxkcmVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbmRDbG9zZXN0KGUsIGNoaWxkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbG9zZXN0LmFib3ZlICYmICF0aGlzLmNsb3Nlc3QuYmVsb3cpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5jbG9zZXN0LmFib3ZlKSAvLyBudWxsIFtdIGxlYWZcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLmluZGljYXRvciwgdGhpcy5fZ2V0Rmlyc3RDaGlsZCh0aGlzLmVsZW1lbnQpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLmNsb3Nlc3QuYmVsb3cpIC8vIGxlYWYgW10gbnVsbFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gdXRpbHMudG9HbG9iYWwodGhpcy5jbG9zZXN0LmFib3ZlLm5hbWUpXHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IHBvcy54ICsgdGhpcy5vcHRpb25zLmluZGVudGF0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdC5hYm92ZS5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuX2dldEZpcnN0Q2hpbGQodGhpcy5jbG9zZXN0LmFib3ZlLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHggPiBwb3MueCAtIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jbG9zZXN0LmFib3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCAhPT0gdGhpcy5lbGVtZW50ICYmIHggPCBwb3MueClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHRoaXMuX2dldFBhcmVudChwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQgIT09IHRoaXMuZWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zID0gdXRpbHMudG9HbG9iYWwocGFyZW50Lm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuaW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmNsb3Nlc3QuYmVsb3cucGFyZW50Tm9kZSA9PT0gdGhpcy5jbG9zZXN0LmFib3ZlKSAvLyBwYXJlbnQgW10gY2hpbGRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0LmFib3ZlLmluc2VydEJlZm9yZSh0aGlzLmluZGljYXRvciwgdGhpcy5jbG9zZXN0LmJlbG93KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY2xvc2VzdC5iZWxvdy5wYXJlbnROb2RlID09PSB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZSkgLy8gc2libGluZyBbXSBzaWJsaW5nXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IHV0aWxzLnRvR2xvYmFsKHRoaXMuY2xvc2VzdC5hYm92ZS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgaWYgKHggPiBwb3MueCArIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLl9nZXRMYXN0Q2hpbGQodGhpcy5jbG9zZXN0LmFib3ZlLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuY2xvc2VzdC5iZWxvdylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIC8vIGNoaWxkIFtdIHBhcmVudF5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IHV0aWxzLnRvR2xvYmFsKHRoaXMuY2xvc2VzdC5hYm92ZS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgaWYgKHggPiBwb3MueCArIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUuaW5zZXJ0QmVmb3JlKHRoaXMuaW5kaWNhdG9yLCB0aGlzLl9nZXRMYXN0Q2hpbGQodGhpcy5jbG9zZXN0LmFib3ZlLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHggPiBwb3MueCAtIHRoaXMub3B0aW9ucy5pbmRlbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYWJvdmUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHggPCB1dGlscy50b0dsb2JhbCh0aGlzLmNsb3Nlc3QuYmVsb3cubmFtZSkueClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3QuYmVsb3cucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5pbmRpY2F0b3IsIHRoaXMuY2xvc2VzdC5iZWxvdylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jbG9zZXN0LmFib3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudC5wYXJlbnROb2RlICE9PSB0aGlzLmNsb3Nlc3QuYmVsb3cucGFyZW50Tm9kZSAmJiB4IDwgcG9zLngpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnQocGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSB1dGlscy50b0dsb2JhbChwYXJlbnQubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuaW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3NldEluZGljYXRvcigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF91cChlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb3ZpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwYW5kT25DbGljaylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUV4cGFuZCh0aGlzLnRhcmdldClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY2xpY2tlZCcsIHRoaXMudGFyZ2V0LCBlLCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3IucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy50YXJnZXQsIHRoaXMuaW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmQodGhpcy5pbmRpY2F0b3IucGFyZW50Tm9kZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3dJY29uKHRoaXMuaW5kaWNhdG9yLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5wb3NpdGlvbiA9IHRoaXMub2xkLnBvc2l0aW9uID09PSAndW5zZXQnID8gJycgOiB0aGlzLm9sZC5wb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQubmFtZS5zdHlsZS5ib3hTaGFkb3cgPSB0aGlzLm9sZC5ib3hTaGFkb3cgPT09ICd1bnNldCcgPyAnJyA6IHRoaXMub2xkLmJveFNoYWRvd1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUub3BhY2l0eSA9IHRoaXMub2xkLm9wYWNpdHkgPT09ICd1bnNldCcgPyAnJyA6IHRoaXMub2xkLm9wYWNpdHlcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LmluZGVudGF0aW9uLnN0eWxlLndpZHRoID0gdGhpcy5pbmRpY2F0b3IuaW5kZW50YXRpb24ub2Zmc2V0V2lkdGggKyAncHgnXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljYXRvci5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW92ZURhdGEoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdtb3ZlJywgdGhpcy50YXJnZXQsIHRoaXMpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudGFyZ2V0LCB0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvbGRUaW1lb3V0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaG9sZFRpbWVvdXQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvbGRUaW1lb3V0ID0gbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5tb3ZpbmcgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9tb3ZlRGF0YSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UodGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMudGFyZ2V0W3RoaXMub3B0aW9ucy5kYXRhXSksIDEpXHJcbiAgICAgICAgdGhpcy50YXJnZXQucGFyZW50Tm9kZVt0aGlzLm9wdGlvbnMuZGF0YV0uY2hpbGRyZW4uc3BsaWNlKHV0aWxzLmdldENoaWxkSW5kZXgodGhpcy50YXJnZXQucGFyZW50Tm9kZSwgdGhpcy50YXJnZXQpLCAwLCB0aGlzLnRhcmdldFt0aGlzLm9wdGlvbnMuZGF0YV0pXHJcbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5vcHRpb25zLmRhdGFdLnBhcmVudCA9IHRoaXMudGFyZ2V0LnBhcmVudE5vZGVbdGhpcy5vcHRpb25zLmRhdGFdXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJlZVxyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRyZWV+VHJlZURhdGFcclxuICogQHByb3BlcnR5IHtUcmVlRGF0YVtdfSBjaGlsZHJlblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZVxyXG4gKiBAcHJvcGVydHkge3BhcmVudH0gW3BhcmVudF0gaWYgbm90IHByb3ZpZGVkIHRoZW4gd2lsbCB0cmF2ZXJzZSB0cmVlIHRvIGZpbmQgcGFyZW50XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gZXhwYW5kIGlzIGNhbGxlZCBlaXRoZXIgdGhyb3VnaCBVSSBpbnRlcmFjdGlvbiBvciBUcmVlLmV4cGFuZCgpXHJcbiAgKiBAZXZlbnQgVHJlZX5leHBhbmRcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBjb2xsYXBzZSBpcyBjYWxsZWQgZWl0aGVyIHRocm91Z2ggVUkgaW50ZXJhY3Rpb24gb3IgVHJlZS5leHBhbmQoKVxyXG4gICogQGV2ZW50IFRyZWV+Y29sbGFwc2VcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBuYW1lIGlzIGNoYW5nZSBlaXRoZXIgdGhyb3VnaCBVSSBpbnRlcmFjdGlvbiBvciBUcmVlLm5hbWVDaGFuZ2UoKVxyXG4gICogQGV2ZW50IFRyZWV+bmFtZS1jaGFuZ2VcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lXHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmIGlzIHBpY2tlZCB1cCB0aHJvdWdoIFVJIGludGVyYWN0aW9uXHJcbiAgKiBAZXZlbnQgVHJlZX5tb3ZlLXBlbmRpbmdcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBhIGxlYWYncyBsb2NhdGlvbiBpcyBjaGFuZ2VkXHJcbiAgKiBAZXZlbnQgVHJlZX5tb3ZlXHJcbiAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdHJlZSBlbGVtZW50XHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmIGlzIGNsaWNrZWQgYW5kIG5vdCBkcmFnZ2VkIG9yIGhlbGRcclxuICAqIEBldmVudCBUcmVlfmNsaWNrZWRcclxuICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0cmVlIGVsZW1lbnRcclxuICAqIEBwcm9wZXJ0eSB7VUlFdmVudH0gZXZlbnRcclxuICAqIEBwcm9wZXJ0eSB7VHJlZX0gVHJlZVxyXG4gICovXHJcblxyXG4vKipcclxuICAqIHRyaWdnZXIgd2hlbiBhIGxlYWYgaXMgY2hhbmdlZCAoaS5lLiwgbW92ZWQsIG5hbWUtY2hhbmdlKVxyXG4gICogQGV2ZW50IFRyZWV+dXBkYXRlXHJcbiAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdHJlZSBlbGVtZW50XHJcbiAgKiBAcHJvcGVydHkge1RyZWV9IFRyZWVcclxuICAqL1xyXG5cclxuLyoqXHJcbiAgKiB0cmlnZ2VyIHdoZW4gYSBsZWFmJ3MgZGl2IGlzIGNyZWF0ZWRcclxuICAqIEBldmVudCBUcmVlfnJlbmRlclxyXG4gICogQHR5cGUge29iamVjdH1cclxuICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRyZWUgZWxlbWVudFxyXG4gICogQHByb3BlcnR5IHtUcmVlfSBUcmVlXHJcbiAgKi8iXX0=