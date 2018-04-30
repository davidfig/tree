'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Events = require('eventemitter3');

var defaults = require('./defaults');
var utils = require('./utils');

var Sortable = function (_Events) {
    _inherits(Sortable, _Events);

    /**
     * Create sortable list
     * @param {HTMLElement} element
     * @param {object} [options]
     * @param {string} [options.name=sortable] dragging is allowed between Sortables with the same name
     * @param {string} [options.dragClass] if set then drag only items with this className under element; otherwise drag all children
     * @param {string} [options.orderClass] use this class to include elements in ordering but not dragging; otherwise all children elements are included in when sorting and ordering
     * @param {boolean} [options.deepSearch] if dragClass and deepSearch then search all descendents of element for dragClass
     * @param {boolean} [options.sort=true] allow sorting within list
     * @param {boolean} [options.drop=true] allow drop from related sortables (doesn't impact reordering this sortable's children until the children are moved to a differen sortable)
     * @param {boolean} [options.copy=false] create copy when dragging an item (this disables sort=true for this sortable)
     * @param {string} [options.orderId=data-order] for ordered lists, use this data id to figure out sort order
     * @param {boolean} [options.orderIdIsNumber=true] use parseInt on options.sortId to properly sort numbers
     * @param {string} [options.reverseOrder] reverse sort the orderId
     * @param {string} [options.offList=closest] how to handle when an element is dropped outside a sortable: closest=drop in closest sortable; cancel=return to starting sortable; delete=remove from all sortables
     * @param {number} [options.maximum] maximum number of elements allowed in a sortable list
     * @param {boolean} [options.maximumFIFO] direction of search to choose which item to remove when maximum is reached
     * @param {string} [options.cursorHover=grab -webkit-grab pointer] use this cursor list to set cursor when hovering over a sortable element
     * @param {string} [options.cursorDown=grabbing -webkit-grabbing pointer] use this cursor list to set cursor when mousedown/touchdown over a sortable element
     * @param {boolean} [options.useIcons=true] show icons when dragging
     * @param {object} [options.icons] default set of icons
     * @param {string} [options.icons.reorder]
     * @param {string} [options.icons.move]
     * @param {string} [options.icons.copy]
     * @param {string} [options.icons.delete]
     * @param {string} [options.customIcon] source of custom image when over this sortable
     * @fires pickup
     * @fires order
     * @fires add
     * @fires remove
     * @fires update
     * @fires delete
     * @fires copy
     * @fires maximum-remove
     * @fires order-pending
     * @fires add-pending
     * @fires remove-pending
     * @fires add-remove-pending
     * @fires update-pending
     * @fires delete-pending
     * @fires copy-pending
     * @fires maximum-remove-pending
     * @fires clicked
     */
    function Sortable(element, options) {
        _classCallCheck(this, Sortable);

        var _this = _possibleConstructorReturn(this, (Sortable.__proto__ || Object.getPrototypeOf(Sortable)).call(this));

        _this.options = utils.options(options, defaults);
        _this.element = element;
        _this._addToGlobalTracker();
        var elements = _this._getChildren();
        _this.events = {
            dragStart: function dragStart(e) {
                return _this._dragStart(e);
            },
            dragEnd: function dragEnd(e) {
                return _this._dragEnd(e);
            },
            dragOver: function dragOver(e) {
                return _this._dragOver(e);
            },
            drop: function drop(e) {
                return _this._drop(e);
            },
            dragLeave: function dragLeave(e) {
                return _this._dragLeave(e);
            },
            mouseDown: function mouseDown(e) {
                return _this._mouseDown(e);
            },
            mouseUp: function mouseUp(e) {
                return _this._mouseUp(e);
            }
        };
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var child = _step.value;

                if (!_this.options.dragClass || utils.containsClassName(child, _this.options.dragClass)) {
                    _this.attachElement(child);
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

        element.addEventListener('dragover', _this.events.dragOver);
        element.addEventListener('drop', _this.events.drop);
        element.addEventListener('dragleave', _this.events.dragLeave);
        if (_this.options.cursorHover) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _this._getChildren()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _child = _step2.value;

                    utils.style(_child, 'cursor', _this.options.cursorHover);
                    if (_this.options.cursorDown) {
                        _child.addEventListener('mousedown', _this.events.mouseDown);
                    }
                    _child.addEventListener('mouseup', _this.events.mouseUp);
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
        }
        return _this;
    }

    /**
     * removes all event handlers from this.element and children
     */


    _createClass(Sortable, [{
        key: 'destroy',
        value: function destroy() {
            this.element.removeEventListener('dragover', this.events.dragOver);
            this.element.removeEventListener('drop', this.events.drop);
            var elements = this._getChildren();
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = elements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var child = _step3.value;

                    this.removeElement(child);
                }
                // todo: remove Sortable.tracker and related event handlers if no more sortables
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

        /**
         * the global defaults for new Sortable objects
         * @type {DefaultOptions}
         */

    }, {
        key: 'add',


        /**
         * add an element as a child of the sortable element; can also be used to swap between sortables
         * NOTE: this may not work with deepSearch non-ordered elements; use attachElement instead
         * @param {HTMLElement} element
         * @param {number} index
         */
        value: function add(element, index) {
            this.attachElement(element);
            if (this.options.sort) {
                if (typeof index === 'undefined' || index >= this.element.children.length) {
                    this.element.appendChild(element);
                } else {
                    this.element.insertBefore(element, this.element.children[index + 1]);
                }
            } else {
                var id = this.options.orderId;
                var dragOrder = element.getAttribute(id);
                dragOrder = this.options.orderIdIsNumber ? parseFloat(dragOrder) : dragOrder;
                var found = void 0;
                var children = this._getChildren(true);
                if (this.options.reverseOrder) {
                    for (var i = children.length - 1; i >= 0; i--) {
                        var child = children[i];
                        var childDragOrder = child.getAttribute(id);
                        childDragOrder = this.options.orderIsNumber ? parseFloat(childDragOrder) : childDragOrder;
                        if (dragOrder > childDragOrder) {
                            child.parentNode.insertBefore(element, child);
                            found = true;
                            break;
                        }
                    }
                } else {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _child2 = _step4.value;

                            var _childDragOrder = _child2.getAttribute(id);
                            _childDragOrder = this.options.orderIsNumber ? parseFloat(_childDragOrder) : _childDragOrder;
                            if (dragOrder < _childDragOrder) {
                                _child2.parentNode.insertBefore(element, _child2);
                                found = true;
                                break;
                            }
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
                if (!found) {
                    this.element.appendChild(element);
                }
            }
        }

        /**
         * attaches an HTML element to the sortable; can also be used to swap between sortables
         * NOTE: you need to manually insert the element into this.element (this is useful when you have a deep structure)
         * @param {HTMLElement} element
         */

    }, {
        key: 'attachElement',
        value: function attachElement(element) {
            if (element.__sortable) {
                element.__sortable.original = this;
            } else {
                element.__sortable = {
                    sortable: this,
                    original: this

                    // add a counter for maximum
                };this._maximumCounter(element, this);

                // ensure every element has an id
                if (!element.id) {
                    element.id = '__sortable-' + this.options.name + '-' + Sortable.tracker[this.options.name].counter;
                    Sortable.tracker[this.options.name].counter++;
                }
                if (this.options.copy) {
                    element.__sortable.copy = 0;
                }
                element.addEventListener('dragstart', this.events.dragStart);
                element.addEventListener('dragend', this.events.dragEnd);
                element.setAttribute('draggable', true);
            }
        }

        /**
         * removes all events from an HTML element
         * NOTE: does not remove the element from its parent
         * @param {HTMLElement} element
         */

    }, {
        key: 'removeElement',
        value: function removeElement(element) {
            element.removeEventListener('dragstart', this.events.dragStart);
            element.removeEventListener('dragend', this.events.dragEnd);
            element.setAttribute('draggable', false);
        }

        /**
         * add sortable to global list that tracks all sortables
         * @private
         */

    }, {
        key: '_addToGlobalTracker',
        value: function _addToGlobalTracker() {
            var _this2 = this;

            if (!Sortable.tracker) {
                Sortable.dragImage = document.createElement('div');
                Sortable.dragImage.style.background = 'transparent';
                Sortable.dragImage.style.position = 'fixed';
                Sortable.dragImage.style.left = -10;
                Sortable.dragImage.style.top = -10;
                Sortable.dragImage.style.width = Sortable.dragImage.style.height = '5px';
                Sortable.dragImage.style.zIndex = -1;
                Sortable.dragImage.id = 'sortable-dragImage';
                document.body.appendChild(Sortable.dragImage);
                Sortable.tracker = {};
                document.body.addEventListener('dragover', function (e) {
                    return _this2._bodyDragOver(e);
                });
                document.body.addEventListener('drop', function (e) {
                    return _this2._bodyDrop(e);
                });
            }
            if (Sortable.tracker[this.options.name]) {
                Sortable.tracker[this.options.name].list.push(this);
            } else {
                Sortable.tracker[this.options.name] = { list: [this], counter: 0 };
            }
        }

        /**
         * default drag over for the body
         * @param {DragEvent} e
         * @private
         */

    }, {
        key: '_bodyDragOver',
        value: function _bodyDragOver(e) {
            var name = e.dataTransfer.types[0];
            if (Sortable.tracker[name]) {
                var id = e.dataTransfer.types[1];
                var element = document.getElementById(id);
                var sortable = this._findClosest(e, Sortable.tracker[name].list, element);
                if (element) {
                    if (sortable) {
                        if (sortable.last && Math.abs(sortable.last.x - e.pageX) < sortable.options.threshold && Math.abs(sortable.last.y - e.pageY) < sortable.options.threshold) {
                            sortable._updateDragging(e, element);
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        sortable.last = { x: e.pageX, y: e.pageY };
                        sortable._placeInList(sortable, e.pageX, e.pageY, element);
                        e.dataTransfer.dropEffect = 'move';
                        sortable._updateDragging(e, element);
                    } else {
                        this._noDrop(e);
                    }
                    e.preventDefault();
                }
            }
        }

        /**
         * handle no drop
         * @param {UIEvent} e
         * @param {boolean} [cancel] force cancel (for options.copy)
         * @private
         */

    }, {
        key: '_noDrop',
        value: function _noDrop(e, cancel) {
            e.dataTransfer.dropEffect = 'move';
            var id = e.dataTransfer.types[1];
            var element = document.getElementById(id);
            if (element) {
                this._updateDragging(e, element);
                this._setIcon(element, null, cancel);
                if (!cancel) {
                    if (element.__sortable.original.options.offList === 'delete') {
                        if (!element.__sortable.display) {
                            element.__sortable.display = element.style.display || 'unset';
                            element.style.display = 'none';
                            element.__sortable.original.emit('delete-pending', element, element.__sortable.original);
                        }
                    } else if (!element.__sortable.original.options.copy) {
                        this._replaceInList(element.__sortable.original, element);
                    }
                }
                if (element.__sortable.current) {
                    this._clearMaximumPending(element.__sortable.current);
                    element.__sortable.current.emit('add-remove-pending', element, element.__sortable.current);
                    element.__sortable.current.emit('update-pending', element, element.__sortable.current);
                    element.__sortable.current = null;
                }
            }
        }

        /**
         * default drop for the body
         * @param {DragEvent} e
         * @private
         */

    }, {
        key: '_bodyDrop',
        value: function _bodyDrop(e) {
            var name = e.dataTransfer.types[0];
            if (Sortable.tracker[name]) {
                var id = e.dataTransfer.types[1];
                var element = document.getElementById(id);
                var sortable = this._findClosest(e, Sortable.tracker[name].list, element);
                if (element) {
                    if (sortable) {
                        e.preventDefault();
                    }
                    this._removeDragging(element);
                    if (element.__sortable.display) {
                        element.remove();
                        element.style.display = element.__sortable.display;
                        element.__sortable.display = null;
                        element.__sortable.original.emit('delete', element, element.__sortable.original);
                        element.__sortable.original = null;
                    }
                }
            }
        }

        /**
         * end drag
         * @param {UIEvent} e
         * @private
         */

    }, {
        key: '_dragEnd',
        value: function _dragEnd(e) {
            var element = e.currentTarget;
            var dragging = element.__sortable.dragging;
            if (dragging) {
                dragging.remove();
                if (dragging.icon) {
                    dragging.icon.remove();
                }
                element.__sortable.dragging = null;
            }
            if (this.options.cursorHover) {
                utils.style(e.currentTarget, 'cursor', this.options.cursorHover);
            }
        }

        /**
         * start drag
         * @param {UIEvent} e
         * @private
         */

    }, {
        key: '_dragStart',
        value: function _dragStart(e) {
            var sortable = e.currentTarget.__sortable.original;
            var dragging = e.currentTarget.cloneNode(true);
            for (var style in sortable.options.dragStyle) {
                dragging.style[style] = sortable.options.dragStyle[style];
            }
            var pos = utils.toGlobal(e.currentTarget);
            dragging.style.left = pos.x + 'px';
            dragging.style.top = pos.y + 'px';
            var offset = { x: pos.x - e.pageX, y: pos.y - e.pageY };
            document.body.appendChild(dragging);
            if (sortable.options.useIcons) {
                var image = new Image();
                image.src = sortable.options.icons.reorder;
                image.style.position = 'absolute';
                image.style.transform = 'translate(-50%, -50%)';
                image.style.left = dragging.offsetLeft + dragging.offsetWidth + 'px';
                image.style.top = dragging.offsetTop + dragging.offsetHeight + 'px';
                document.body.appendChild(image);
                dragging.icon = image;
            }
            if (sortable.options.cursorHover) {
                utils.style(e.currentTarget, 'cursor', sortable.options.cursorHover);
            }
            var target = e.currentTarget;
            if (sortable.options.copy) {
                target = e.currentTarget.cloneNode(true);
                target.id = e.currentTarget.id + '-copy-' + e.currentTarget.__sortable.copy;
                e.currentTarget.__sortable.copy++;
                sortable.attachElement(target);
                target.__sortable.isCopy = true;
                target.__sortable.original = this;
                target.__sortable.display = target.style.display || 'unset';
                target.style.display = 'none';
                document.body.appendChild(target);
            }
            e.dataTransfer.clearData();
            e.dataTransfer.setData(sortable.options.name, sortable.options.name);
            e.dataTransfer.setData(target.id, target.id);
            e.dataTransfer.setDragImage(Sortable.dragImage, 0, 0);
            target.__sortable.current = this;
            target.__sortable.index = sortable.options.copy ? -1 : sortable._getIndex(target);
            target.__sortable.dragging = dragging;
            target.__sortable.offset = offset;
        }

        /**
         * handle drag leave events for sortable element
         * @param {DragEvent} e
         * @private
         */

    }, {
        key: '_dragLeave',
        value: function _dragLeave(e) {}
        // const id = e.dataTransfer.types[1]
        // if (id)
        // {
        //     const element = document.getElementById(id)
        //     if (element)
        //     {
        //         const sortable = element.__sortable.current
        //         sortable._maximumPending(element, sortable)
        //     }
        // }


        /**
         * handle drag over events for sortable element
         * @param {DragEvent} e
         * @private
         */

    }, {
        key: '_dragOver',
        value: function _dragOver(e) {
            var sortable = e.dataTransfer.types[0];
            if (sortable && sortable === this.options.name) {
                var id = e.dataTransfer.types[1];
                var element = document.getElementById(id);
                if (this.last && Math.abs(this.last.x - e.pageX) < this.options.threshold && Math.abs(this.last.y - e.pageY) < this.options.threshold) {
                    this._updateDragging(e, element);
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                this.last = { x: e.pageX, y: e.pageY };
                if (element.__sortable.isCopy && element.__sortable.original === this) {
                    this._noDrop(e, true);
                } else if (this.options.drop || element.__sortable.original === this) {
                    this._placeInList(this, e.pageX, e.pageY, element);
                    e.dataTransfer.dropEffect = element.__sortable.isCopy ? 'copy' : 'move';
                    this._updateDragging(e, element);
                } else {
                    this._noDrop(e);
                }
                e.preventDefault();
                e.stopPropagation();
            }
        }

        /**
         * update the dragging element
         * @param {UIEvent} e
         * @param {HTMLElement} element
         * @private
         */

    }, {
        key: '_updateDragging',
        value: function _updateDragging(e, element) {
            var dragging = element.__sortable.dragging;
            var offset = element.__sortable.offset;
            if (dragging) {
                dragging.style.left = e.pageX + offset.x + 'px';
                dragging.style.top = e.pageY + offset.y + 'px';
                if (dragging.icon) {
                    dragging.icon.style.left = dragging.offsetLeft + dragging.offsetWidth + 'px';
                    dragging.icon.style.top = dragging.offsetTop + dragging.offsetHeight + 'px';
                }
            }
        }

        /**
         * remove the dragging element
         * @param {HTMLElement} element
         * @private
         */

    }, {
        key: '_removeDragging',
        value: function _removeDragging(element) {
            var dragging = element.__sortable.dragging;
            if (dragging) {
                dragging.remove();
                if (dragging.icon) {
                    dragging.icon.remove();
                }
                element.__sortable.dragging = null;
            }
            element.__sortable.isCopy = false;
        }

        /**
         * drop the element into a sortable
         * @param {HTMLElement} e
         * @private
         */

    }, {
        key: '_drop',
        value: function _drop(e) {
            var name = e.dataTransfer.types[0];
            if (Sortable.tracker[name] && name === this.options.name) {
                var id = e.dataTransfer.types[1];
                var element = document.getElementById(id);
                if (element.__sortable.current) {
                    if (element.__sortable.original !== this) {
                        element.__sortable.original.emit('remove', element, element.__sortable.original);
                        this.emit('add', element, this);
                        element.__sortable.original = this;
                        if (this.options.sort) {
                            this.emit('order', element, this);
                        }
                        if (element.__sortable.isCopy) {
                            this.emit('copy', element, this);
                        }
                        this._maximum(element, this);
                        this.emit('update', element, this);
                    } else {
                        if (element.__sortable.index !== this._getIndex(e.currentTarget)) {
                            this.emit('order', element, this);
                            this.emit('update', element, this);
                        }
                    }
                }
                this._removeDragging(element);
                e.preventDefault();
                e.stopPropagation();
            }
        }

        /**
         * find closest Sortable to screen location
         * @param {UIEvent} e
         * @param {Sortable[]} list of related Sortables
         * @param {HTMLElement} element
         * @private
         */

    }, {
        key: '_findClosest',
        value: function _findClosest(e, list, element) {
            var min = Infinity,
                found = void 0;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = list[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var related = _step5.value;

                    if (!related.options.drop && element.__sortable.original !== related || element.__sortable.isCopy && element.__sortable.original === related) {
                        continue;
                    }
                    if (utils.inside(e.pageX, e.pageY, related.element)) {
                        return related;
                    } else if (related.options.offList === 'closest') {
                        var calculate = utils.distanceToClosestCorner(e.pageX, e.pageY, related.element);
                        if (calculate < min) {
                            min = calculate;
                            found = related;
                        }
                    }
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

            return found;
        }

        /**
         * place indicator in the sortable list according to options.sort
         * @param {number} x
         * @param {number} y
         * @param {Sortable} sortable
         * @param {HTMLElement} element
         * @private
         */

    }, {
        key: '_placeInList',
        value: function _placeInList(sortable, x, y, element) {
            if (this.options.sort) {
                this._placeInSortableList(sortable, x, y, element);
            } else {
                this._placeInOrderedList(sortable, element);
            }
            this._setIcon(element, sortable);
            if (element.__sortable.display) {
                element.style.display = element.__sortable.display === 'unset' ? '' : element.__sortable.display;
                element.__sortable.display = null;
            }
        }

        /**
         * replace item in list at original index position
         * @private
         */

    }, {
        key: '_replaceInList',
        value: function _replaceInList(sortable, element) {
            var children = sortable._getChildren();
            if (children.length) {
                var index = element.__sortable.index;
                if (index < children.length) {
                    children[index].parentNode.insertBefore(element, children[index]);
                } else {
                    children[0].appendChild(element);
                }
            } else {
                sortable.element.appendChild(element);
            }
        }

        /**
         * count the index of the child in the list of children
         * @param {HTMLElement} child
         * @return {number}
         * @private
         */

    }, {
        key: '_getIndex',
        value: function _getIndex(child) {
            var children = this._getChildren();
            for (var i = 0; i < children.length; i++) {
                if (children[i] === child) {
                    return i;
                }
            }
        }

        /**
         * traverse and search descendents in DOM
         * @param {HTMLElement} base
         * @param {string} search
         * @param {HTMLElement[]} results to return
         * @private
         */

    }, {
        key: '_traverseChildren',
        value: function _traverseChildren(base, search, results) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = base.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var child = _step6.value;

                    if (search.length) {
                        if (search.indexOf(child.className) !== -1) {
                            results.push(child);
                        }
                    } else {
                        results.push(child);
                    }
                    this._traverseChildren(child, search, results);
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
        }

        /**
         * find children in div
         * @param {Sortable} sortable
         * @param {boolean} [order] search for dragOrder as well
         * @private
         */

    }, {
        key: '_getChildren',
        value: function _getChildren(order) {
            if (this.options.deepSearch) {
                var search = [];
                if (order && this.options.orderClass) {
                    if (this.options.dragClass) {
                        search.push(this.options.dragClass);
                    }
                    if (order && this.options.orderClass) {
                        search.push(this.options.orderClass);
                    }
                } else if (!order && this.options.dragClass) {
                    search.push(this.options.dragClass);
                }
                var results = [];
                this._traverseChildren(this.element, search, results);
                return results;
            } else {
                if (this.options.dragClass) {
                    var list = [];
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = this.element.children[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var child = _step7.value;

                            if (utils.containsClassName(child, this.options.dragClass) || order && !this.options.orderClass || order && this.options.orderClass && utils.containsClassName(child, this.options.orderClass)) {
                                list.push(child);
                            }
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

                    return list;
                } else {
                    var _list = [];
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = this.element.children[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var _child3 = _step8.value;

                            _list.push(_child3);
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

                    return _list;
                }
            }
        }

        /**
         * place indicator in an ordered list
         * @param {Sortable} sortable
         * @param {HTMLElement} dragging
         * @private
         */

    }, {
        key: '_placeInOrderedList',
        value: function _placeInOrderedList(sortable, dragging) {
            if (dragging.__sortable.current !== sortable) {
                var id = sortable.options.orderId;
                var dragOrder = dragging.getAttribute(id);
                dragOrder = sortable.options.orderIdIsNumber ? parseFloat(dragOrder) : dragOrder;
                var found = void 0;
                var children = sortable._getChildren(true);
                if (sortable.options.reverseOrder) {
                    for (var i = children.length - 1; i >= 0; i--) {
                        var child = children[i];
                        var childDragOrder = child.getAttribute(id);
                        childDragOrder = sortable.options.orderIsNumber ? parseFloat(childDragOrder) : childDragOrder;
                        if (dragOrder > childDragOrder) {
                            child.parentNode.insertBefore(dragging, child);
                            found = true;
                            break;
                        }
                    }
                } else {
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = children[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var _child4 = _step9.value;

                            var _childDragOrder2 = _child4.getAttribute(id);
                            _childDragOrder2 = sortable.options.orderIsNumber ? parseFloat(_childDragOrder2) : _childDragOrder2;
                            if (dragOrder < _childDragOrder2) {
                                _child4.parentNode.insertBefore(dragging, _child4);
                                found = true;
                                break;
                            }
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
                if (!found) {
                    sortable.element.appendChild(dragging);
                }
                if (dragging.__sortable.current) {
                    if (dragging.__sortable.current !== dragging.__sortable.original) {
                        dragging.__sortable.current.emit('add-remove-pending', dragging, dragging.__sortable.current);
                    } else {
                        dragging.__sortable.current.emit('remove-pending', dragging, dragging.__sortable.current);
                    }
                    this._clearMaximumPending(dragging.__sortable.current);
                    this._maximum(null, dragging.__sortable.current);
                }
                sortable.emit('add-pending', dragging, sortable);
                if (dragging.__sortable.isCopy) {
                    sortable.emit('copy-pending', dragging, sortable);
                }
                dragging.__sortable.current = sortable;
                this._maximumPending(dragging, sortable);
                sortable.emit('update-pending', dragging, sortable);
            }
        }

        /**
         * search for where to place using percentage
         * @param {Sortable} sortable
         * @param {HTMLElement} dragging
         * @returns {number} 0 = not found; 1 = nothing to do; 2 = moved
         * @private
         */

    }, {
        key: '_placeByPercentage',
        value: function _placeByPercentage(sortable, dragging) {
            var cursor = dragging.__sortable.dragging;
            var xa1 = cursor.offsetLeft;
            var ya1 = cursor.offsetTop;
            var xa2 = cursor.offsetLeft + cursor.offsetWidth;
            var ya2 = cursor.offsetTop + cursor.offsetHeight;
            var largest = 0,
                closest = void 0,
                isBefore = void 0,
                indicator = void 0;
            var element = sortable.element;
            var elements = sortable._getChildren(true);
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = elements[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var child = _step10.value;

                    if (child === dragging) {
                        indicator = true;
                    }
                    var pos = utils.toGlobal(child);
                    var xb1 = pos.x;
                    var yb1 = pos.y;
                    var xb2 = pos.x + child.offsetWidth;
                    var yb2 = pos.y + child.offsetHeight;
                    var percentage = utils.percentage(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2);
                    if (percentage > largest) {
                        largest = percentage;
                        closest = child;
                        isBefore = indicator;
                    }
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

            if (closest) {
                if (closest === dragging) {
                    return 1;
                }
                if (isBefore && closest.nextSibling) {
                    element.insertBefore(dragging, closest.nextSibling);
                    sortable.emit('order-pending', sortable);
                } else {
                    element.insertBefore(dragging, closest);
                    sortable.emit('order-pending', sortable);
                }
                return 2;
            } else {
                return 0;
            }
        }

        /**
         * search for where to place using distance
         * @param {Sortable} sortable
         * @param {HTMLElement} dragging
         * @param {number} x
         * @param {number} y
         * @return {boolean} false=nothing to do
         * @private
         */

    }, {
        key: '_placeByDistance',
        value: function _placeByDistance(sortable, dragging, x, y) {
            if (utils.inside(x, y, dragging)) {
                return true;
            }
            var index = -1;
            if (dragging.__sortable.current === sortable) {
                index = sortable._getIndex(dragging);
                sortable.element.appendChild(dragging);
                // dragging.remove()
            }
            var distance = Infinity,
                closest = void 0;
            var element = sortable.element;
            var elements = sortable._getChildren(true);
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = elements[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var child = _step11.value;

                    if (utils.inside(x, y, child)) {
                        closest = child;
                        break;
                    } else {
                        var measure = utils.distanceToClosestCorner(x, y, child);
                        if (measure < distance) {
                            closest = child;
                            distance = measure;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            element.insertBefore(dragging, closest);
            if (index === sortable._getIndex(dragging)) {
                return true;
            }
            this._maximumPending(dragging, sortable);
            sortable.emit('order-pending', dragging, sortable);
        }

        /**
         * place indicator in an sortable list
         * @param {number} x
         * @param {number} y
         * @param {HTMLElement} dragging
         * @private
         */

    }, {
        key: '_placeInSortableList',
        value: function _placeInSortableList(sortable, x, y, dragging) {
            var element = sortable.element;
            var children = sortable._getChildren();
            if (!children.length) {
                element.appendChild(dragging);
            } else {
                // const percentage = this._placeByPercentage(sortable, dragging)
                if (this._placeByDistance(sortable, dragging, x, y)) {
                    return;
                }
            }
            if (dragging.__sortable.current !== sortable) {
                sortable.emit('add-pending', dragging, sortable);
                if (dragging.__sortable.isCopy) {
                    sortable.emit('copy-pending', dragging, sortable);
                }
                if (dragging.__sortable.current) {
                    if (dragging.__sortable.current !== dragging.__sortable.original) {
                        dragging.__sortable.current.emit('add-remove-pending', dragging, dragging.__sortable.current);
                    } else {
                        dragging.__sortable.current.emit('remove-pending', dragging, dragging.__sortable.current);
                    }
                    this._clearMaximumPending(dragging.__sortable.current);
                    this._maximum(null, dragging.__sortable.current);
                }
                dragging.__sortable.current = sortable;
            }
            this._maximumPending(dragging, sortable);
            sortable.emit('update-pending', dragging, sortable);
        }

        /**
         * set icon if available
         * @param {HTMLElement} dragging
         * @param {Sortable} sortable
         * @param {boolean} [cancel] force cancel (for options.copy)
         * @private
         */

    }, {
        key: '_setIcon',
        value: function _setIcon(element, sortable, cancel) {
            var dragging = element.__sortable.dragging;
            if (dragging && dragging.icon) {
                if (!sortable) {
                    sortable = element.__sortable.original;
                    if (cancel) {
                        dragging.icon.src = sortable.options.icons.cancel;
                    } else {
                        dragging.icon.src = sortable.options.offList === 'delete' ? sortable.options.icons.delete : sortable.options.icons.cancel;
                    }
                } else {
                    if (element.__sortable.isCopy) {
                        dragging.icon.src = sortable.options.icons.copy;
                    } else {
                        dragging.icon.src = element.__sortable.original === sortable ? sortable.options.icons.reorder : sortable.options.icons.move;
                    }
                }
            }
        }

        /**
         * add a maximum counter to the element
         * @param {HTMLElement} element
         * @param {Sortable} sortable
         * @private
         */

    }, {
        key: '_maximumCounter',
        value: function _maximumCounter(element, sortable) {
            var count = -1;
            if (sortable.options.maximum) {
                var children = sortable._getChildren();
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                    for (var _iterator12 = children[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                        var child = _step12.value;

                        if (child !== element && child.__sortable) {
                            count = child.__sortable.maximum > count ? child.__sortable.maximum : count;
                        }
                    }
                } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                            _iterator12.return();
                        }
                    } finally {
                        if (_didIteratorError12) {
                            throw _iteratorError12;
                        }
                    }
                }
            }
            element.__sortable.maximum = count + 1;
        }

        /**
         * handle maximum
         * @private
         */

    }, {
        key: '_maximum',
        value: function _maximum(element, sortable) {
            if (sortable.options.maximum) {
                var children = sortable._getChildren();
                if (children.length > sortable.options.maximum) {
                    if (sortable.removePending) {
                        while (sortable.removePending.length) {
                            var child = sortable.removePending.pop();
                            child.style.display = child.__sortable.display === 'unset' ? '' : child.__sortable.display;
                            child.__sortable.display = null;
                            child.remove();
                            sortable.emit('maximum-remove', child, sortable);
                        }
                        sortable.removePending = null;
                    }
                }
                if (element) {
                    this._maximumCounter(element, sortable);
                }
            }
        }

        /**
         * clear pending list
         * @param {Sortable} sortable
         * @private
         */

    }, {
        key: '_clearMaximumPending',
        value: function _clearMaximumPending(sortable) {
            if (sortable.removePending) {
                while (sortable.removePending.length) {
                    var child = sortable.removePending.pop();
                    child.style.display = child.__sortable.display === 'unset' ? '' : child.__sortable.display;
                    child.__sortable.display = null;
                }
                sortable.removePending = null;
            }
        }

        /**
         * handle pending maximum
         * @param {HTMLElement} element
         * @param {Sortable} sortable
         * @private
         */

    }, {
        key: '_maximumPending',
        value: function _maximumPending(element, sortable) {
            if (sortable.options.maximum) {
                var children = sortable._getChildren();
                if (children.length > sortable.options.maximum) {
                    var savePending = sortable.removePending ? sortable.removePending.slice(0) : [];
                    this._clearMaximumPending(sortable);
                    sortable.removePending = [];
                    var sort = void 0;
                    if (sortable.options.maximumFIFO) {
                        sort = children.sort(function (a, b) {
                            return a === element ? 1 : a.__sortable.maximum - b.__sortable.maximum;
                        });
                    } else {
                        sort = children.sort(function (a, b) {
                            return a === element ? 1 : b.__sortable.maximum - a.__sortable.maximum;
                        });
                    }
                    for (var i = 0; i < children.length - sortable.options.maximum; i++) {
                        var hide = sort[i];
                        hide.__sortable.display = hide.style.display || 'unset';
                        hide.style.display = 'none';
                        sortable.removePending.push(hide);
                        if (savePending.indexOf(hide) === -1) {
                            sortable.emit('maximum-remove-pending', hide, sortable);
                        }
                    }
                }
            }
        }

        /**
         * change cursor during mousedown
         * @param {MouseEvent} e
         * @private
         */

    }, {
        key: '_mouseDown',
        value: function _mouseDown(e) {
            if (this.options.cursorHover) {
                utils.style(e.currentTarget, 'cursor', this.options.cursorDown);
            }
        }

        /**
         * change cursor during mouseup
         * @param {MouseEvent} e
         * @private
         */

    }, {
        key: '_mouseUp',
        value: function _mouseUp(e) {
            this.emit('clicked', e.currentTarget, this);
            if (this.options.cursorHover) {
                utils.style(e.currentTarget, 'cursor', this.options.cursorHover);
            }
        }
    }], [{
        key: 'create',


        /**
         * create multiple sortable elements
         * @param {HTMLElements[]} elements
         * @param {object} options - see constructor for options
         */
        value: function create(elements, options) {
            var results = [];
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = elements[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var element = _step13.value;

                    results.push(new Sortable(element, options));
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }

            return results;
        }
    }, {
        key: 'defaults',
        get: function get() {
            return defaults;
        }
    }]);

    return Sortable;
}(Events);

/**
 * fires when an element is picked up because it was moved beyond the options.threshold
 * @event Sortable#pickup
 * @property {HTMLElement} element being dragged
 * @property {Sortable} current sortable with element placeholder
 */

/**
 * fires when a sortable is reordered
 * @event Sortable#order
 * @property {HTMLElement} element that was reordered
 * @property {Sortable} sortable where element was placed
 */

/**
 * fires when an element is added to this sortable
 * @event Sortable#add
 * @property {HTMLElement} element added
 * @property {Sortable} sortable where element was added
 */

/**
 * fires when an element is removed from this sortable
 * @event Sortable#remove
 * @property {HTMLElement} element removed
 * @property {Sortable} sortable where element was removed
 */

/**
 * fires when an element is removed from all sortables
 * @event Sortable#delete
 * @property {HTMLElement} element removed
 * @property {Sortable} sortable where element was dragged from
 */

/**
 * fires when a copy of an element is dropped
 * @event Sortable#copy
 * @property {HTMLElement} element removed
 * @property {Sortable} sortable where element was dragged from
 */

/**
 * fires when the sortable is updated with an add, remove, or order change
 * @event Sortable#update
 * @property {HTMLElement} element changed
 * @property {Sortable} sortable with element
 */

/**
 * fires when an element is removed because maximum was reached for the sortable
 * @event Sortable#maximum-remove
 * @property {HTMLElement} element removed
 * @property {Sortable} sortable where element was dragged from
 */

/**
 * fires when order was changed but element was not dropped yet
 * @event Sortable#order-pending
 * @property {HTMLElement} element being dragged
 * @property {Sortable} current sortable with element placeholder
 */

/**
 * fires when element is added but not dropped yet
 * @event Sortable#add-pending
 * @property {HTMLElement} element being dragged
 * @property {Sortable} current sortable with element placeholder
 */

/**
 * fires when element is removed but not dropped yet
 * @event Sortable#remove-pending
 * @property {HTMLElement} element being dragged
 * @property {Sortable} current sortable with element placeholder
 */

/**
 * fires when element is removed after being temporarily added
 * @event Sortable#add-remove-pending
 * @property {HTMLElement} element being dragged
 * @property {Sortable} current sortable with element placeholder
 */

/**
 * fires when an element is about to be removed from all sortables
 * @event Sortable#delete-pending
 * @property {HTMLElement} element removed
 * @property {Sortable} sortable where element was dragged from
 */

/**
 * fires when an element is added, removed, or reorder but element has not dropped yet
 * @event Sortable#update-pending
 * @property {HTMLElement} element being dragged
 * @property {Sortable} current sortable with element placeholder
 */

/**
 * fires when a copy of an element is about to drop
 * @event Sortable#copy-pending
 * @property {HTMLElement} element removed
 * @property {Sortable} sortable where element was dragged from
 */

/**
 * fires when an element is about to be removed because maximum was reached for the sortable
 * @event Sortable#maximum-remove-pending
 * @property {HTMLElement} element removed
 * @property {Sortable} sortable where element was dragged from
 */

/**
 * fires when an element is clicked without dragging
 * @event Sortable#clicked
 * @property {HTMLElement} element clicked
 * @property {Sortable} sortable where element is a child
 */

module.exports = Sortable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zb3J0YWJsZS5qcyJdLCJuYW1lcyI6WyJFdmVudHMiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJ1dGlscyIsIlNvcnRhYmxlIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJfYWRkVG9HbG9iYWxUcmFja2VyIiwiZWxlbWVudHMiLCJfZ2V0Q2hpbGRyZW4iLCJldmVudHMiLCJkcmFnU3RhcnQiLCJlIiwiX2RyYWdTdGFydCIsImRyYWdFbmQiLCJfZHJhZ0VuZCIsImRyYWdPdmVyIiwiX2RyYWdPdmVyIiwiZHJvcCIsIl9kcm9wIiwiZHJhZ0xlYXZlIiwiX2RyYWdMZWF2ZSIsIm1vdXNlRG93biIsIl9tb3VzZURvd24iLCJtb3VzZVVwIiwiX21vdXNlVXAiLCJjaGlsZCIsImRyYWdDbGFzcyIsImNvbnRhaW5zQ2xhc3NOYW1lIiwiYXR0YWNoRWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjdXJzb3JIb3ZlciIsInN0eWxlIiwiY3Vyc29yRG93biIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFbGVtZW50IiwiaW5kZXgiLCJzb3J0IiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJhcHBlbmRDaGlsZCIsImluc2VydEJlZm9yZSIsImlkIiwib3JkZXJJZCIsImRyYWdPcmRlciIsImdldEF0dHJpYnV0ZSIsIm9yZGVySWRJc051bWJlciIsInBhcnNlRmxvYXQiLCJmb3VuZCIsInJldmVyc2VPcmRlciIsImkiLCJjaGlsZERyYWdPcmRlciIsIm9yZGVySXNOdW1iZXIiLCJwYXJlbnROb2RlIiwiX19zb3J0YWJsZSIsIm9yaWdpbmFsIiwic29ydGFibGUiLCJfbWF4aW11bUNvdW50ZXIiLCJuYW1lIiwidHJhY2tlciIsImNvdW50ZXIiLCJjb3B5Iiwic2V0QXR0cmlidXRlIiwiZHJhZ0ltYWdlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYmFja2dyb3VuZCIsInBvc2l0aW9uIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiekluZGV4IiwiYm9keSIsIl9ib2R5RHJhZ092ZXIiLCJfYm9keURyb3AiLCJsaXN0IiwicHVzaCIsImRhdGFUcmFuc2ZlciIsInR5cGVzIiwiZ2V0RWxlbWVudEJ5SWQiLCJfZmluZENsb3Nlc3QiLCJsYXN0IiwiTWF0aCIsImFicyIsIngiLCJwYWdlWCIsInRocmVzaG9sZCIsInkiLCJwYWdlWSIsIl91cGRhdGVEcmFnZ2luZyIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiX3BsYWNlSW5MaXN0IiwiZHJvcEVmZmVjdCIsIl9ub0Ryb3AiLCJjYW5jZWwiLCJfc2V0SWNvbiIsIm9mZkxpc3QiLCJkaXNwbGF5IiwiZW1pdCIsIl9yZXBsYWNlSW5MaXN0IiwiY3VycmVudCIsIl9jbGVhck1heGltdW1QZW5kaW5nIiwiX3JlbW92ZURyYWdnaW5nIiwicmVtb3ZlIiwiY3VycmVudFRhcmdldCIsImRyYWdnaW5nIiwiaWNvbiIsImNsb25lTm9kZSIsImRyYWdTdHlsZSIsInBvcyIsInRvR2xvYmFsIiwib2Zmc2V0IiwidXNlSWNvbnMiLCJpbWFnZSIsIkltYWdlIiwic3JjIiwiaWNvbnMiLCJyZW9yZGVyIiwidHJhbnNmb3JtIiwib2Zmc2V0TGVmdCIsIm9mZnNldFdpZHRoIiwib2Zmc2V0VG9wIiwib2Zmc2V0SGVpZ2h0IiwidGFyZ2V0IiwiaXNDb3B5IiwiY2xlYXJEYXRhIiwic2V0RGF0YSIsInNldERyYWdJbWFnZSIsIl9nZXRJbmRleCIsIl9tYXhpbXVtIiwibWluIiwiSW5maW5pdHkiLCJyZWxhdGVkIiwiaW5zaWRlIiwiY2FsY3VsYXRlIiwiZGlzdGFuY2VUb0Nsb3Nlc3RDb3JuZXIiLCJfcGxhY2VJblNvcnRhYmxlTGlzdCIsIl9wbGFjZUluT3JkZXJlZExpc3QiLCJiYXNlIiwic2VhcmNoIiwicmVzdWx0cyIsImluZGV4T2YiLCJjbGFzc05hbWUiLCJfdHJhdmVyc2VDaGlsZHJlbiIsIm9yZGVyIiwiZGVlcFNlYXJjaCIsIm9yZGVyQ2xhc3MiLCJfbWF4aW11bVBlbmRpbmciLCJjdXJzb3IiLCJ4YTEiLCJ5YTEiLCJ4YTIiLCJ5YTIiLCJsYXJnZXN0IiwiY2xvc2VzdCIsImlzQmVmb3JlIiwiaW5kaWNhdG9yIiwieGIxIiwieWIxIiwieGIyIiwieWIyIiwicGVyY2VudGFnZSIsIm5leHRTaWJsaW5nIiwiZGlzdGFuY2UiLCJtZWFzdXJlIiwiX3BsYWNlQnlEaXN0YW5jZSIsImRlbGV0ZSIsIm1vdmUiLCJjb3VudCIsIm1heGltdW0iLCJyZW1vdmVQZW5kaW5nIiwicG9wIiwic2F2ZVBlbmRpbmciLCJzbGljZSIsIm1heGltdW1GSUZPIiwiYSIsImIiLCJoaWRlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLFNBQVNDLFFBQVEsZUFBUixDQUFmOztBQUVBLElBQU1DLFdBQVdELFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU1FLFFBQVFGLFFBQVEsU0FBUixDQUFkOztJQUVNRyxROzs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0Q0Esc0JBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQ0E7QUFBQTs7QUFBQTs7QUFFSSxjQUFLQSxPQUFMLEdBQWVILE1BQU1HLE9BQU4sQ0FBY0EsT0FBZCxFQUF1QkosUUFBdkIsQ0FBZjtBQUNBLGNBQUtHLE9BQUwsR0FBZUEsT0FBZjtBQUNBLGNBQUtFLG1CQUFMO0FBQ0EsWUFBTUMsV0FBVyxNQUFLQyxZQUFMLEVBQWpCO0FBQ0EsY0FBS0MsTUFBTCxHQUFjO0FBQ1ZDLHVCQUFXLG1CQUFDQyxDQUFEO0FBQUEsdUJBQU8sTUFBS0MsVUFBTCxDQUFnQkQsQ0FBaEIsQ0FBUDtBQUFBLGFBREQ7QUFFVkUscUJBQVMsaUJBQUNGLENBQUQ7QUFBQSx1QkFBTyxNQUFLRyxRQUFMLENBQWNILENBQWQsQ0FBUDtBQUFBLGFBRkM7QUFHVkksc0JBQVUsa0JBQUNKLENBQUQ7QUFBQSx1QkFBTyxNQUFLSyxTQUFMLENBQWVMLENBQWYsQ0FBUDtBQUFBLGFBSEE7QUFJVk0sa0JBQU0sY0FBQ04sQ0FBRDtBQUFBLHVCQUFPLE1BQUtPLEtBQUwsQ0FBV1AsQ0FBWCxDQUFQO0FBQUEsYUFKSTtBQUtWUSx1QkFBVyxtQkFBQ1IsQ0FBRDtBQUFBLHVCQUFPLE1BQUtTLFVBQUwsQ0FBZ0JULENBQWhCLENBQVA7QUFBQSxhQUxEO0FBTVZVLHVCQUFXLG1CQUFDVixDQUFEO0FBQUEsdUJBQU8sTUFBS1csVUFBTCxDQUFnQlgsQ0FBaEIsQ0FBUDtBQUFBLGFBTkQ7QUFPVlkscUJBQVMsaUJBQUNaLENBQUQ7QUFBQSx1QkFBTyxNQUFLYSxRQUFMLENBQWNiLENBQWQsQ0FBUDtBQUFBO0FBUEMsU0FBZDtBQU5KO0FBQUE7QUFBQTs7QUFBQTtBQWVJLGlDQUFrQkosUUFBbEIsOEhBQ0E7QUFBQSxvQkFEU2tCLEtBQ1Q7O0FBQ0ksb0JBQUksQ0FBQyxNQUFLcEIsT0FBTCxDQUFhcUIsU0FBZCxJQUEyQnhCLE1BQU15QixpQkFBTixDQUF3QkYsS0FBeEIsRUFBK0IsTUFBS3BCLE9BQUwsQ0FBYXFCLFNBQTVDLENBQS9CLEVBQ0E7QUFDSSwwQkFBS0UsYUFBTCxDQUFtQkgsS0FBbkI7QUFDSDtBQUNKO0FBckJMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBc0JJckIsZ0JBQVF5QixnQkFBUixDQUF5QixVQUF6QixFQUFxQyxNQUFLcEIsTUFBTCxDQUFZTSxRQUFqRDtBQUNBWCxnQkFBUXlCLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLE1BQUtwQixNQUFMLENBQVlRLElBQTdDO0FBQ0FiLGdCQUFReUIsZ0JBQVIsQ0FBeUIsV0FBekIsRUFBc0MsTUFBS3BCLE1BQUwsQ0FBWVUsU0FBbEQ7QUFDQSxZQUFJLE1BQUtkLE9BQUwsQ0FBYXlCLFdBQWpCLEVBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDSSxzQ0FBa0IsTUFBS3RCLFlBQUwsRUFBbEIsbUlBQ0E7QUFBQSx3QkFEU2lCLE1BQ1Q7O0FBQ0l2QiwwQkFBTTZCLEtBQU4sQ0FBWU4sTUFBWixFQUFtQixRQUFuQixFQUE2QixNQUFLcEIsT0FBTCxDQUFheUIsV0FBMUM7QUFDQSx3QkFBSSxNQUFLekIsT0FBTCxDQUFhMkIsVUFBakIsRUFDQTtBQUNJUCwrQkFBTUksZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBb0MsTUFBS3BCLE1BQUwsQ0FBWVksU0FBaEQ7QUFDSDtBQUNESSwyQkFBTUksZ0JBQU4sQ0FBdUIsU0FBdkIsRUFBa0MsTUFBS3BCLE1BQUwsQ0FBWWMsT0FBOUM7QUFDSDtBQVRMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVQztBQXBDTDtBQXFDQzs7QUFFRDs7Ozs7OztrQ0FJQTtBQUNJLGlCQUFLbkIsT0FBTCxDQUFhNkIsbUJBQWIsQ0FBaUMsVUFBakMsRUFBNkMsS0FBS3hCLE1BQUwsQ0FBWU0sUUFBekQ7QUFDQSxpQkFBS1gsT0FBTCxDQUFhNkIsbUJBQWIsQ0FBaUMsTUFBakMsRUFBeUMsS0FBS3hCLE1BQUwsQ0FBWVEsSUFBckQ7QUFDQSxnQkFBTVYsV0FBVyxLQUFLQyxZQUFMLEVBQWpCO0FBSEo7QUFBQTtBQUFBOztBQUFBO0FBSUksc0NBQWtCRCxRQUFsQixtSUFDQTtBQUFBLHdCQURTa0IsS0FDVDs7QUFDSSx5QkFBS1MsYUFBTCxDQUFtQlQsS0FBbkI7QUFDSDtBQUNEO0FBUko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNDOztBQUVEOzs7Ozs7Ozs7QUF3QkE7Ozs7Ozs0QkFNSXJCLE8sRUFBUytCLEssRUFDYjtBQUNJLGlCQUFLUCxhQUFMLENBQW1CeEIsT0FBbkI7QUFDQSxnQkFBSSxLQUFLQyxPQUFMLENBQWErQixJQUFqQixFQUNBO0FBQ0ksb0JBQUksT0FBT0QsS0FBUCxLQUFpQixXQUFqQixJQUFnQ0EsU0FBUyxLQUFLL0IsT0FBTCxDQUFhaUMsUUFBYixDQUFzQkMsTUFBbkUsRUFDQTtBQUNJLHlCQUFLbEMsT0FBTCxDQUFhbUMsV0FBYixDQUF5Qm5DLE9BQXpCO0FBQ0gsaUJBSEQsTUFLQTtBQUNJLHlCQUFLQSxPQUFMLENBQWFvQyxZQUFiLENBQTBCcEMsT0FBMUIsRUFBbUMsS0FBS0EsT0FBTCxDQUFhaUMsUUFBYixDQUFzQkYsUUFBUSxDQUE5QixDQUFuQztBQUNIO0FBQ0osYUFWRCxNQVlBO0FBQ0ksb0JBQU1NLEtBQUssS0FBS3BDLE9BQUwsQ0FBYXFDLE9BQXhCO0FBQ0Esb0JBQUlDLFlBQVl2QyxRQUFRd0MsWUFBUixDQUFxQkgsRUFBckIsQ0FBaEI7QUFDQUUsNEJBQVksS0FBS3RDLE9BQUwsQ0FBYXdDLGVBQWIsR0FBK0JDLFdBQVdILFNBQVgsQ0FBL0IsR0FBdURBLFNBQW5FO0FBQ0Esb0JBQUlJLGNBQUo7QUFDQSxvQkFBTVYsV0FBVyxLQUFLN0IsWUFBTCxDQUFrQixJQUFsQixDQUFqQjtBQUNBLG9CQUFJLEtBQUtILE9BQUwsQ0FBYTJDLFlBQWpCLEVBQ0E7QUFDSSx5QkFBSyxJQUFJQyxJQUFJWixTQUFTQyxNQUFULEdBQWtCLENBQS9CLEVBQWtDVyxLQUFLLENBQXZDLEVBQTBDQSxHQUExQyxFQUNBO0FBQ0ksNEJBQU14QixRQUFRWSxTQUFTWSxDQUFULENBQWQ7QUFDQSw0QkFBSUMsaUJBQWlCekIsTUFBTW1CLFlBQU4sQ0FBbUJILEVBQW5CLENBQXJCO0FBQ0FTLHlDQUFpQixLQUFLN0MsT0FBTCxDQUFhOEMsYUFBYixHQUE2QkwsV0FBV0ksY0FBWCxDQUE3QixHQUEwREEsY0FBM0U7QUFDQSw0QkFBSVAsWUFBWU8sY0FBaEIsRUFDQTtBQUNJekIsa0NBQU0yQixVQUFOLENBQWlCWixZQUFqQixDQUE4QnBDLE9BQTlCLEVBQXVDcUIsS0FBdkM7QUFDQXNCLG9DQUFRLElBQVI7QUFDQTtBQUNIO0FBQ0o7QUFDSixpQkFkRCxNQWdCQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNJLDhDQUFrQlYsUUFBbEIsbUlBQ0E7QUFBQSxnQ0FEU1osT0FDVDs7QUFDSSxnQ0FBSXlCLGtCQUFpQnpCLFFBQU1tQixZQUFOLENBQW1CSCxFQUFuQixDQUFyQjtBQUNBUyw4Q0FBaUIsS0FBSzdDLE9BQUwsQ0FBYThDLGFBQWIsR0FBNkJMLFdBQVdJLGVBQVgsQ0FBN0IsR0FBMERBLGVBQTNFO0FBQ0EsZ0NBQUlQLFlBQVlPLGVBQWhCLEVBQ0E7QUFDSXpCLHdDQUFNMkIsVUFBTixDQUFpQlosWUFBakIsQ0FBOEJwQyxPQUE5QixFQUF1Q3FCLE9BQXZDO0FBQ0FzQix3Q0FBUSxJQUFSO0FBQ0E7QUFDSDtBQUNKO0FBWEw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlDO0FBQ0Qsb0JBQUksQ0FBQ0EsS0FBTCxFQUNBO0FBQ0kseUJBQUszQyxPQUFMLENBQWFtQyxXQUFiLENBQXlCbkMsT0FBekI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7Ozs7Ozs7O3NDQUtjQSxPLEVBQ2Q7QUFDSSxnQkFBSUEsUUFBUWlELFVBQVosRUFDQTtBQUNJakQsd0JBQVFpRCxVQUFSLENBQW1CQyxRQUFuQixHQUE4QixJQUE5QjtBQUNILGFBSEQsTUFLQTtBQUNJbEQsd0JBQVFpRCxVQUFSLEdBQXFCO0FBQ2pCRSw4QkFBVSxJQURPO0FBRWpCRCw4QkFBVTs7QUFHZDtBQUxxQixpQkFBckIsQ0FNQSxLQUFLRSxlQUFMLENBQXFCcEQsT0FBckIsRUFBOEIsSUFBOUI7O0FBRUE7QUFDQSxvQkFBSSxDQUFDQSxRQUFRcUMsRUFBYixFQUNBO0FBQ0lyQyw0QkFBUXFDLEVBQVIsR0FBYSxnQkFBZ0IsS0FBS3BDLE9BQUwsQ0FBYW9ELElBQTdCLEdBQW9DLEdBQXBDLEdBQTBDdEQsU0FBU3VELE9BQVQsQ0FBaUIsS0FBS3JELE9BQUwsQ0FBYW9ELElBQTlCLEVBQW9DRSxPQUEzRjtBQUNBeEQsNkJBQVN1RCxPQUFULENBQWlCLEtBQUtyRCxPQUFMLENBQWFvRCxJQUE5QixFQUFvQ0UsT0FBcEM7QUFDSDtBQUNELG9CQUFJLEtBQUt0RCxPQUFMLENBQWF1RCxJQUFqQixFQUNBO0FBQ0l4RCw0QkFBUWlELFVBQVIsQ0FBbUJPLElBQW5CLEdBQTBCLENBQTFCO0FBQ0g7QUFDRHhELHdCQUFReUIsZ0JBQVIsQ0FBeUIsV0FBekIsRUFBc0MsS0FBS3BCLE1BQUwsQ0FBWUMsU0FBbEQ7QUFDQU4sd0JBQVF5QixnQkFBUixDQUF5QixTQUF6QixFQUFvQyxLQUFLcEIsTUFBTCxDQUFZSSxPQUFoRDtBQUNBVCx3QkFBUXlELFlBQVIsQ0FBcUIsV0FBckIsRUFBa0MsSUFBbEM7QUFDSDtBQUNKOztBQUVEOzs7Ozs7OztzQ0FLY3pELE8sRUFDZDtBQUNJQSxvQkFBUTZCLG1CQUFSLENBQTRCLFdBQTVCLEVBQXlDLEtBQUt4QixNQUFMLENBQVlDLFNBQXJEO0FBQ0FOLG9CQUFRNkIsbUJBQVIsQ0FBNEIsU0FBNUIsRUFBdUMsS0FBS3hCLE1BQUwsQ0FBWUksT0FBbkQ7QUFDQVQsb0JBQVF5RCxZQUFSLENBQXFCLFdBQXJCLEVBQWtDLEtBQWxDO0FBQ0g7O0FBRUQ7Ozs7Ozs7OENBS0E7QUFBQTs7QUFDSSxnQkFBSSxDQUFDMUQsU0FBU3VELE9BQWQsRUFDQTtBQUNJdkQseUJBQVMyRCxTQUFULEdBQXFCQyxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQXJCO0FBQ0E3RCx5QkFBUzJELFNBQVQsQ0FBbUIvQixLQUFuQixDQUF5QmtDLFVBQXpCLEdBQXNDLGFBQXRDO0FBQ0E5RCx5QkFBUzJELFNBQVQsQ0FBbUIvQixLQUFuQixDQUF5Qm1DLFFBQXpCLEdBQW9DLE9BQXBDO0FBQ0EvRCx5QkFBUzJELFNBQVQsQ0FBbUIvQixLQUFuQixDQUF5Qm9DLElBQXpCLEdBQWdDLENBQUMsRUFBakM7QUFDQWhFLHlCQUFTMkQsU0FBVCxDQUFtQi9CLEtBQW5CLENBQXlCcUMsR0FBekIsR0FBK0IsQ0FBQyxFQUFoQztBQUNBakUseUJBQVMyRCxTQUFULENBQW1CL0IsS0FBbkIsQ0FBeUJzQyxLQUF6QixHQUFpQ2xFLFNBQVMyRCxTQUFULENBQW1CL0IsS0FBbkIsQ0FBeUJ1QyxNQUF6QixHQUFrQyxLQUFuRTtBQUNBbkUseUJBQVMyRCxTQUFULENBQW1CL0IsS0FBbkIsQ0FBeUJ3QyxNQUF6QixHQUFrQyxDQUFDLENBQW5DO0FBQ0FwRSx5QkFBUzJELFNBQVQsQ0FBbUJyQixFQUFuQixHQUF3QixvQkFBeEI7QUFDQXNCLHlCQUFTUyxJQUFULENBQWNqQyxXQUFkLENBQTBCcEMsU0FBUzJELFNBQW5DO0FBQ0EzRCx5QkFBU3VELE9BQVQsR0FBbUIsRUFBbkI7QUFDQUsseUJBQVNTLElBQVQsQ0FBYzNDLGdCQUFkLENBQStCLFVBQS9CLEVBQTJDLFVBQUNsQixDQUFEO0FBQUEsMkJBQU8sT0FBSzhELGFBQUwsQ0FBbUI5RCxDQUFuQixDQUFQO0FBQUEsaUJBQTNDO0FBQ0FvRCx5QkFBU1MsSUFBVCxDQUFjM0MsZ0JBQWQsQ0FBK0IsTUFBL0IsRUFBdUMsVUFBQ2xCLENBQUQ7QUFBQSwyQkFBTyxPQUFLK0QsU0FBTCxDQUFlL0QsQ0FBZixDQUFQO0FBQUEsaUJBQXZDO0FBQ0g7QUFDRCxnQkFBSVIsU0FBU3VELE9BQVQsQ0FBaUIsS0FBS3JELE9BQUwsQ0FBYW9ELElBQTlCLENBQUosRUFDQTtBQUNJdEQseUJBQVN1RCxPQUFULENBQWlCLEtBQUtyRCxPQUFMLENBQWFvRCxJQUE5QixFQUFvQ2tCLElBQXBDLENBQXlDQyxJQUF6QyxDQUE4QyxJQUE5QztBQUNILGFBSEQsTUFLQTtBQUNJekUseUJBQVN1RCxPQUFULENBQWlCLEtBQUtyRCxPQUFMLENBQWFvRCxJQUE5QixJQUFzQyxFQUFFa0IsTUFBTSxDQUFDLElBQUQsQ0FBUixFQUFnQmhCLFNBQVMsQ0FBekIsRUFBdEM7QUFDSDtBQUNKOztBQUVEOzs7Ozs7OztzQ0FLY2hELEMsRUFDZDtBQUNJLGdCQUFNOEMsT0FBTzlDLEVBQUVrRSxZQUFGLENBQWVDLEtBQWYsQ0FBcUIsQ0FBckIsQ0FBYjtBQUNBLGdCQUFJM0UsU0FBU3VELE9BQVQsQ0FBaUJELElBQWpCLENBQUosRUFDQTtBQUNJLG9CQUFNaEIsS0FBSzlCLEVBQUVrRSxZQUFGLENBQWVDLEtBQWYsQ0FBcUIsQ0FBckIsQ0FBWDtBQUNBLG9CQUFNMUUsVUFBVTJELFNBQVNnQixjQUFULENBQXdCdEMsRUFBeEIsQ0FBaEI7QUFDQSxvQkFBTWMsV0FBVyxLQUFLeUIsWUFBTCxDQUFrQnJFLENBQWxCLEVBQXFCUixTQUFTdUQsT0FBVCxDQUFpQkQsSUFBakIsRUFBdUJrQixJQUE1QyxFQUFrRHZFLE9BQWxELENBQWpCO0FBQ0Esb0JBQUlBLE9BQUosRUFDQTtBQUNJLHdCQUFJbUQsUUFBSixFQUNBO0FBQ0ksNEJBQUlBLFNBQVMwQixJQUFULElBQWlCQyxLQUFLQyxHQUFMLENBQVM1QixTQUFTMEIsSUFBVCxDQUFjRyxDQUFkLEdBQWtCekUsRUFBRTBFLEtBQTdCLElBQXNDOUIsU0FBU2xELE9BQVQsQ0FBaUJpRixTQUF4RSxJQUFxRkosS0FBS0MsR0FBTCxDQUFTNUIsU0FBUzBCLElBQVQsQ0FBY00sQ0FBZCxHQUFrQjVFLEVBQUU2RSxLQUE3QixJQUFzQ2pDLFNBQVNsRCxPQUFULENBQWlCaUYsU0FBaEosRUFDQTtBQUNJL0IscUNBQVNrQyxlQUFULENBQXlCOUUsQ0FBekIsRUFBNEJQLE9BQTVCO0FBQ0FPLDhCQUFFK0UsY0FBRjtBQUNBL0UsOEJBQUVnRixlQUFGO0FBQ0E7QUFDSDtBQUNEcEMsaUNBQVMwQixJQUFULEdBQWdCLEVBQUVHLEdBQUd6RSxFQUFFMEUsS0FBUCxFQUFjRSxHQUFHNUUsRUFBRTZFLEtBQW5CLEVBQWhCO0FBQ0FqQyxpQ0FBU3FDLFlBQVQsQ0FBc0JyQyxRQUF0QixFQUFnQzVDLEVBQUUwRSxLQUFsQyxFQUF5QzFFLEVBQUU2RSxLQUEzQyxFQUFrRHBGLE9BQWxEO0FBQ0FPLDBCQUFFa0UsWUFBRixDQUFlZ0IsVUFBZixHQUE0QixNQUE1QjtBQUNBdEMsaUNBQVNrQyxlQUFULENBQXlCOUUsQ0FBekIsRUFBNEJQLE9BQTVCO0FBQ0gscUJBYkQsTUFlQTtBQUNJLDZCQUFLMEYsT0FBTCxDQUFhbkYsQ0FBYjtBQUNIO0FBQ0RBLHNCQUFFK0UsY0FBRjtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7O2dDQU1RL0UsQyxFQUFHb0YsTSxFQUNYO0FBQ0lwRixjQUFFa0UsWUFBRixDQUFlZ0IsVUFBZixHQUE0QixNQUE1QjtBQUNBLGdCQUFNcEQsS0FBSzlCLEVBQUVrRSxZQUFGLENBQWVDLEtBQWYsQ0FBcUIsQ0FBckIsQ0FBWDtBQUNBLGdCQUFNMUUsVUFBVTJELFNBQVNnQixjQUFULENBQXdCdEMsRUFBeEIsQ0FBaEI7QUFDQSxnQkFBSXJDLE9BQUosRUFDQTtBQUNJLHFCQUFLcUYsZUFBTCxDQUFxQjlFLENBQXJCLEVBQXdCUCxPQUF4QjtBQUNBLHFCQUFLNEYsUUFBTCxDQUFjNUYsT0FBZCxFQUF1QixJQUF2QixFQUE2QjJGLE1BQTdCO0FBQ0Esb0JBQUksQ0FBQ0EsTUFBTCxFQUNBO0FBQ0ksd0JBQUkzRixRQUFRaUQsVUFBUixDQUFtQkMsUUFBbkIsQ0FBNEJqRCxPQUE1QixDQUFvQzRGLE9BQXBDLEtBQWdELFFBQXBELEVBQ0E7QUFDSSw0QkFBSSxDQUFDN0YsUUFBUWlELFVBQVIsQ0FBbUI2QyxPQUF4QixFQUNBO0FBQ0k5RixvQ0FBUWlELFVBQVIsQ0FBbUI2QyxPQUFuQixHQUE2QjlGLFFBQVEyQixLQUFSLENBQWNtRSxPQUFkLElBQXlCLE9BQXREO0FBQ0E5RixvQ0FBUTJCLEtBQVIsQ0FBY21FLE9BQWQsR0FBd0IsTUFBeEI7QUFDQTlGLG9DQUFRaUQsVUFBUixDQUFtQkMsUUFBbkIsQ0FBNEI2QyxJQUE1QixDQUFpQyxnQkFBakMsRUFBbUQvRixPQUFuRCxFQUE0REEsUUFBUWlELFVBQVIsQ0FBbUJDLFFBQS9FO0FBQ0g7QUFDSixxQkFSRCxNQVNLLElBQUksQ0FBQ2xELFFBQVFpRCxVQUFSLENBQW1CQyxRQUFuQixDQUE0QmpELE9BQTVCLENBQW9DdUQsSUFBekMsRUFDTDtBQUNJLDZCQUFLd0MsY0FBTCxDQUFvQmhHLFFBQVFpRCxVQUFSLENBQW1CQyxRQUF2QyxFQUFpRGxELE9BQWpEO0FBQ0g7QUFDSjtBQUNELG9CQUFJQSxRQUFRaUQsVUFBUixDQUFtQmdELE9BQXZCLEVBQ0E7QUFDSSx5QkFBS0Msb0JBQUwsQ0FBMEJsRyxRQUFRaUQsVUFBUixDQUFtQmdELE9BQTdDO0FBQ0FqRyw0QkFBUWlELFVBQVIsQ0FBbUJnRCxPQUFuQixDQUEyQkYsSUFBM0IsQ0FBZ0Msb0JBQWhDLEVBQXNEL0YsT0FBdEQsRUFBK0RBLFFBQVFpRCxVQUFSLENBQW1CZ0QsT0FBbEY7QUFDQWpHLDRCQUFRaUQsVUFBUixDQUFtQmdELE9BQW5CLENBQTJCRixJQUEzQixDQUFnQyxnQkFBaEMsRUFBa0QvRixPQUFsRCxFQUEyREEsUUFBUWlELFVBQVIsQ0FBbUJnRCxPQUE5RTtBQUNBakcsNEJBQVFpRCxVQUFSLENBQW1CZ0QsT0FBbkIsR0FBNkIsSUFBN0I7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7Ozs7Ozs7O2tDQUtVMUYsQyxFQUNWO0FBQ0ksZ0JBQU04QyxPQUFPOUMsRUFBRWtFLFlBQUYsQ0FBZUMsS0FBZixDQUFxQixDQUFyQixDQUFiO0FBQ0EsZ0JBQUkzRSxTQUFTdUQsT0FBVCxDQUFpQkQsSUFBakIsQ0FBSixFQUNBO0FBQ0ksb0JBQU1oQixLQUFLOUIsRUFBRWtFLFlBQUYsQ0FBZUMsS0FBZixDQUFxQixDQUFyQixDQUFYO0FBQ0Esb0JBQU0xRSxVQUFVMkQsU0FBU2dCLGNBQVQsQ0FBd0J0QyxFQUF4QixDQUFoQjtBQUNBLG9CQUFNYyxXQUFXLEtBQUt5QixZQUFMLENBQWtCckUsQ0FBbEIsRUFBcUJSLFNBQVN1RCxPQUFULENBQWlCRCxJQUFqQixFQUF1QmtCLElBQTVDLEVBQWtEdkUsT0FBbEQsQ0FBakI7QUFDQSxvQkFBSUEsT0FBSixFQUNBO0FBQ0ksd0JBQUltRCxRQUFKLEVBQ0E7QUFDSTVDLDBCQUFFK0UsY0FBRjtBQUNIO0FBQ0QseUJBQUthLGVBQUwsQ0FBcUJuRyxPQUFyQjtBQUNBLHdCQUFJQSxRQUFRaUQsVUFBUixDQUFtQjZDLE9BQXZCLEVBQ0E7QUFDSTlGLGdDQUFRb0csTUFBUjtBQUNBcEcsZ0NBQVEyQixLQUFSLENBQWNtRSxPQUFkLEdBQXdCOUYsUUFBUWlELFVBQVIsQ0FBbUI2QyxPQUEzQztBQUNBOUYsZ0NBQVFpRCxVQUFSLENBQW1CNkMsT0FBbkIsR0FBNkIsSUFBN0I7QUFDQTlGLGdDQUFRaUQsVUFBUixDQUFtQkMsUUFBbkIsQ0FBNEI2QyxJQUE1QixDQUFpQyxRQUFqQyxFQUEyQy9GLE9BQTNDLEVBQW9EQSxRQUFRaUQsVUFBUixDQUFtQkMsUUFBdkU7QUFDQWxELGdDQUFRaUQsVUFBUixDQUFtQkMsUUFBbkIsR0FBOEIsSUFBOUI7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7aUNBS1MzQyxDLEVBQ1Q7QUFDSSxnQkFBTVAsVUFBVU8sRUFBRThGLGFBQWxCO0FBQ0EsZ0JBQU1DLFdBQVd0RyxRQUFRaUQsVUFBUixDQUFtQnFELFFBQXBDO0FBQ0EsZ0JBQUlBLFFBQUosRUFDQTtBQUNJQSx5QkFBU0YsTUFBVDtBQUNBLG9CQUFJRSxTQUFTQyxJQUFiLEVBQ0E7QUFDSUQsNkJBQVNDLElBQVQsQ0FBY0gsTUFBZDtBQUNIO0FBQ0RwRyx3QkFBUWlELFVBQVIsQ0FBbUJxRCxRQUFuQixHQUE4QixJQUE5QjtBQUNIO0FBQ0QsZ0JBQUksS0FBS3JHLE9BQUwsQ0FBYXlCLFdBQWpCLEVBQ0E7QUFDSTVCLHNCQUFNNkIsS0FBTixDQUFZcEIsRUFBRThGLGFBQWQsRUFBNkIsUUFBN0IsRUFBdUMsS0FBS3BHLE9BQUwsQ0FBYXlCLFdBQXBEO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7bUNBS1duQixDLEVBQ1g7QUFDSSxnQkFBTTRDLFdBQVc1QyxFQUFFOEYsYUFBRixDQUFnQnBELFVBQWhCLENBQTJCQyxRQUE1QztBQUNBLGdCQUFNb0QsV0FBVy9GLEVBQUU4RixhQUFGLENBQWdCRyxTQUFoQixDQUEwQixJQUExQixDQUFqQjtBQUNBLGlCQUFLLElBQUk3RSxLQUFULElBQWtCd0IsU0FBU2xELE9BQVQsQ0FBaUJ3RyxTQUFuQyxFQUNBO0FBQ0lILHlCQUFTM0UsS0FBVCxDQUFlQSxLQUFmLElBQXdCd0IsU0FBU2xELE9BQVQsQ0FBaUJ3RyxTQUFqQixDQUEyQjlFLEtBQTNCLENBQXhCO0FBQ0g7QUFDRCxnQkFBTStFLE1BQU01RyxNQUFNNkcsUUFBTixDQUFlcEcsRUFBRThGLGFBQWpCLENBQVo7QUFDQUMscUJBQVMzRSxLQUFULENBQWVvQyxJQUFmLEdBQXNCMkMsSUFBSTFCLENBQUosR0FBUSxJQUE5QjtBQUNBc0IscUJBQVMzRSxLQUFULENBQWVxQyxHQUFmLEdBQXFCMEMsSUFBSXZCLENBQUosR0FBUSxJQUE3QjtBQUNBLGdCQUFNeUIsU0FBUyxFQUFFNUIsR0FBRzBCLElBQUkxQixDQUFKLEdBQVF6RSxFQUFFMEUsS0FBZixFQUFzQkUsR0FBR3VCLElBQUl2QixDQUFKLEdBQVE1RSxFQUFFNkUsS0FBbkMsRUFBZjtBQUNBekIscUJBQVNTLElBQVQsQ0FBY2pDLFdBQWQsQ0FBMEJtRSxRQUExQjtBQUNBLGdCQUFJbkQsU0FBU2xELE9BQVQsQ0FBaUI0RyxRQUFyQixFQUNBO0FBQ0ksb0JBQU1DLFFBQVEsSUFBSUMsS0FBSixFQUFkO0FBQ0FELHNCQUFNRSxHQUFOLEdBQVk3RCxTQUFTbEQsT0FBVCxDQUFpQmdILEtBQWpCLENBQXVCQyxPQUFuQztBQUNBSixzQkFBTW5GLEtBQU4sQ0FBWW1DLFFBQVosR0FBdUIsVUFBdkI7QUFDQWdELHNCQUFNbkYsS0FBTixDQUFZd0YsU0FBWixHQUF3Qix1QkFBeEI7QUFDQUwsc0JBQU1uRixLQUFOLENBQVlvQyxJQUFaLEdBQW1CdUMsU0FBU2MsVUFBVCxHQUFzQmQsU0FBU2UsV0FBL0IsR0FBNkMsSUFBaEU7QUFDQVAsc0JBQU1uRixLQUFOLENBQVlxQyxHQUFaLEdBQWtCc0MsU0FBU2dCLFNBQVQsR0FBcUJoQixTQUFTaUIsWUFBOUIsR0FBNkMsSUFBL0Q7QUFDQTVELHlCQUFTUyxJQUFULENBQWNqQyxXQUFkLENBQTBCMkUsS0FBMUI7QUFDQVIseUJBQVNDLElBQVQsR0FBZ0JPLEtBQWhCO0FBQ0g7QUFDRCxnQkFBSTNELFNBQVNsRCxPQUFULENBQWlCeUIsV0FBckIsRUFDQTtBQUNJNUIsc0JBQU02QixLQUFOLENBQVlwQixFQUFFOEYsYUFBZCxFQUE2QixRQUE3QixFQUF1Q2xELFNBQVNsRCxPQUFULENBQWlCeUIsV0FBeEQ7QUFDSDtBQUNELGdCQUFJOEYsU0FBU2pILEVBQUU4RixhQUFmO0FBQ0EsZ0JBQUlsRCxTQUFTbEQsT0FBVCxDQUFpQnVELElBQXJCLEVBQ0E7QUFDSWdFLHlCQUFTakgsRUFBRThGLGFBQUYsQ0FBZ0JHLFNBQWhCLENBQTBCLElBQTFCLENBQVQ7QUFDQWdCLHVCQUFPbkYsRUFBUCxHQUFZOUIsRUFBRThGLGFBQUYsQ0FBZ0JoRSxFQUFoQixHQUFxQixRQUFyQixHQUFnQzlCLEVBQUU4RixhQUFGLENBQWdCcEQsVUFBaEIsQ0FBMkJPLElBQXZFO0FBQ0FqRCxrQkFBRThGLGFBQUYsQ0FBZ0JwRCxVQUFoQixDQUEyQk8sSUFBM0I7QUFDQUwseUJBQVMzQixhQUFULENBQXVCZ0csTUFBdkI7QUFDQUEsdUJBQU92RSxVQUFQLENBQWtCd0UsTUFBbEIsR0FBMkIsSUFBM0I7QUFDQUQsdUJBQU92RSxVQUFQLENBQWtCQyxRQUFsQixHQUE2QixJQUE3QjtBQUNBc0UsdUJBQU92RSxVQUFQLENBQWtCNkMsT0FBbEIsR0FBNEIwQixPQUFPN0YsS0FBUCxDQUFhbUUsT0FBYixJQUF3QixPQUFwRDtBQUNBMEIsdUJBQU83RixLQUFQLENBQWFtRSxPQUFiLEdBQXVCLE1BQXZCO0FBQ0FuQyx5QkFBU1MsSUFBVCxDQUFjakMsV0FBZCxDQUEwQnFGLE1BQTFCO0FBQ0g7QUFDRGpILGNBQUVrRSxZQUFGLENBQWVpRCxTQUFmO0FBQ0FuSCxjQUFFa0UsWUFBRixDQUFla0QsT0FBZixDQUF1QnhFLFNBQVNsRCxPQUFULENBQWlCb0QsSUFBeEMsRUFBOENGLFNBQVNsRCxPQUFULENBQWlCb0QsSUFBL0Q7QUFDQTlDLGNBQUVrRSxZQUFGLENBQWVrRCxPQUFmLENBQXVCSCxPQUFPbkYsRUFBOUIsRUFBa0NtRixPQUFPbkYsRUFBekM7QUFDQTlCLGNBQUVrRSxZQUFGLENBQWVtRCxZQUFmLENBQTRCN0gsU0FBUzJELFNBQXJDLEVBQWdELENBQWhELEVBQW1ELENBQW5EO0FBQ0E4RCxtQkFBT3ZFLFVBQVAsQ0FBa0JnRCxPQUFsQixHQUE0QixJQUE1QjtBQUNBdUIsbUJBQU92RSxVQUFQLENBQWtCbEIsS0FBbEIsR0FBMEJvQixTQUFTbEQsT0FBVCxDQUFpQnVELElBQWpCLEdBQXdCLENBQUMsQ0FBekIsR0FBNkJMLFNBQVMwRSxTQUFULENBQW1CTCxNQUFuQixDQUF2RDtBQUNBQSxtQkFBT3ZFLFVBQVAsQ0FBa0JxRCxRQUFsQixHQUE2QkEsUUFBN0I7QUFDQWtCLG1CQUFPdkUsVUFBUCxDQUFrQjJELE1BQWxCLEdBQTJCQSxNQUEzQjtBQUNIOztBQUVEOzs7Ozs7OzttQ0FLV3JHLEMsRUFDWCxDQVdDO0FBVkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdKOzs7Ozs7OztrQ0FLVUEsQyxFQUNWO0FBQ0ksZ0JBQU00QyxXQUFXNUMsRUFBRWtFLFlBQUYsQ0FBZUMsS0FBZixDQUFxQixDQUFyQixDQUFqQjtBQUNBLGdCQUFJdkIsWUFBWUEsYUFBYSxLQUFLbEQsT0FBTCxDQUFhb0QsSUFBMUMsRUFDQTtBQUNJLG9CQUFNaEIsS0FBSzlCLEVBQUVrRSxZQUFGLENBQWVDLEtBQWYsQ0FBcUIsQ0FBckIsQ0FBWDtBQUNBLG9CQUFNMUUsVUFBVTJELFNBQVNnQixjQUFULENBQXdCdEMsRUFBeEIsQ0FBaEI7QUFDQSxvQkFBSSxLQUFLd0MsSUFBTCxJQUFhQyxLQUFLQyxHQUFMLENBQVMsS0FBS0YsSUFBTCxDQUFVRyxDQUFWLEdBQWN6RSxFQUFFMEUsS0FBekIsSUFBa0MsS0FBS2hGLE9BQUwsQ0FBYWlGLFNBQTVELElBQXlFSixLQUFLQyxHQUFMLENBQVMsS0FBS0YsSUFBTCxDQUFVTSxDQUFWLEdBQWM1RSxFQUFFNkUsS0FBekIsSUFBa0MsS0FBS25GLE9BQUwsQ0FBYWlGLFNBQTVILEVBQ0E7QUFDSSx5QkFBS0csZUFBTCxDQUFxQjlFLENBQXJCLEVBQXdCUCxPQUF4QjtBQUNBTyxzQkFBRStFLGNBQUY7QUFDQS9FLHNCQUFFZ0YsZUFBRjtBQUNBO0FBQ0g7QUFDRCxxQkFBS1YsSUFBTCxHQUFZLEVBQUVHLEdBQUd6RSxFQUFFMEUsS0FBUCxFQUFjRSxHQUFHNUUsRUFBRTZFLEtBQW5CLEVBQVo7QUFDQSxvQkFBSXBGLFFBQVFpRCxVQUFSLENBQW1Cd0UsTUFBbkIsSUFBNkJ6SCxRQUFRaUQsVUFBUixDQUFtQkMsUUFBbkIsS0FBZ0MsSUFBakUsRUFDQTtBQUNJLHlCQUFLd0MsT0FBTCxDQUFhbkYsQ0FBYixFQUFnQixJQUFoQjtBQUNILGlCQUhELE1BSUssSUFBSSxLQUFLTixPQUFMLENBQWFZLElBQWIsSUFBcUJiLFFBQVFpRCxVQUFSLENBQW1CQyxRQUFuQixLQUFnQyxJQUF6RCxFQUNMO0FBQ0kseUJBQUtzQyxZQUFMLENBQWtCLElBQWxCLEVBQXdCakYsRUFBRTBFLEtBQTFCLEVBQWlDMUUsRUFBRTZFLEtBQW5DLEVBQTBDcEYsT0FBMUM7QUFDQU8sc0JBQUVrRSxZQUFGLENBQWVnQixVQUFmLEdBQTRCekYsUUFBUWlELFVBQVIsQ0FBbUJ3RSxNQUFuQixHQUE0QixNQUE1QixHQUFxQyxNQUFqRTtBQUNBLHlCQUFLcEMsZUFBTCxDQUFxQjlFLENBQXJCLEVBQXdCUCxPQUF4QjtBQUNILGlCQUxJLE1BT0w7QUFDSSx5QkFBSzBGLE9BQUwsQ0FBYW5GLENBQWI7QUFDSDtBQUNEQSxrQkFBRStFLGNBQUY7QUFDQS9FLGtCQUFFZ0YsZUFBRjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozt3Q0FNZ0JoRixDLEVBQUdQLE8sRUFDbkI7QUFDSSxnQkFBTXNHLFdBQVd0RyxRQUFRaUQsVUFBUixDQUFtQnFELFFBQXBDO0FBQ0EsZ0JBQU1NLFNBQVM1RyxRQUFRaUQsVUFBUixDQUFtQjJELE1BQWxDO0FBQ0EsZ0JBQUlOLFFBQUosRUFDQTtBQUNJQSx5QkFBUzNFLEtBQVQsQ0FBZW9DLElBQWYsR0FBc0J4RCxFQUFFMEUsS0FBRixHQUFVMkIsT0FBTzVCLENBQWpCLEdBQXFCLElBQTNDO0FBQ0FzQix5QkFBUzNFLEtBQVQsQ0FBZXFDLEdBQWYsR0FBcUJ6RCxFQUFFNkUsS0FBRixHQUFVd0IsT0FBT3pCLENBQWpCLEdBQXFCLElBQTFDO0FBQ0Esb0JBQUltQixTQUFTQyxJQUFiLEVBQ0E7QUFDSUQsNkJBQVNDLElBQVQsQ0FBYzVFLEtBQWQsQ0FBb0JvQyxJQUFwQixHQUEyQnVDLFNBQVNjLFVBQVQsR0FBc0JkLFNBQVNlLFdBQS9CLEdBQTZDLElBQXhFO0FBQ0FmLDZCQUFTQyxJQUFULENBQWM1RSxLQUFkLENBQW9CcUMsR0FBcEIsR0FBMEJzQyxTQUFTZ0IsU0FBVCxHQUFxQmhCLFNBQVNpQixZQUE5QixHQUE2QyxJQUF2RTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7d0NBS2dCdkgsTyxFQUNoQjtBQUNJLGdCQUFNc0csV0FBV3RHLFFBQVFpRCxVQUFSLENBQW1CcUQsUUFBcEM7QUFDQSxnQkFBSUEsUUFBSixFQUNBO0FBQ0lBLHlCQUFTRixNQUFUO0FBQ0Esb0JBQUlFLFNBQVNDLElBQWIsRUFDQTtBQUNJRCw2QkFBU0MsSUFBVCxDQUFjSCxNQUFkO0FBQ0g7QUFDRHBHLHdCQUFRaUQsVUFBUixDQUFtQnFELFFBQW5CLEdBQThCLElBQTlCO0FBQ0g7QUFDRHRHLG9CQUFRaUQsVUFBUixDQUFtQndFLE1BQW5CLEdBQTRCLEtBQTVCO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzhCQUtNbEgsQyxFQUNOO0FBQ0ksZ0JBQU04QyxPQUFPOUMsRUFBRWtFLFlBQUYsQ0FBZUMsS0FBZixDQUFxQixDQUFyQixDQUFiO0FBQ0EsZ0JBQUkzRSxTQUFTdUQsT0FBVCxDQUFpQkQsSUFBakIsS0FBMEJBLFNBQVMsS0FBS3BELE9BQUwsQ0FBYW9ELElBQXBELEVBQ0E7QUFDSSxvQkFBTWhCLEtBQUs5QixFQUFFa0UsWUFBRixDQUFlQyxLQUFmLENBQXFCLENBQXJCLENBQVg7QUFDQSxvQkFBTTFFLFVBQVUyRCxTQUFTZ0IsY0FBVCxDQUF3QnRDLEVBQXhCLENBQWhCO0FBQ0Esb0JBQUlyQyxRQUFRaUQsVUFBUixDQUFtQmdELE9BQXZCLEVBQ0E7QUFDSSx3QkFBSWpHLFFBQVFpRCxVQUFSLENBQW1CQyxRQUFuQixLQUFnQyxJQUFwQyxFQUNBO0FBQ0lsRCxnQ0FBUWlELFVBQVIsQ0FBbUJDLFFBQW5CLENBQTRCNkMsSUFBNUIsQ0FBaUMsUUFBakMsRUFBMkMvRixPQUEzQyxFQUFvREEsUUFBUWlELFVBQVIsQ0FBbUJDLFFBQXZFO0FBQ0EsNkJBQUs2QyxJQUFMLENBQVUsS0FBVixFQUFpQi9GLE9BQWpCLEVBQTBCLElBQTFCO0FBQ0FBLGdDQUFRaUQsVUFBUixDQUFtQkMsUUFBbkIsR0FBOEIsSUFBOUI7QUFDQSw0QkFBSSxLQUFLakQsT0FBTCxDQUFhK0IsSUFBakIsRUFDQTtBQUNJLGlDQUFLK0QsSUFBTCxDQUFVLE9BQVYsRUFBbUIvRixPQUFuQixFQUE0QixJQUE1QjtBQUNIO0FBQ0QsNEJBQUlBLFFBQVFpRCxVQUFSLENBQW1Cd0UsTUFBdkIsRUFDQTtBQUNJLGlDQUFLMUIsSUFBTCxDQUFVLE1BQVYsRUFBa0IvRixPQUFsQixFQUEyQixJQUEzQjtBQUNIO0FBQ0QsNkJBQUs4SCxRQUFMLENBQWM5SCxPQUFkLEVBQXVCLElBQXZCO0FBQ0EsNkJBQUsrRixJQUFMLENBQVUsUUFBVixFQUFvQi9GLE9BQXBCLEVBQTZCLElBQTdCO0FBQ0gscUJBZkQsTUFpQkE7QUFDSSw0QkFBSUEsUUFBUWlELFVBQVIsQ0FBbUJsQixLQUFuQixLQUE2QixLQUFLOEYsU0FBTCxDQUFldEgsRUFBRThGLGFBQWpCLENBQWpDLEVBQ0E7QUFDSSxpQ0FBS04sSUFBTCxDQUFVLE9BQVYsRUFBbUIvRixPQUFuQixFQUE0QixJQUE1QjtBQUNBLGlDQUFLK0YsSUFBTCxDQUFVLFFBQVYsRUFBb0IvRixPQUFwQixFQUE2QixJQUE3QjtBQUNIO0FBQ0o7QUFDSjtBQUNELHFCQUFLbUcsZUFBTCxDQUFxQm5HLE9BQXJCO0FBQ0FPLGtCQUFFK0UsY0FBRjtBQUNBL0Usa0JBQUVnRixlQUFGO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7OztxQ0FPYWhGLEMsRUFBR2dFLEksRUFBTXZFLE8sRUFDdEI7QUFDSSxnQkFBSStILE1BQU1DLFFBQVY7QUFBQSxnQkFBb0JyRixjQUFwQjtBQURKO0FBQUE7QUFBQTs7QUFBQTtBQUVJLHNDQUFvQjRCLElBQXBCLG1JQUNBO0FBQUEsd0JBRFMwRCxPQUNUOztBQUNJLHdCQUFLLENBQUNBLFFBQVFoSSxPQUFSLENBQWdCWSxJQUFqQixJQUF5QmIsUUFBUWlELFVBQVIsQ0FBbUJDLFFBQW5CLEtBQWdDK0UsT0FBMUQsSUFDQ2pJLFFBQVFpRCxVQUFSLENBQW1Cd0UsTUFBbkIsSUFBNkJ6SCxRQUFRaUQsVUFBUixDQUFtQkMsUUFBbkIsS0FBZ0MrRSxPQURsRSxFQUVBO0FBQ0k7QUFDSDtBQUNELHdCQUFJbkksTUFBTW9JLE1BQU4sQ0FBYTNILEVBQUUwRSxLQUFmLEVBQXNCMUUsRUFBRTZFLEtBQXhCLEVBQStCNkMsUUFBUWpJLE9BQXZDLENBQUosRUFDQTtBQUNJLCtCQUFPaUksT0FBUDtBQUNILHFCQUhELE1BSUssSUFBSUEsUUFBUWhJLE9BQVIsQ0FBZ0I0RixPQUFoQixLQUE0QixTQUFoQyxFQUNMO0FBQ0ksNEJBQU1zQyxZQUFZckksTUFBTXNJLHVCQUFOLENBQThCN0gsRUFBRTBFLEtBQWhDLEVBQXVDMUUsRUFBRTZFLEtBQXpDLEVBQWdENkMsUUFBUWpJLE9BQXhELENBQWxCO0FBQ0EsNEJBQUltSSxZQUFZSixHQUFoQixFQUNBO0FBQ0lBLGtDQUFNSSxTQUFOO0FBQ0F4RixvQ0FBUXNGLE9BQVI7QUFDSDtBQUNKO0FBQ0o7QUF0Qkw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUF1QkksbUJBQU90RixLQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7O3FDQVFhUSxRLEVBQVU2QixDLEVBQUdHLEMsRUFBR25GLE8sRUFDN0I7QUFDSSxnQkFBSSxLQUFLQyxPQUFMLENBQWErQixJQUFqQixFQUNBO0FBQ0kscUJBQUtxRyxvQkFBTCxDQUEwQmxGLFFBQTFCLEVBQW9DNkIsQ0FBcEMsRUFBdUNHLENBQXZDLEVBQTBDbkYsT0FBMUM7QUFDSCxhQUhELE1BS0E7QUFDSSxxQkFBS3NJLG1CQUFMLENBQXlCbkYsUUFBekIsRUFBbUNuRCxPQUFuQztBQUNIO0FBQ0QsaUJBQUs0RixRQUFMLENBQWM1RixPQUFkLEVBQXVCbUQsUUFBdkI7QUFDQSxnQkFBSW5ELFFBQVFpRCxVQUFSLENBQW1CNkMsT0FBdkIsRUFDQTtBQUNJOUYsd0JBQVEyQixLQUFSLENBQWNtRSxPQUFkLEdBQXdCOUYsUUFBUWlELFVBQVIsQ0FBbUI2QyxPQUFuQixLQUErQixPQUEvQixHQUF5QyxFQUF6QyxHQUE4QzlGLFFBQVFpRCxVQUFSLENBQW1CNkMsT0FBekY7QUFDQTlGLHdCQUFRaUQsVUFBUixDQUFtQjZDLE9BQW5CLEdBQTZCLElBQTdCO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozt1Q0FJZTNDLFEsRUFBVW5ELE8sRUFDekI7QUFDSSxnQkFBTWlDLFdBQVdrQixTQUFTL0MsWUFBVCxFQUFqQjtBQUNBLGdCQUFJNkIsU0FBU0MsTUFBYixFQUNBO0FBQ0ksb0JBQU1ILFFBQVEvQixRQUFRaUQsVUFBUixDQUFtQmxCLEtBQWpDO0FBQ0Esb0JBQUlBLFFBQVFFLFNBQVNDLE1BQXJCLEVBQ0E7QUFDSUQsNkJBQVNGLEtBQVQsRUFBZ0JpQixVQUFoQixDQUEyQlosWUFBM0IsQ0FBd0NwQyxPQUF4QyxFQUFpRGlDLFNBQVNGLEtBQVQsQ0FBakQ7QUFDSCxpQkFIRCxNQUtBO0FBQ0lFLDZCQUFTLENBQVQsRUFBWUUsV0FBWixDQUF3Qm5DLE9BQXhCO0FBQ0g7QUFDSixhQVhELE1BYUE7QUFDSW1ELHlCQUFTbkQsT0FBVCxDQUFpQm1DLFdBQWpCLENBQTZCbkMsT0FBN0I7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7a0NBTVVxQixLLEVBQ1Y7QUFDSSxnQkFBTVksV0FBVyxLQUFLN0IsWUFBTCxFQUFqQjtBQUNBLGlCQUFLLElBQUl5QyxJQUFJLENBQWIsRUFBZ0JBLElBQUlaLFNBQVNDLE1BQTdCLEVBQXFDVyxHQUFyQyxFQUNBO0FBQ0ksb0JBQUlaLFNBQVNZLENBQVQsTUFBZ0J4QixLQUFwQixFQUNBO0FBQ0ksMkJBQU93QixDQUFQO0FBQ0g7QUFDSjtBQUNKOztBQUVEOzs7Ozs7Ozs7OzBDQU9rQjBGLEksRUFBTUMsTSxFQUFRQyxPLEVBQ2hDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0ksc0NBQWtCRixLQUFLdEcsUUFBdkIsbUlBQ0E7QUFBQSx3QkFEU1osS0FDVDs7QUFDSSx3QkFBSW1ILE9BQU90RyxNQUFYLEVBQ0E7QUFDSSw0QkFBSXNHLE9BQU9FLE9BQVAsQ0FBZXJILE1BQU1zSCxTQUFyQixNQUFvQyxDQUFDLENBQXpDLEVBQ0E7QUFDSUYsb0NBQVFqRSxJQUFSLENBQWFuRCxLQUFiO0FBQ0g7QUFDSixxQkFORCxNQVFBO0FBQ0lvSCxnQ0FBUWpFLElBQVIsQ0FBYW5ELEtBQWI7QUFDSDtBQUNELHlCQUFLdUgsaUJBQUwsQ0FBdUJ2SCxLQUF2QixFQUE4Qm1ILE1BQTlCLEVBQXNDQyxPQUF0QztBQUNIO0FBZkw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWdCQzs7QUFFRDs7Ozs7Ozs7O3FDQU1hSSxLLEVBQ2I7QUFDSSxnQkFBSSxLQUFLNUksT0FBTCxDQUFhNkksVUFBakIsRUFDQTtBQUNJLG9CQUFJTixTQUFTLEVBQWI7QUFDQSxvQkFBSUssU0FBUyxLQUFLNUksT0FBTCxDQUFhOEksVUFBMUIsRUFDQTtBQUNJLHdCQUFJLEtBQUs5SSxPQUFMLENBQWFxQixTQUFqQixFQUNBO0FBQ0lrSCwrQkFBT2hFLElBQVAsQ0FBWSxLQUFLdkUsT0FBTCxDQUFhcUIsU0FBekI7QUFDSDtBQUNELHdCQUFJdUgsU0FBUyxLQUFLNUksT0FBTCxDQUFhOEksVUFBMUIsRUFDQTtBQUNJUCwrQkFBT2hFLElBQVAsQ0FBWSxLQUFLdkUsT0FBTCxDQUFhOEksVUFBekI7QUFDSDtBQUNKLGlCQVZELE1BV0ssSUFBSSxDQUFDRixLQUFELElBQVUsS0FBSzVJLE9BQUwsQ0FBYXFCLFNBQTNCLEVBQ0w7QUFDSWtILDJCQUFPaEUsSUFBUCxDQUFZLEtBQUt2RSxPQUFMLENBQWFxQixTQUF6QjtBQUNIO0FBQ0Qsb0JBQU1tSCxVQUFVLEVBQWhCO0FBQ0EscUJBQUtHLGlCQUFMLENBQXVCLEtBQUs1SSxPQUE1QixFQUFxQ3dJLE1BQXJDLEVBQTZDQyxPQUE3QztBQUNBLHVCQUFPQSxPQUFQO0FBQ0gsYUFyQkQsTUF1QkE7QUFDSSxvQkFBSSxLQUFLeEksT0FBTCxDQUFhcUIsU0FBakIsRUFDQTtBQUNJLHdCQUFJaUQsT0FBTyxFQUFYO0FBREo7QUFBQTtBQUFBOztBQUFBO0FBRUksOENBQWtCLEtBQUt2RSxPQUFMLENBQWFpQyxRQUEvQixtSUFDQTtBQUFBLGdDQURTWixLQUNUOztBQUNJLGdDQUFJdkIsTUFBTXlCLGlCQUFOLENBQXdCRixLQUF4QixFQUErQixLQUFLcEIsT0FBTCxDQUFhcUIsU0FBNUMsS0FBMkR1SCxTQUFTLENBQUMsS0FBSzVJLE9BQUwsQ0FBYThJLFVBQXZCLElBQXNDRixTQUFTLEtBQUs1SSxPQUFMLENBQWE4SSxVQUF0QixJQUFvQ2pKLE1BQU15QixpQkFBTixDQUF3QkYsS0FBeEIsRUFBK0IsS0FBS3BCLE9BQUwsQ0FBYThJLFVBQTVDLENBQXpJLEVBQ0E7QUFDSXhFLHFDQUFLQyxJQUFMLENBQVVuRCxLQUFWO0FBQ0g7QUFDSjtBQVJMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBU0ksMkJBQU9rRCxJQUFQO0FBQ0gsaUJBWEQsTUFhQTtBQUNJLHdCQUFNQSxRQUFPLEVBQWI7QUFESjtBQUFBO0FBQUE7O0FBQUE7QUFFSSw4Q0FBa0IsS0FBS3ZFLE9BQUwsQ0FBYWlDLFFBQS9CLG1JQUNBO0FBQUEsZ0NBRFNaLE9BQ1Q7O0FBQ0lrRCxrQ0FBS0MsSUFBTCxDQUFVbkQsT0FBVjtBQUNIO0FBTEw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNSSwyQkFBT2tELEtBQVA7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs0Q0FNb0JwQixRLEVBQVVtRCxRLEVBQzlCO0FBQ0ksZ0JBQUlBLFNBQVNyRCxVQUFULENBQW9CZ0QsT0FBcEIsS0FBZ0M5QyxRQUFwQyxFQUNBO0FBQ0ksb0JBQU1kLEtBQUtjLFNBQVNsRCxPQUFULENBQWlCcUMsT0FBNUI7QUFDQSxvQkFBSUMsWUFBWStELFNBQVM5RCxZQUFULENBQXNCSCxFQUF0QixDQUFoQjtBQUNBRSw0QkFBWVksU0FBU2xELE9BQVQsQ0FBaUJ3QyxlQUFqQixHQUFtQ0MsV0FBV0gsU0FBWCxDQUFuQyxHQUEyREEsU0FBdkU7QUFDQSxvQkFBSUksY0FBSjtBQUNBLG9CQUFNVixXQUFXa0IsU0FBUy9DLFlBQVQsQ0FBc0IsSUFBdEIsQ0FBakI7QUFDQSxvQkFBSStDLFNBQVNsRCxPQUFULENBQWlCMkMsWUFBckIsRUFDQTtBQUNJLHlCQUFLLElBQUlDLElBQUlaLFNBQVNDLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NXLEtBQUssQ0FBdkMsRUFBMENBLEdBQTFDLEVBQ0E7QUFDSSw0QkFBTXhCLFFBQVFZLFNBQVNZLENBQVQsQ0FBZDtBQUNBLDRCQUFJQyxpQkFBaUJ6QixNQUFNbUIsWUFBTixDQUFtQkgsRUFBbkIsQ0FBckI7QUFDQVMseUNBQWlCSyxTQUFTbEQsT0FBVCxDQUFpQjhDLGFBQWpCLEdBQWlDTCxXQUFXSSxjQUFYLENBQWpDLEdBQThEQSxjQUEvRTtBQUNBLDRCQUFJUCxZQUFZTyxjQUFoQixFQUNBO0FBQ0l6QixrQ0FBTTJCLFVBQU4sQ0FBaUJaLFlBQWpCLENBQThCa0UsUUFBOUIsRUFBd0NqRixLQUF4QztBQUNBc0Isb0NBQVEsSUFBUjtBQUNBO0FBQ0g7QUFDSjtBQUNKLGlCQWRELE1BZ0JBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0ksOENBQWtCVixRQUFsQixtSUFDQTtBQUFBLGdDQURTWixPQUNUOztBQUNJLGdDQUFJeUIsbUJBQWlCekIsUUFBTW1CLFlBQU4sQ0FBbUJILEVBQW5CLENBQXJCO0FBQ0FTLCtDQUFpQkssU0FBU2xELE9BQVQsQ0FBaUI4QyxhQUFqQixHQUFpQ0wsV0FBV0ksZ0JBQVgsQ0FBakMsR0FBOERBLGdCQUEvRTtBQUNBLGdDQUFJUCxZQUFZTyxnQkFBaEIsRUFDQTtBQUNJekIsd0NBQU0yQixVQUFOLENBQWlCWixZQUFqQixDQUE4QmtFLFFBQTlCLEVBQXdDakYsT0FBeEM7QUFDQXNCLHdDQUFRLElBQVI7QUFDQTtBQUNIO0FBQ0o7QUFYTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUM7QUFDRCxvQkFBSSxDQUFDQSxLQUFMLEVBQ0E7QUFDSVEsNkJBQVNuRCxPQUFULENBQWlCbUMsV0FBakIsQ0FBNkJtRSxRQUE3QjtBQUNIO0FBQ0Qsb0JBQUlBLFNBQVNyRCxVQUFULENBQW9CZ0QsT0FBeEIsRUFDQTtBQUNJLHdCQUFJSyxTQUFTckQsVUFBVCxDQUFvQmdELE9BQXBCLEtBQWdDSyxTQUFTckQsVUFBVCxDQUFvQkMsUUFBeEQsRUFDQTtBQUNJb0QsaUNBQVNyRCxVQUFULENBQW9CZ0QsT0FBcEIsQ0FBNEJGLElBQTVCLENBQWlDLG9CQUFqQyxFQUF1RE8sUUFBdkQsRUFBaUVBLFNBQVNyRCxVQUFULENBQW9CZ0QsT0FBckY7QUFDSCxxQkFIRCxNQUtBO0FBQ0lLLGlDQUFTckQsVUFBVCxDQUFvQmdELE9BQXBCLENBQTRCRixJQUE1QixDQUFpQyxnQkFBakMsRUFBbURPLFFBQW5ELEVBQTZEQSxTQUFTckQsVUFBVCxDQUFvQmdELE9BQWpGO0FBQ0g7QUFDRCx5QkFBS0Msb0JBQUwsQ0FBMEJJLFNBQVNyRCxVQUFULENBQW9CZ0QsT0FBOUM7QUFDQSx5QkFBSzZCLFFBQUwsQ0FBYyxJQUFkLEVBQW9CeEIsU0FBU3JELFVBQVQsQ0FBb0JnRCxPQUF4QztBQUNIO0FBQ0Q5Qyx5QkFBUzRDLElBQVQsQ0FBYyxhQUFkLEVBQTZCTyxRQUE3QixFQUF1Q25ELFFBQXZDO0FBQ0Esb0JBQUltRCxTQUFTckQsVUFBVCxDQUFvQndFLE1BQXhCLEVBQ0E7QUFDSXRFLDZCQUFTNEMsSUFBVCxDQUFjLGNBQWQsRUFBOEJPLFFBQTlCLEVBQXdDbkQsUUFBeEM7QUFDSDtBQUNEbUQseUJBQVNyRCxVQUFULENBQW9CZ0QsT0FBcEIsR0FBOEI5QyxRQUE5QjtBQUNBLHFCQUFLNkYsZUFBTCxDQUFxQjFDLFFBQXJCLEVBQStCbkQsUUFBL0I7QUFDQUEseUJBQVM0QyxJQUFULENBQWMsZ0JBQWQsRUFBZ0NPLFFBQWhDLEVBQTBDbkQsUUFBMUM7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7OzJDQU9tQkEsUSxFQUFVbUQsUSxFQUM3QjtBQUNJLGdCQUFNMkMsU0FBUzNDLFNBQVNyRCxVQUFULENBQW9CcUQsUUFBbkM7QUFDQSxnQkFBTTRDLE1BQU1ELE9BQU83QixVQUFuQjtBQUNBLGdCQUFNK0IsTUFBTUYsT0FBTzNCLFNBQW5CO0FBQ0EsZ0JBQU04QixNQUFNSCxPQUFPN0IsVUFBUCxHQUFvQjZCLE9BQU81QixXQUF2QztBQUNBLGdCQUFNZ0MsTUFBTUosT0FBTzNCLFNBQVAsR0FBbUIyQixPQUFPMUIsWUFBdEM7QUFDQSxnQkFBSStCLFVBQVUsQ0FBZDtBQUFBLGdCQUFpQkMsZ0JBQWpCO0FBQUEsZ0JBQTBCQyxpQkFBMUI7QUFBQSxnQkFBb0NDLGtCQUFwQztBQUNBLGdCQUFNekosVUFBVW1ELFNBQVNuRCxPQUF6QjtBQUNBLGdCQUFNRyxXQUFXZ0QsU0FBUy9DLFlBQVQsQ0FBc0IsSUFBdEIsQ0FBakI7QUFSSjtBQUFBO0FBQUE7O0FBQUE7QUFTSSx1Q0FBa0JELFFBQWxCLHdJQUNBO0FBQUEsd0JBRFNrQixLQUNUOztBQUNJLHdCQUFJQSxVQUFVaUYsUUFBZCxFQUNBO0FBQ0ltRCxvQ0FBWSxJQUFaO0FBQ0g7QUFDRCx3QkFBTS9DLE1BQU01RyxNQUFNNkcsUUFBTixDQUFldEYsS0FBZixDQUFaO0FBQ0Esd0JBQU1xSSxNQUFNaEQsSUFBSTFCLENBQWhCO0FBQ0Esd0JBQU0yRSxNQUFNakQsSUFBSXZCLENBQWhCO0FBQ0Esd0JBQU15RSxNQUFNbEQsSUFBSTFCLENBQUosR0FBUTNELE1BQU1nRyxXQUExQjtBQUNBLHdCQUFNd0MsTUFBTW5ELElBQUl2QixDQUFKLEdBQVE5RCxNQUFNa0csWUFBMUI7QUFDQSx3QkFBTXVDLGFBQWFoSyxNQUFNZ0ssVUFBTixDQUFpQlosR0FBakIsRUFBc0JDLEdBQXRCLEVBQTJCQyxHQUEzQixFQUFnQ0MsR0FBaEMsRUFBcUNLLEdBQXJDLEVBQTBDQyxHQUExQyxFQUErQ0MsR0FBL0MsRUFBb0RDLEdBQXBELENBQW5CO0FBQ0Esd0JBQUlDLGFBQWFSLE9BQWpCLEVBQ0E7QUFDSUEsa0NBQVVRLFVBQVY7QUFDQVAsa0NBQVVsSSxLQUFWO0FBQ0FtSSxtQ0FBV0MsU0FBWDtBQUNIO0FBQ0o7QUEzQkw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE0QkksZ0JBQUlGLE9BQUosRUFDQTtBQUNJLG9CQUFJQSxZQUFZakQsUUFBaEIsRUFDQTtBQUNJLDJCQUFPLENBQVA7QUFDSDtBQUNELG9CQUFJa0QsWUFBWUQsUUFBUVEsV0FBeEIsRUFDQTtBQUNJL0osNEJBQVFvQyxZQUFSLENBQXFCa0UsUUFBckIsRUFBK0JpRCxRQUFRUSxXQUF2QztBQUNBNUcsNkJBQVM0QyxJQUFULENBQWMsZUFBZCxFQUErQjVDLFFBQS9CO0FBQ0gsaUJBSkQsTUFNQTtBQUNJbkQsNEJBQVFvQyxZQUFSLENBQXFCa0UsUUFBckIsRUFBK0JpRCxPQUEvQjtBQUNBcEcsNkJBQVM0QyxJQUFULENBQWMsZUFBZCxFQUErQjVDLFFBQS9CO0FBQ0g7QUFDRCx1QkFBTyxDQUFQO0FBQ0gsYUFqQkQsTUFtQkE7QUFDSSx1QkFBTyxDQUFQO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7Ozs7O3lDQVNpQkEsUSxFQUFVbUQsUSxFQUFVdEIsQyxFQUFHRyxDLEVBQ3hDO0FBQ0ksZ0JBQUlyRixNQUFNb0ksTUFBTixDQUFhbEQsQ0FBYixFQUFnQkcsQ0FBaEIsRUFBbUJtQixRQUFuQixDQUFKLEVBQ0E7QUFDSSx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxnQkFBSXZFLFFBQVEsQ0FBQyxDQUFiO0FBQ0EsZ0JBQUl1RSxTQUFTckQsVUFBVCxDQUFvQmdELE9BQXBCLEtBQWdDOUMsUUFBcEMsRUFDQTtBQUNJcEIsd0JBQVFvQixTQUFTMEUsU0FBVCxDQUFtQnZCLFFBQW5CLENBQVI7QUFDQW5ELHlCQUFTbkQsT0FBVCxDQUFpQm1DLFdBQWpCLENBQTZCbUUsUUFBN0I7QUFDQTtBQUNIO0FBQ0QsZ0JBQUkwRCxXQUFXaEMsUUFBZjtBQUFBLGdCQUF5QnVCLGdCQUF6QjtBQUNBLGdCQUFNdkosVUFBVW1ELFNBQVNuRCxPQUF6QjtBQUNBLGdCQUFNRyxXQUFXZ0QsU0FBUy9DLFlBQVQsQ0FBc0IsSUFBdEIsQ0FBakI7QUFkSjtBQUFBO0FBQUE7O0FBQUE7QUFlSSx1Q0FBa0JELFFBQWxCLHdJQUNBO0FBQUEsd0JBRFNrQixLQUNUOztBQUNJLHdCQUFJdkIsTUFBTW9JLE1BQU4sQ0FBYWxELENBQWIsRUFBZ0JHLENBQWhCLEVBQW1COUQsS0FBbkIsQ0FBSixFQUNBO0FBQ0lrSSxrQ0FBVWxJLEtBQVY7QUFDQTtBQUNILHFCQUpELE1BTUE7QUFDSSw0QkFBTTRJLFVBQVVuSyxNQUFNc0ksdUJBQU4sQ0FBOEJwRCxDQUE5QixFQUFpQ0csQ0FBakMsRUFBb0M5RCxLQUFwQyxDQUFoQjtBQUNBLDRCQUFJNEksVUFBVUQsUUFBZCxFQUNBO0FBQ0lULHNDQUFVbEksS0FBVjtBQUNBMkksdUNBQVdDLE9BQVg7QUFDSDtBQUNKO0FBQ0o7QUEvQkw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFnQ0lqSyxvQkFBUW9DLFlBQVIsQ0FBcUJrRSxRQUFyQixFQUErQmlELE9BQS9CO0FBQ0EsZ0JBQUl4SCxVQUFVb0IsU0FBUzBFLFNBQVQsQ0FBbUJ2QixRQUFuQixDQUFkLEVBQ0E7QUFDSSx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxpQkFBSzBDLGVBQUwsQ0FBcUIxQyxRQUFyQixFQUErQm5ELFFBQS9CO0FBQ0FBLHFCQUFTNEMsSUFBVCxDQUFjLGVBQWQsRUFBK0JPLFFBQS9CLEVBQXlDbkQsUUFBekM7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs2Q0FPcUJBLFEsRUFBVTZCLEMsRUFBR0csQyxFQUFHbUIsUSxFQUNyQztBQUNJLGdCQUFNdEcsVUFBVW1ELFNBQVNuRCxPQUF6QjtBQUNBLGdCQUFNaUMsV0FBV2tCLFNBQVMvQyxZQUFULEVBQWpCO0FBQ0EsZ0JBQUksQ0FBQzZCLFNBQVNDLE1BQWQsRUFDQTtBQUNJbEMsd0JBQVFtQyxXQUFSLENBQW9CbUUsUUFBcEI7QUFDSCxhQUhELE1BS0E7QUFDSTtBQUNBLG9CQUFJLEtBQUs0RCxnQkFBTCxDQUFzQi9HLFFBQXRCLEVBQWdDbUQsUUFBaEMsRUFBMEN0QixDQUExQyxFQUE2Q0csQ0FBN0MsQ0FBSixFQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0QsZ0JBQUltQixTQUFTckQsVUFBVCxDQUFvQmdELE9BQXBCLEtBQWdDOUMsUUFBcEMsRUFDQTtBQUNJQSx5QkFBUzRDLElBQVQsQ0FBYyxhQUFkLEVBQTZCTyxRQUE3QixFQUF1Q25ELFFBQXZDO0FBQ0Esb0JBQUltRCxTQUFTckQsVUFBVCxDQUFvQndFLE1BQXhCLEVBQ0E7QUFDSXRFLDZCQUFTNEMsSUFBVCxDQUFjLGNBQWQsRUFBOEJPLFFBQTlCLEVBQXdDbkQsUUFBeEM7QUFDSDtBQUNELG9CQUFJbUQsU0FBU3JELFVBQVQsQ0FBb0JnRCxPQUF4QixFQUNBO0FBQ0ksd0JBQUlLLFNBQVNyRCxVQUFULENBQW9CZ0QsT0FBcEIsS0FBZ0NLLFNBQVNyRCxVQUFULENBQW9CQyxRQUF4RCxFQUNBO0FBQ0lvRCxpQ0FBU3JELFVBQVQsQ0FBb0JnRCxPQUFwQixDQUE0QkYsSUFBNUIsQ0FBaUMsb0JBQWpDLEVBQXVETyxRQUF2RCxFQUFpRUEsU0FBU3JELFVBQVQsQ0FBb0JnRCxPQUFyRjtBQUNILHFCQUhELE1BS0E7QUFDSUssaUNBQVNyRCxVQUFULENBQW9CZ0QsT0FBcEIsQ0FBNEJGLElBQTVCLENBQWlDLGdCQUFqQyxFQUFtRE8sUUFBbkQsRUFBNkRBLFNBQVNyRCxVQUFULENBQW9CZ0QsT0FBakY7QUFDSDtBQUNELHlCQUFLQyxvQkFBTCxDQUEwQkksU0FBU3JELFVBQVQsQ0FBb0JnRCxPQUE5QztBQUNBLHlCQUFLNkIsUUFBTCxDQUFjLElBQWQsRUFBb0J4QixTQUFTckQsVUFBVCxDQUFvQmdELE9BQXhDO0FBQ0g7QUFDREsseUJBQVNyRCxVQUFULENBQW9CZ0QsT0FBcEIsR0FBOEI5QyxRQUE5QjtBQUNIO0FBQ0QsaUJBQUs2RixlQUFMLENBQXFCMUMsUUFBckIsRUFBK0JuRCxRQUEvQjtBQUNBQSxxQkFBUzRDLElBQVQsQ0FBYyxnQkFBZCxFQUFnQ08sUUFBaEMsRUFBMENuRCxRQUExQztBQUNIOztBQUVEOzs7Ozs7Ozs7O2lDQU9TbkQsTyxFQUFTbUQsUSxFQUFVd0MsTSxFQUM1QjtBQUNJLGdCQUFNVyxXQUFXdEcsUUFBUWlELFVBQVIsQ0FBbUJxRCxRQUFwQztBQUNBLGdCQUFJQSxZQUFZQSxTQUFTQyxJQUF6QixFQUNBO0FBQ0ksb0JBQUksQ0FBQ3BELFFBQUwsRUFDQTtBQUNJQSwrQkFBV25ELFFBQVFpRCxVQUFSLENBQW1CQyxRQUE5QjtBQUNBLHdCQUFJeUMsTUFBSixFQUNBO0FBQ0lXLGlDQUFTQyxJQUFULENBQWNTLEdBQWQsR0FBb0I3RCxTQUFTbEQsT0FBVCxDQUFpQmdILEtBQWpCLENBQXVCdEIsTUFBM0M7QUFDSCxxQkFIRCxNQUtBO0FBQ0lXLGlDQUFTQyxJQUFULENBQWNTLEdBQWQsR0FBb0I3RCxTQUFTbEQsT0FBVCxDQUFpQjRGLE9BQWpCLEtBQTZCLFFBQTdCLEdBQXdDMUMsU0FBU2xELE9BQVQsQ0FBaUJnSCxLQUFqQixDQUF1QmtELE1BQS9ELEdBQXdFaEgsU0FBU2xELE9BQVQsQ0FBaUJnSCxLQUFqQixDQUF1QnRCLE1BQW5IO0FBQ0g7QUFDSixpQkFYRCxNQWFBO0FBQ0ksd0JBQUkzRixRQUFRaUQsVUFBUixDQUFtQndFLE1BQXZCLEVBQ0E7QUFDSW5CLGlDQUFTQyxJQUFULENBQWNTLEdBQWQsR0FBb0I3RCxTQUFTbEQsT0FBVCxDQUFpQmdILEtBQWpCLENBQXVCekQsSUFBM0M7QUFDSCxxQkFIRCxNQUtBO0FBQ0k4QyxpQ0FBU0MsSUFBVCxDQUFjUyxHQUFkLEdBQW9CaEgsUUFBUWlELFVBQVIsQ0FBbUJDLFFBQW5CLEtBQWdDQyxRQUFoQyxHQUEyQ0EsU0FBU2xELE9BQVQsQ0FBaUJnSCxLQUFqQixDQUF1QkMsT0FBbEUsR0FBNEUvRCxTQUFTbEQsT0FBVCxDQUFpQmdILEtBQWpCLENBQXVCbUQsSUFBdkg7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7O3dDQU1nQnBLLE8sRUFBU21ELFEsRUFDekI7QUFDSSxnQkFBSWtILFFBQVEsQ0FBQyxDQUFiO0FBQ0EsZ0JBQUlsSCxTQUFTbEQsT0FBVCxDQUFpQnFLLE9BQXJCLEVBQ0E7QUFDSSxvQkFBTXJJLFdBQVdrQixTQUFTL0MsWUFBVCxFQUFqQjtBQURKO0FBQUE7QUFBQTs7QUFBQTtBQUVJLDJDQUFrQjZCLFFBQWxCLHdJQUNBO0FBQUEsNEJBRFNaLEtBQ1Q7O0FBQ0ksNEJBQUlBLFVBQVVyQixPQUFWLElBQXFCcUIsTUFBTTRCLFVBQS9CLEVBQ0E7QUFDSW9ILG9DQUFRaEosTUFBTTRCLFVBQU4sQ0FBaUJxSCxPQUFqQixHQUEyQkQsS0FBM0IsR0FBbUNoSixNQUFNNEIsVUFBTixDQUFpQnFILE9BQXBELEdBQThERCxLQUF0RTtBQUNIO0FBQ0o7QUFSTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0M7QUFDRHJLLG9CQUFRaUQsVUFBUixDQUFtQnFILE9BQW5CLEdBQTZCRCxRQUFRLENBQXJDO0FBQ0g7O0FBRUQ7Ozs7Ozs7aUNBSVNySyxPLEVBQVNtRCxRLEVBQ2xCO0FBQ0ksZ0JBQUlBLFNBQVNsRCxPQUFULENBQWlCcUssT0FBckIsRUFDQTtBQUNJLG9CQUFNckksV0FBV2tCLFNBQVMvQyxZQUFULEVBQWpCO0FBQ0Esb0JBQUk2QixTQUFTQyxNQUFULEdBQWtCaUIsU0FBU2xELE9BQVQsQ0FBaUJxSyxPQUF2QyxFQUNBO0FBQ0ksd0JBQUluSCxTQUFTb0gsYUFBYixFQUNBO0FBQ0ksK0JBQU9wSCxTQUFTb0gsYUFBVCxDQUF1QnJJLE1BQTlCLEVBQ0E7QUFDSSxnQ0FBTWIsUUFBUThCLFNBQVNvSCxhQUFULENBQXVCQyxHQUF2QixFQUFkO0FBQ0FuSixrQ0FBTU0sS0FBTixDQUFZbUUsT0FBWixHQUFzQnpFLE1BQU00QixVQUFOLENBQWlCNkMsT0FBakIsS0FBNkIsT0FBN0IsR0FBdUMsRUFBdkMsR0FBNEN6RSxNQUFNNEIsVUFBTixDQUFpQjZDLE9BQW5GO0FBQ0F6RSxrQ0FBTTRCLFVBQU4sQ0FBaUI2QyxPQUFqQixHQUEyQixJQUEzQjtBQUNBekUsa0NBQU0rRSxNQUFOO0FBQ0FqRCxxQ0FBUzRDLElBQVQsQ0FBYyxnQkFBZCxFQUFnQzFFLEtBQWhDLEVBQXVDOEIsUUFBdkM7QUFDSDtBQUNEQSxpQ0FBU29ILGFBQVQsR0FBeUIsSUFBekI7QUFDSDtBQUNKO0FBQ0Qsb0JBQUl2SyxPQUFKLEVBQ0E7QUFDSSx5QkFBS29ELGVBQUwsQ0FBcUJwRCxPQUFyQixFQUE4Qm1ELFFBQTlCO0FBQ0g7QUFDSjtBQUNKOztBQUVEOzs7Ozs7Ozs2Q0FLcUJBLFEsRUFDckI7QUFDSSxnQkFBSUEsU0FBU29ILGFBQWIsRUFDQTtBQUNJLHVCQUFPcEgsU0FBU29ILGFBQVQsQ0FBdUJySSxNQUE5QixFQUNBO0FBQ0ksd0JBQU1iLFFBQVE4QixTQUFTb0gsYUFBVCxDQUF1QkMsR0FBdkIsRUFBZDtBQUNBbkosMEJBQU1NLEtBQU4sQ0FBWW1FLE9BQVosR0FBc0J6RSxNQUFNNEIsVUFBTixDQUFpQjZDLE9BQWpCLEtBQTZCLE9BQTdCLEdBQXVDLEVBQXZDLEdBQTRDekUsTUFBTTRCLFVBQU4sQ0FBaUI2QyxPQUFuRjtBQUNBekUsMEJBQU00QixVQUFOLENBQWlCNkMsT0FBakIsR0FBMkIsSUFBM0I7QUFDSDtBQUNEM0MseUJBQVNvSCxhQUFULEdBQXlCLElBQXpCO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7O3dDQU1nQnZLLE8sRUFBU21ELFEsRUFDekI7QUFDSSxnQkFBSUEsU0FBU2xELE9BQVQsQ0FBaUJxSyxPQUFyQixFQUNBO0FBQ0ksb0JBQU1ySSxXQUFXa0IsU0FBUy9DLFlBQVQsRUFBakI7QUFDQSxvQkFBSTZCLFNBQVNDLE1BQVQsR0FBa0JpQixTQUFTbEQsT0FBVCxDQUFpQnFLLE9BQXZDLEVBQ0E7QUFDSSx3QkFBTUcsY0FBY3RILFNBQVNvSCxhQUFULEdBQXlCcEgsU0FBU29ILGFBQVQsQ0FBdUJHLEtBQXZCLENBQTZCLENBQTdCLENBQXpCLEdBQTJELEVBQS9FO0FBQ0EseUJBQUt4RSxvQkFBTCxDQUEwQi9DLFFBQTFCO0FBQ0FBLDZCQUFTb0gsYUFBVCxHQUF5QixFQUF6QjtBQUNBLHdCQUFJdkksYUFBSjtBQUNBLHdCQUFJbUIsU0FBU2xELE9BQVQsQ0FBaUIwSyxXQUFyQixFQUNBO0FBQ0kzSSwrQkFBT0MsU0FBU0QsSUFBVCxDQUFjLFVBQUM0SSxDQUFELEVBQUlDLENBQUosRUFBVTtBQUFFLG1DQUFPRCxNQUFNNUssT0FBTixHQUFnQixDQUFoQixHQUFvQjRLLEVBQUUzSCxVQUFGLENBQWFxSCxPQUFiLEdBQXVCTyxFQUFFNUgsVUFBRixDQUFhcUgsT0FBL0Q7QUFBd0UseUJBQWxHLENBQVA7QUFDSCxxQkFIRCxNQUtBO0FBQ0l0SSwrQkFBT0MsU0FBU0QsSUFBVCxDQUFjLFVBQUM0SSxDQUFELEVBQUlDLENBQUosRUFBVTtBQUFFLG1DQUFPRCxNQUFNNUssT0FBTixHQUFnQixDQUFoQixHQUFvQjZLLEVBQUU1SCxVQUFGLENBQWFxSCxPQUFiLEdBQXVCTSxFQUFFM0gsVUFBRixDQUFhcUgsT0FBL0Q7QUFBd0UseUJBQWxHLENBQVA7QUFDSDtBQUNELHlCQUFLLElBQUl6SCxJQUFJLENBQWIsRUFBZ0JBLElBQUlaLFNBQVNDLE1BQVQsR0FBa0JpQixTQUFTbEQsT0FBVCxDQUFpQnFLLE9BQXZELEVBQWdFekgsR0FBaEUsRUFDQTtBQUNJLDRCQUFNaUksT0FBTzlJLEtBQUthLENBQUwsQ0FBYjtBQUNBaUksNkJBQUs3SCxVQUFMLENBQWdCNkMsT0FBaEIsR0FBMEJnRixLQUFLbkosS0FBTCxDQUFXbUUsT0FBWCxJQUFzQixPQUFoRDtBQUNBZ0YsNkJBQUtuSixLQUFMLENBQVdtRSxPQUFYLEdBQXFCLE1BQXJCO0FBQ0EzQyxpQ0FBU29ILGFBQVQsQ0FBdUIvRixJQUF2QixDQUE0QnNHLElBQTVCO0FBQ0EsNEJBQUlMLFlBQVkvQixPQUFaLENBQW9Cb0MsSUFBcEIsTUFBOEIsQ0FBQyxDQUFuQyxFQUNBO0FBQ0kzSCxxQ0FBUzRDLElBQVQsQ0FBYyx3QkFBZCxFQUF3QytFLElBQXhDLEVBQThDM0gsUUFBOUM7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNKOztBQUVEOzs7Ozs7OzttQ0FLVzVDLEMsRUFDWDtBQUNJLGdCQUFJLEtBQUtOLE9BQUwsQ0FBYXlCLFdBQWpCLEVBQ0E7QUFDSTVCLHNCQUFNNkIsS0FBTixDQUFZcEIsRUFBRThGLGFBQWQsRUFBNkIsUUFBN0IsRUFBdUMsS0FBS3BHLE9BQUwsQ0FBYTJCLFVBQXBEO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7aUNBS1NyQixDLEVBQ1Q7QUFDSSxpQkFBS3dGLElBQUwsQ0FBVSxTQUFWLEVBQXFCeEYsRUFBRThGLGFBQXZCLEVBQXNDLElBQXRDO0FBQ0EsZ0JBQUksS0FBS3BHLE9BQUwsQ0FBYXlCLFdBQWpCLEVBQ0E7QUFDSTVCLHNCQUFNNkIsS0FBTixDQUFZcEIsRUFBRThGLGFBQWQsRUFBNkIsUUFBN0IsRUFBdUMsS0FBS3BHLE9BQUwsQ0FBYXlCLFdBQXBEO0FBQ0g7QUFDSjs7Ozs7QUEvakNEOzs7OzsrQkFLY3ZCLFEsRUFBVUYsTyxFQUN4QjtBQUNJLGdCQUFNd0ksVUFBVSxFQUFoQjtBQURKO0FBQUE7QUFBQTs7QUFBQTtBQUVJLHVDQUFvQnRJLFFBQXBCLHdJQUNBO0FBQUEsd0JBRFNILE9BQ1Q7O0FBQ0l5SSw0QkFBUWpFLElBQVIsQ0FBYSxJQUFJekUsUUFBSixDQUFhQyxPQUFiLEVBQXNCQyxPQUF0QixDQUFiO0FBQ0g7QUFMTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU1JLG1CQUFPd0ksT0FBUDtBQUNIOzs7NEJBakJEO0FBQ0ksbUJBQU81SSxRQUFQO0FBQ0g7Ozs7RUE1R2tCRixNOztBQWdyQ3ZCOzs7Ozs7O0FBT0E7Ozs7Ozs7QUFPQTs7Ozs7OztBQU9BOzs7Ozs7O0FBT0E7Ozs7Ozs7QUFPQTs7Ozs7OztBQU9BOzs7Ozs7O0FBT0E7Ozs7Ozs7QUFPQTs7Ozs7OztBQU9BOzs7Ozs7O0FBT0E7Ozs7Ozs7QUFPQTs7Ozs7OztBQU9BOzs7Ozs7O0FBT0E7Ozs7Ozs7QUFPQTs7Ozs7OztBQU9BOzs7Ozs7O0FBT0E7Ozs7Ozs7QUFPQW9MLE9BQU9DLE9BQVAsR0FBaUJqTCxRQUFqQiIsImZpbGUiOiJzb3J0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50ZW1pdHRlcjMnKVxyXG5cclxuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJylcclxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJylcclxuXHJcbmNsYXNzIFNvcnRhYmxlIGV4dGVuZHMgRXZlbnRzXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHNvcnRhYmxlIGxpc3RcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lPXNvcnRhYmxlXSBkcmFnZ2luZyBpcyBhbGxvd2VkIGJldHdlZW4gU29ydGFibGVzIHdpdGggdGhlIHNhbWUgbmFtZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRyYWdDbGFzc10gaWYgc2V0IHRoZW4gZHJhZyBvbmx5IGl0ZW1zIHdpdGggdGhpcyBjbGFzc05hbWUgdW5kZXIgZWxlbWVudDsgb3RoZXJ3aXNlIGRyYWcgYWxsIGNoaWxkcmVuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3JkZXJDbGFzc10gdXNlIHRoaXMgY2xhc3MgdG8gaW5jbHVkZSBlbGVtZW50cyBpbiBvcmRlcmluZyBidXQgbm90IGRyYWdnaW5nOyBvdGhlcndpc2UgYWxsIGNoaWxkcmVuIGVsZW1lbnRzIGFyZSBpbmNsdWRlZCBpbiB3aGVuIHNvcnRpbmcgYW5kIG9yZGVyaW5nXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmRlZXBTZWFyY2hdIGlmIGRyYWdDbGFzcyBhbmQgZGVlcFNlYXJjaCB0aGVuIHNlYXJjaCBhbGwgZGVzY2VuZGVudHMgb2YgZWxlbWVudCBmb3IgZHJhZ0NsYXNzXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnNvcnQ9dHJ1ZV0gYWxsb3cgc29ydGluZyB3aXRoaW4gbGlzdFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5kcm9wPXRydWVdIGFsbG93IGRyb3AgZnJvbSByZWxhdGVkIHNvcnRhYmxlcyAoZG9lc24ndCBpbXBhY3QgcmVvcmRlcmluZyB0aGlzIHNvcnRhYmxlJ3MgY2hpbGRyZW4gdW50aWwgdGhlIGNoaWxkcmVuIGFyZSBtb3ZlZCB0byBhIGRpZmZlcmVuIHNvcnRhYmxlKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jb3B5PWZhbHNlXSBjcmVhdGUgY29weSB3aGVuIGRyYWdnaW5nIGFuIGl0ZW0gKHRoaXMgZGlzYWJsZXMgc29ydD10cnVlIGZvciB0aGlzIHNvcnRhYmxlKVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm9yZGVySWQ9ZGF0YS1vcmRlcl0gZm9yIG9yZGVyZWQgbGlzdHMsIHVzZSB0aGlzIGRhdGEgaWQgdG8gZmlndXJlIG91dCBzb3J0IG9yZGVyXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm9yZGVySWRJc051bWJlcj10cnVlXSB1c2UgcGFyc2VJbnQgb24gb3B0aW9ucy5zb3J0SWQgdG8gcHJvcGVybHkgc29ydCBudW1iZXJzXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucmV2ZXJzZU9yZGVyXSByZXZlcnNlIHNvcnQgdGhlIG9yZGVySWRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vZmZMaXN0PWNsb3Nlc3RdIGhvdyB0byBoYW5kbGUgd2hlbiBhbiBlbGVtZW50IGlzIGRyb3BwZWQgb3V0c2lkZSBhIHNvcnRhYmxlOiBjbG9zZXN0PWRyb3AgaW4gY2xvc2VzdCBzb3J0YWJsZTsgY2FuY2VsPXJldHVybiB0byBzdGFydGluZyBzb3J0YWJsZTsgZGVsZXRlPXJlbW92ZSBmcm9tIGFsbCBzb3J0YWJsZXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhpbXVtXSBtYXhpbXVtIG51bWJlciBvZiBlbGVtZW50cyBhbGxvd2VkIGluIGEgc29ydGFibGUgbGlzdFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5tYXhpbXVtRklGT10gZGlyZWN0aW9uIG9mIHNlYXJjaCB0byBjaG9vc2Ugd2hpY2ggaXRlbSB0byByZW1vdmUgd2hlbiBtYXhpbXVtIGlzIHJlYWNoZWRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jdXJzb3JIb3Zlcj1ncmFiIC13ZWJraXQtZ3JhYiBwb2ludGVyXSB1c2UgdGhpcyBjdXJzb3IgbGlzdCB0byBzZXQgY3Vyc29yIHdoZW4gaG92ZXJpbmcgb3ZlciBhIHNvcnRhYmxlIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jdXJzb3JEb3duPWdyYWJiaW5nIC13ZWJraXQtZ3JhYmJpbmcgcG9pbnRlcl0gdXNlIHRoaXMgY3Vyc29yIGxpc3QgdG8gc2V0IGN1cnNvciB3aGVuIG1vdXNlZG93bi90b3VjaGRvd24gb3ZlciBhIHNvcnRhYmxlIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudXNlSWNvbnM9dHJ1ZV0gc2hvdyBpY29ucyB3aGVuIGRyYWdnaW5nXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMuaWNvbnNdIGRlZmF1bHQgc2V0IG9mIGljb25zXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuaWNvbnMucmVvcmRlcl1cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5pY29ucy5tb3ZlXVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmljb25zLmNvcHldXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuaWNvbnMuZGVsZXRlXVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmN1c3RvbUljb25dIHNvdXJjZSBvZiBjdXN0b20gaW1hZ2Ugd2hlbiBvdmVyIHRoaXMgc29ydGFibGVcclxuICAgICAqIEBmaXJlcyBwaWNrdXBcclxuICAgICAqIEBmaXJlcyBvcmRlclxyXG4gICAgICogQGZpcmVzIGFkZFxyXG4gICAgICogQGZpcmVzIHJlbW92ZVxyXG4gICAgICogQGZpcmVzIHVwZGF0ZVxyXG4gICAgICogQGZpcmVzIGRlbGV0ZVxyXG4gICAgICogQGZpcmVzIGNvcHlcclxuICAgICAqIEBmaXJlcyBtYXhpbXVtLXJlbW92ZVxyXG4gICAgICogQGZpcmVzIG9yZGVyLXBlbmRpbmdcclxuICAgICAqIEBmaXJlcyBhZGQtcGVuZGluZ1xyXG4gICAgICogQGZpcmVzIHJlbW92ZS1wZW5kaW5nXHJcbiAgICAgKiBAZmlyZXMgYWRkLXJlbW92ZS1wZW5kaW5nXHJcbiAgICAgKiBAZmlyZXMgdXBkYXRlLXBlbmRpbmdcclxuICAgICAqIEBmaXJlcyBkZWxldGUtcGVuZGluZ1xyXG4gICAgICogQGZpcmVzIGNvcHktcGVuZGluZ1xyXG4gICAgICogQGZpcmVzIG1heGltdW0tcmVtb3ZlLXBlbmRpbmdcclxuICAgICAqIEBmaXJlcyBjbGlja2VkXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHV0aWxzLm9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxyXG4gICAgICAgIHRoaXMuX2FkZFRvR2xvYmFsVHJhY2tlcigpXHJcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLl9nZXRDaGlsZHJlbigpXHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7XHJcbiAgICAgICAgICAgIGRyYWdTdGFydDogKGUpID0+IHRoaXMuX2RyYWdTdGFydChlKSxcclxuICAgICAgICAgICAgZHJhZ0VuZDogKGUpID0+IHRoaXMuX2RyYWdFbmQoZSksXHJcbiAgICAgICAgICAgIGRyYWdPdmVyOiAoZSkgPT4gdGhpcy5fZHJhZ092ZXIoZSksXHJcbiAgICAgICAgICAgIGRyb3A6IChlKSA9PiB0aGlzLl9kcm9wKGUpLFxyXG4gICAgICAgICAgICBkcmFnTGVhdmU6IChlKSA9PiB0aGlzLl9kcmFnTGVhdmUoZSksXHJcbiAgICAgICAgICAgIG1vdXNlRG93bjogKGUpID0+IHRoaXMuX21vdXNlRG93bihlKSxcclxuICAgICAgICAgICAgbW91c2VVcDogKGUpID0+IHRoaXMuX21vdXNlVXAoZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgZWxlbWVudHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5kcmFnQ2xhc3MgfHwgdXRpbHMuY29udGFpbnNDbGFzc05hbWUoY2hpbGQsIHRoaXMub3B0aW9ucy5kcmFnQ2xhc3MpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaEVsZW1lbnQoY2hpbGQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuZXZlbnRzLmRyYWdPdmVyKVxyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIHRoaXMuZXZlbnRzLmRyb3ApXHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCB0aGlzLmV2ZW50cy5kcmFnTGVhdmUpXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXJzb3JIb3ZlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX2dldENoaWxkcmVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHV0aWxzLnN0eWxlKGNoaWxkLCAnY3Vyc29yJywgdGhpcy5vcHRpb25zLmN1cnNvckhvdmVyKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXJzb3JEb3duKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuZXZlbnRzLm1vdXNlRG93bilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmV2ZW50cy5tb3VzZVVwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVtb3ZlcyBhbGwgZXZlbnQgaGFuZGxlcnMgZnJvbSB0aGlzLmVsZW1lbnQgYW5kIGNoaWxkcmVuXHJcbiAgICAgKi9cclxuICAgIGRlc3Ryb3koKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuZXZlbnRzLmRyYWdPdmVyKVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcm9wJywgdGhpcy5ldmVudHMuZHJvcClcclxuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuX2dldENoaWxkcmVuKClcclxuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBlbGVtZW50cylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudChjaGlsZClcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdG9kbzogcmVtb3ZlIFNvcnRhYmxlLnRyYWNrZXIgYW5kIHJlbGF0ZWQgZXZlbnQgaGFuZGxlcnMgaWYgbm8gbW9yZSBzb3J0YWJsZXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRoZSBnbG9iYWwgZGVmYXVsdHMgZm9yIG5ldyBTb3J0YWJsZSBvYmplY3RzXHJcbiAgICAgKiBAdHlwZSB7RGVmYXVsdE9wdGlvbnN9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgZGVmYXVsdHMoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBkZWZhdWx0c1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIG11bHRpcGxlIHNvcnRhYmxlIGVsZW1lbnRzXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50c1tdfSBlbGVtZW50c1xyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBzZWUgY29uc3RydWN0b3IgZm9yIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZShlbGVtZW50cywgb3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gW11cclxuICAgICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBTb3J0YWJsZShlbGVtZW50LCBvcHRpb25zKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZCBhbiBlbGVtZW50IGFzIGEgY2hpbGQgb2YgdGhlIHNvcnRhYmxlIGVsZW1lbnQ7IGNhbiBhbHNvIGJlIHVzZWQgdG8gc3dhcCBiZXR3ZWVuIHNvcnRhYmxlc1xyXG4gICAgICogTk9URTogdGhpcyBtYXkgbm90IHdvcmsgd2l0aCBkZWVwU2VhcmNoIG5vbi1vcmRlcmVkIGVsZW1lbnRzOyB1c2UgYXR0YWNoRWxlbWVudCBpbnN0ZWFkXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgICAqL1xyXG4gICAgYWRkKGVsZW1lbnQsIGluZGV4KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYXR0YWNoRWxlbWVudChlbGVtZW50KVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5kZXggPT09ICd1bmRlZmluZWQnIHx8IGluZGV4ID49IHRoaXMuZWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZShlbGVtZW50LCB0aGlzLmVsZW1lbnQuY2hpbGRyZW5baW5kZXggKyAxXSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMub3B0aW9ucy5vcmRlcklkXHJcbiAgICAgICAgICAgIGxldCBkcmFnT3JkZXIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShpZClcclxuICAgICAgICAgICAgZHJhZ09yZGVyID0gdGhpcy5vcHRpb25zLm9yZGVySWRJc051bWJlciA/IHBhcnNlRmxvYXQoZHJhZ09yZGVyKSA6IGRyYWdPcmRlclxyXG4gICAgICAgICAgICBsZXQgZm91bmRcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRDaGlsZHJlbih0cnVlKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJldmVyc2VPcmRlcilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGREcmFnT3JkZXIgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGREcmFnT3JkZXIgPSB0aGlzLm9wdGlvbnMub3JkZXJJc051bWJlciA/IHBhcnNlRmxvYXQoY2hpbGREcmFnT3JkZXIpIDogY2hpbGREcmFnT3JkZXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZHJhZ09yZGVyID4gY2hpbGREcmFnT3JkZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbGVtZW50LCBjaGlsZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkRHJhZ09yZGVyID0gY2hpbGQuZ2V0QXR0cmlidXRlKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkRHJhZ09yZGVyID0gdGhpcy5vcHRpb25zLm9yZGVySXNOdW1iZXIgPyBwYXJzZUZsb2F0KGNoaWxkRHJhZ09yZGVyKSA6IGNoaWxkRHJhZ09yZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRyYWdPcmRlciA8IGNoaWxkRHJhZ09yZGVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudCwgY2hpbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWZvdW5kKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGF0dGFjaGVzIGFuIEhUTUwgZWxlbWVudCB0byB0aGUgc29ydGFibGU7IGNhbiBhbHNvIGJlIHVzZWQgdG8gc3dhcCBiZXR3ZWVuIHNvcnRhYmxlc1xyXG4gICAgICogTk9URTogeW91IG5lZWQgdG8gbWFudWFsbHkgaW5zZXJ0IHRoZSBlbGVtZW50IGludG8gdGhpcy5lbGVtZW50ICh0aGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSBoYXZlIGEgZGVlcCBzdHJ1Y3R1cmUpXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIGF0dGFjaEVsZW1lbnQoZWxlbWVudClcclxuICAgIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5fX3NvcnRhYmxlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZWxlbWVudC5fX3NvcnRhYmxlLm9yaWdpbmFsID0gdGhpc1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50Ll9fc29ydGFibGUgPSB7XHJcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB0aGlzXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFkZCBhIGNvdW50ZXIgZm9yIG1heGltdW1cclxuICAgICAgICAgICAgdGhpcy5fbWF4aW11bUNvdW50ZXIoZWxlbWVudCwgdGhpcylcclxuXHJcbiAgICAgICAgICAgIC8vIGVuc3VyZSBldmVyeSBlbGVtZW50IGhhcyBhbiBpZFxyXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQuaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuaWQgPSAnX19zb3J0YWJsZS0nICsgdGhpcy5vcHRpb25zLm5hbWUgKyAnLScgKyBTb3J0YWJsZS50cmFja2VyW3RoaXMub3B0aW9ucy5uYW1lXS5jb3VudGVyXHJcbiAgICAgICAgICAgICAgICBTb3J0YWJsZS50cmFja2VyW3RoaXMub3B0aW9ucy5uYW1lXS5jb3VudGVyKytcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvcHkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuX19zb3J0YWJsZS5jb3B5ID0gMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgdGhpcy5ldmVudHMuZHJhZ1N0YXJ0KVxyXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCB0aGlzLmV2ZW50cy5kcmFnRW5kKVxyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZW1vdmVzIGFsbCBldmVudHMgZnJvbSBhbiBIVE1MIGVsZW1lbnRcclxuICAgICAqIE5PVEU6IGRvZXMgbm90IHJlbW92ZSB0aGUgZWxlbWVudCBmcm9tIGl0cyBwYXJlbnRcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlRWxlbWVudChlbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgdGhpcy5ldmVudHMuZHJhZ1N0YXJ0KVxyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIHRoaXMuZXZlbnRzLmRyYWdFbmQpXHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIGZhbHNlKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogYWRkIHNvcnRhYmxlIHRvIGdsb2JhbCBsaXN0IHRoYXQgdHJhY2tzIGFsbCBzb3J0YWJsZXNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9hZGRUb0dsb2JhbFRyYWNrZXIoKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghU29ydGFibGUudHJhY2tlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNvcnRhYmxlLmRyYWdJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICAgIFNvcnRhYmxlLmRyYWdJbWFnZS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50J1xyXG4gICAgICAgICAgICBTb3J0YWJsZS5kcmFnSW1hZ2Uuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnXHJcbiAgICAgICAgICAgIFNvcnRhYmxlLmRyYWdJbWFnZS5zdHlsZS5sZWZ0ID0gLTEwXHJcbiAgICAgICAgICAgIFNvcnRhYmxlLmRyYWdJbWFnZS5zdHlsZS50b3AgPSAtMTBcclxuICAgICAgICAgICAgU29ydGFibGUuZHJhZ0ltYWdlLnN0eWxlLndpZHRoID0gU29ydGFibGUuZHJhZ0ltYWdlLnN0eWxlLmhlaWdodCA9ICc1cHgnXHJcbiAgICAgICAgICAgIFNvcnRhYmxlLmRyYWdJbWFnZS5zdHlsZS56SW5kZXggPSAtMVxyXG4gICAgICAgICAgICBTb3J0YWJsZS5kcmFnSW1hZ2UuaWQgPSAnc29ydGFibGUtZHJhZ0ltYWdlJ1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFNvcnRhYmxlLmRyYWdJbWFnZSlcclxuICAgICAgICAgICAgU29ydGFibGUudHJhY2tlciA9IHt9XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4gdGhpcy5fYm9keURyYWdPdmVyKGUpKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZSkgPT4gdGhpcy5fYm9keURyb3AoZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChTb3J0YWJsZS50cmFja2VyW3RoaXMub3B0aW9ucy5uYW1lXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNvcnRhYmxlLnRyYWNrZXJbdGhpcy5vcHRpb25zLm5hbWVdLmxpc3QucHVzaCh0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTb3J0YWJsZS50cmFja2VyW3RoaXMub3B0aW9ucy5uYW1lXSA9IHsgbGlzdDogW3RoaXNdLCBjb3VudGVyOiAwIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkZWZhdWx0IGRyYWcgb3ZlciBmb3IgdGhlIGJvZHlcclxuICAgICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfYm9keURyYWdPdmVyKGUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGUuZGF0YVRyYW5zZmVyLnR5cGVzWzBdXHJcbiAgICAgICAgaWYgKFNvcnRhYmxlLnRyYWNrZXJbbmFtZV0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyLnR5cGVzWzFdXHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAgICAgY29uc3Qgc29ydGFibGUgPSB0aGlzLl9maW5kQ2xvc2VzdChlLCBTb3J0YWJsZS50cmFja2VyW25hbWVdLmxpc3QsIGVsZW1lbnQpXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc29ydGFibGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvcnRhYmxlLmxhc3QgJiYgTWF0aC5hYnMoc29ydGFibGUubGFzdC54IC0gZS5wYWdlWCkgPCBzb3J0YWJsZS5vcHRpb25zLnRocmVzaG9sZCAmJiBNYXRoLmFicyhzb3J0YWJsZS5sYXN0LnkgLSBlLnBhZ2VZKSA8IHNvcnRhYmxlLm9wdGlvbnMudGhyZXNob2xkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGFibGUuX3VwZGF0ZURyYWdnaW5nKGUsIGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzb3J0YWJsZS5sYXN0ID0geyB4OiBlLnBhZ2VYLCB5OiBlLnBhZ2VZIH1cclxuICAgICAgICAgICAgICAgICAgICBzb3J0YWJsZS5fcGxhY2VJbkxpc3Qoc29ydGFibGUsIGUucGFnZVgsIGUucGFnZVksIGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJ1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlLl91cGRhdGVEcmFnZ2luZyhlLCBlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vRHJvcChlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgbm8gZHJvcFxyXG4gICAgICogQHBhcmFtIHtVSUV2ZW50fSBlXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjYW5jZWxdIGZvcmNlIGNhbmNlbCAoZm9yIG9wdGlvbnMuY29weSlcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9ub0Ryb3AoZSwgY2FuY2VsKVxyXG4gICAge1xyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSdcclxuICAgICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyLnR5cGVzWzFdXHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgIGlmIChlbGVtZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRHJhZ2dpbmcoZSwgZWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5fc2V0SWNvbihlbGVtZW50LCBudWxsLCBjYW5jZWwpXHJcbiAgICAgICAgICAgIGlmICghY2FuY2VsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5fX3NvcnRhYmxlLm9yaWdpbmFsLm9wdGlvbnMub2ZmTGlzdCA9PT0gJ2RlbGV0ZScpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50Ll9fc29ydGFibGUuZGlzcGxheSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuX19zb3J0YWJsZS5kaXNwbGF5ID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5IHx8ICd1bnNldCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuX19zb3J0YWJsZS5vcmlnaW5hbC5lbWl0KCdkZWxldGUtcGVuZGluZycsIGVsZW1lbnQsIGVsZW1lbnQuX19zb3J0YWJsZS5vcmlnaW5hbClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghZWxlbWVudC5fX3NvcnRhYmxlLm9yaWdpbmFsLm9wdGlvbnMuY29weSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXBsYWNlSW5MaXN0KGVsZW1lbnQuX19zb3J0YWJsZS5vcmlnaW5hbCwgZWxlbWVudClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyTWF4aW11bVBlbmRpbmcoZWxlbWVudC5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50Ll9fc29ydGFibGUuY3VycmVudC5lbWl0KCdhZGQtcmVtb3ZlLXBlbmRpbmcnLCBlbGVtZW50LCBlbGVtZW50Ll9fc29ydGFibGUuY3VycmVudClcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuX19zb3J0YWJsZS5jdXJyZW50LmVtaXQoJ3VwZGF0ZS1wZW5kaW5nJywgZWxlbWVudCwgZWxlbWVudC5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50Ll9fc29ydGFibGUuY3VycmVudCA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRlZmF1bHQgZHJvcCBmb3IgdGhlIGJvZHlcclxuICAgICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfYm9keURyb3AoZSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBuYW1lID0gZS5kYXRhVHJhbnNmZXIudHlwZXNbMF1cclxuICAgICAgICBpZiAoU29ydGFibGUudHJhY2tlcltuYW1lXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZS5kYXRhVHJhbnNmZXIudHlwZXNbMV1cclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgICAgICBjb25zdCBzb3J0YWJsZSA9IHRoaXMuX2ZpbmRDbG9zZXN0KGUsIFNvcnRhYmxlLnRyYWNrZXJbbmFtZV0ubGlzdCwgZWxlbWVudClcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChzb3J0YWJsZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZURyYWdnaW5nKGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5fX3NvcnRhYmxlLmRpc3BsYXkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGVsZW1lbnQuX19zb3J0YWJsZS5kaXNwbGF5XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5fX3NvcnRhYmxlLmRpc3BsYXkgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5fX3NvcnRhYmxlLm9yaWdpbmFsLmVtaXQoJ2RlbGV0ZScsIGVsZW1lbnQsIGVsZW1lbnQuX19zb3J0YWJsZS5vcmlnaW5hbClcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll9fc29ydGFibGUub3JpZ2luYWwgPSBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBlbmQgZHJhZ1xyXG4gICAgICogQHBhcmFtIHtVSUV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhZ0VuZChlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBlLmN1cnJlbnRUYXJnZXRcclxuICAgICAgICBjb25zdCBkcmFnZ2luZyA9IGVsZW1lbnQuX19zb3J0YWJsZS5kcmFnZ2luZ1xyXG4gICAgICAgIGlmIChkcmFnZ2luZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRyYWdnaW5nLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZy5pY29uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZy5pY29uLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudC5fX3NvcnRhYmxlLmRyYWdnaW5nID0gbnVsbFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmN1cnNvckhvdmVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdXRpbHMuc3R5bGUoZS5jdXJyZW50VGFyZ2V0LCAnY3Vyc29yJywgdGhpcy5vcHRpb25zLmN1cnNvckhvdmVyKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHN0YXJ0IGRyYWdcclxuICAgICAqIEBwYXJhbSB7VUlFdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYWdTdGFydChlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHNvcnRhYmxlID0gZS5jdXJyZW50VGFyZ2V0Ll9fc29ydGFibGUub3JpZ2luYWxcclxuICAgICAgICBjb25zdCBkcmFnZ2luZyA9IGUuY3VycmVudFRhcmdldC5jbG9uZU5vZGUodHJ1ZSlcclxuICAgICAgICBmb3IgKGxldCBzdHlsZSBpbiBzb3J0YWJsZS5vcHRpb25zLmRyYWdTdHlsZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRyYWdnaW5nLnN0eWxlW3N0eWxlXSA9IHNvcnRhYmxlLm9wdGlvbnMuZHJhZ1N0eWxlW3N0eWxlXVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwb3MgPSB1dGlscy50b0dsb2JhbChlLmN1cnJlbnRUYXJnZXQpXHJcbiAgICAgICAgZHJhZ2dpbmcuc3R5bGUubGVmdCA9IHBvcy54ICsgJ3B4J1xyXG4gICAgICAgIGRyYWdnaW5nLnN0eWxlLnRvcCA9IHBvcy55ICsgJ3B4J1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHsgeDogcG9zLnggLSBlLnBhZ2VYLCB5OiBwb3MueSAtIGUucGFnZVkgfVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZHJhZ2dpbmcpXHJcbiAgICAgICAgaWYgKHNvcnRhYmxlLm9wdGlvbnMudXNlSWNvbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHNvcnRhYmxlLm9wdGlvbnMuaWNvbnMucmVvcmRlclxyXG4gICAgICAgICAgICBpbWFnZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcclxuICAgICAgICAgICAgaW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSdcclxuICAgICAgICAgICAgaW1hZ2Uuc3R5bGUubGVmdCA9IGRyYWdnaW5nLm9mZnNldExlZnQgKyBkcmFnZ2luZy5vZmZzZXRXaWR0aCArICdweCdcclxuICAgICAgICAgICAgaW1hZ2Uuc3R5bGUudG9wID0gZHJhZ2dpbmcub2Zmc2V0VG9wICsgZHJhZ2dpbmcub2Zmc2V0SGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGltYWdlKVxyXG4gICAgICAgICAgICBkcmFnZ2luZy5pY29uID0gaW1hZ2VcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNvcnRhYmxlLm9wdGlvbnMuY3Vyc29ySG92ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB1dGlscy5zdHlsZShlLmN1cnJlbnRUYXJnZXQsICdjdXJzb3InLCBzb3J0YWJsZS5vcHRpb25zLmN1cnNvckhvdmVyKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0XHJcbiAgICAgICAgaWYgKHNvcnRhYmxlLm9wdGlvbnMuY29weSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IGUuY3VycmVudFRhcmdldC5jbG9uZU5vZGUodHJ1ZSlcclxuICAgICAgICAgICAgdGFyZ2V0LmlkID0gZS5jdXJyZW50VGFyZ2V0LmlkICsgJy1jb3B5LScgKyBlLmN1cnJlbnRUYXJnZXQuX19zb3J0YWJsZS5jb3B5XHJcbiAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5fX3NvcnRhYmxlLmNvcHkrK1xyXG4gICAgICAgICAgICBzb3J0YWJsZS5hdHRhY2hFbGVtZW50KHRhcmdldClcclxuICAgICAgICAgICAgdGFyZ2V0Ll9fc29ydGFibGUuaXNDb3B5ID0gdHJ1ZVxyXG4gICAgICAgICAgICB0YXJnZXQuX19zb3J0YWJsZS5vcmlnaW5hbCA9IHRoaXNcclxuICAgICAgICAgICAgdGFyZ2V0Ll9fc29ydGFibGUuZGlzcGxheSA9IHRhcmdldC5zdHlsZS5kaXNwbGF5IHx8ICd1bnNldCdcclxuICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0YXJnZXQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLmNsZWFyRGF0YSgpXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShzb3J0YWJsZS5vcHRpb25zLm5hbWUsIHNvcnRhYmxlLm9wdGlvbnMubmFtZSlcclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKHRhcmdldC5pZCwgdGFyZ2V0LmlkKVxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShTb3J0YWJsZS5kcmFnSW1hZ2UsIDAsIDApXHJcbiAgICAgICAgdGFyZ2V0Ll9fc29ydGFibGUuY3VycmVudCA9IHRoaXNcclxuICAgICAgICB0YXJnZXQuX19zb3J0YWJsZS5pbmRleCA9IHNvcnRhYmxlLm9wdGlvbnMuY29weSA/IC0xIDogc29ydGFibGUuX2dldEluZGV4KHRhcmdldClcclxuICAgICAgICB0YXJnZXQuX19zb3J0YWJsZS5kcmFnZ2luZyA9IGRyYWdnaW5nXHJcbiAgICAgICAgdGFyZ2V0Ll9fc29ydGFibGUub2Zmc2V0ID0gb2Zmc2V0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgZHJhZyBsZWF2ZSBldmVudHMgZm9yIHNvcnRhYmxlIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhZ0xlYXZlKGUpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gY29uc3QgaWQgPSBlLmRhdGFUcmFuc2Zlci50eXBlc1sxXVxyXG4gICAgICAgIC8vIGlmIChpZClcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAvLyAgICAgaWYgKGVsZW1lbnQpXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIGNvbnN0IHNvcnRhYmxlID0gZWxlbWVudC5fX3NvcnRhYmxlLmN1cnJlbnRcclxuICAgICAgICAvLyAgICAgICAgIHNvcnRhYmxlLl9tYXhpbXVtUGVuZGluZyhlbGVtZW50LCBzb3J0YWJsZSlcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBkcmFnIG92ZXIgZXZlbnRzIGZvciBzb3J0YWJsZSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge0RyYWdFdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYWdPdmVyKGUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgc29ydGFibGUgPSBlLmRhdGFUcmFuc2Zlci50eXBlc1swXVxyXG4gICAgICAgIGlmIChzb3J0YWJsZSAmJiBzb3J0YWJsZSA9PT0gdGhpcy5vcHRpb25zLm5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyLnR5cGVzWzFdXHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdCAmJiBNYXRoLmFicyh0aGlzLmxhc3QueCAtIGUucGFnZVgpIDwgdGhpcy5vcHRpb25zLnRocmVzaG9sZCAmJiBNYXRoLmFicyh0aGlzLmxhc3QueSAtIGUucGFnZVkpIDwgdGhpcy5vcHRpb25zLnRocmVzaG9sZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRHJhZ2dpbmcoZSwgZWxlbWVudClcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sYXN0ID0geyB4OiBlLnBhZ2VYLCB5OiBlLnBhZ2VZIH1cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuX19zb3J0YWJsZS5pc0NvcHkgJiYgZWxlbWVudC5fX3NvcnRhYmxlLm9yaWdpbmFsID09PSB0aGlzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ub0Ryb3AoZSwgdHJ1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZHJvcCB8fCBlbGVtZW50Ll9fc29ydGFibGUub3JpZ2luYWwgPT09IHRoaXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BsYWNlSW5MaXN0KHRoaXMsIGUucGFnZVgsIGUucGFnZVksIGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gZWxlbWVudC5fX3NvcnRhYmxlLmlzQ29weSA/ICdjb3B5JyA6ICdtb3ZlJ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRHJhZ2dpbmcoZSwgZWxlbWVudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25vRHJvcChlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdXBkYXRlIHRoZSBkcmFnZ2luZyBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge1VJRXZlbnR9IGVcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF91cGRhdGVEcmFnZ2luZyhlLCBlbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGRyYWdnaW5nID0gZWxlbWVudC5fX3NvcnRhYmxlLmRyYWdnaW5nXHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gZWxlbWVudC5fX3NvcnRhYmxlLm9mZnNldFxyXG4gICAgICAgIGlmIChkcmFnZ2luZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRyYWdnaW5nLnN0eWxlLmxlZnQgPSBlLnBhZ2VYICsgb2Zmc2V0LnggKyAncHgnXHJcbiAgICAgICAgICAgIGRyYWdnaW5nLnN0eWxlLnRvcCA9IGUucGFnZVkgKyBvZmZzZXQueSArICdweCdcclxuICAgICAgICAgICAgaWYgKGRyYWdnaW5nLmljb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nLmljb24uc3R5bGUubGVmdCA9IGRyYWdnaW5nLm9mZnNldExlZnQgKyBkcmFnZ2luZy5vZmZzZXRXaWR0aCArICdweCdcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nLmljb24uc3R5bGUudG9wID0gZHJhZ2dpbmcub2Zmc2V0VG9wICsgZHJhZ2dpbmcub2Zmc2V0SGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVtb3ZlIHRoZSBkcmFnZ2luZyBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcmVtb3ZlRHJhZ2dpbmcoZWxlbWVudClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBkcmFnZ2luZyA9IGVsZW1lbnQuX19zb3J0YWJsZS5kcmFnZ2luZ1xyXG4gICAgICAgIGlmIChkcmFnZ2luZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRyYWdnaW5nLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZy5pY29uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZy5pY29uLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudC5fX3NvcnRhYmxlLmRyYWdnaW5nID0gbnVsbFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50Ll9fc29ydGFibGUuaXNDb3B5ID0gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyb3AgdGhlIGVsZW1lbnQgaW50byBhIHNvcnRhYmxlXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJvcChlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBlLmRhdGFUcmFuc2Zlci50eXBlc1swXVxyXG4gICAgICAgIGlmIChTb3J0YWJsZS50cmFja2VyW25hbWVdICYmIG5hbWUgPT09IHRoaXMub3B0aW9ucy5uYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSBlLmRhdGFUcmFuc2Zlci50eXBlc1sxXVxyXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50Ll9fc29ydGFibGUuY3VycmVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuX19zb3J0YWJsZS5vcmlnaW5hbCAhPT0gdGhpcylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll9fc29ydGFibGUub3JpZ2luYWwuZW1pdCgncmVtb3ZlJywgZWxlbWVudCwgZWxlbWVudC5fX3NvcnRhYmxlLm9yaWdpbmFsKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnYWRkJywgZWxlbWVudCwgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Ll9fc29ydGFibGUub3JpZ2luYWwgPSB0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zb3J0KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdvcmRlcicsIGVsZW1lbnQsIHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Ll9fc29ydGFibGUuaXNDb3B5KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdjb3B5JywgZWxlbWVudCwgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4aW11bShlbGVtZW50LCB0aGlzKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndXBkYXRlJywgZWxlbWVudCwgdGhpcylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5fX3NvcnRhYmxlLmluZGV4ICE9PSB0aGlzLl9nZXRJbmRleChlLmN1cnJlbnRUYXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdvcmRlcicsIGVsZW1lbnQsIHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndXBkYXRlJywgZWxlbWVudCwgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRHJhZ2dpbmcoZWxlbWVudClcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBmaW5kIGNsb3Nlc3QgU29ydGFibGUgdG8gc2NyZWVuIGxvY2F0aW9uXHJcbiAgICAgKiBAcGFyYW0ge1VJRXZlbnR9IGVcclxuICAgICAqIEBwYXJhbSB7U29ydGFibGVbXX0gbGlzdCBvZiByZWxhdGVkIFNvcnRhYmxlc1xyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2ZpbmRDbG9zZXN0KGUsIGxpc3QsIGVsZW1lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1pbiA9IEluZmluaXR5LCBmb3VuZFxyXG4gICAgICAgIGZvciAobGV0IHJlbGF0ZWQgb2YgbGlzdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICgoIXJlbGF0ZWQub3B0aW9ucy5kcm9wICYmIGVsZW1lbnQuX19zb3J0YWJsZS5vcmlnaW5hbCAhPT0gcmVsYXRlZCkgfHxcclxuICAgICAgICAgICAgICAgIChlbGVtZW50Ll9fc29ydGFibGUuaXNDb3B5ICYmIGVsZW1lbnQuX19zb3J0YWJsZS5vcmlnaW5hbCA9PT0gcmVsYXRlZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHV0aWxzLmluc2lkZShlLnBhZ2VYLCBlLnBhZ2VZLCByZWxhdGVkLmVsZW1lbnQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlbGF0ZWQub3B0aW9ucy5vZmZMaXN0ID09PSAnY2xvc2VzdCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZSA9IHV0aWxzLmRpc3RhbmNlVG9DbG9zZXN0Q29ybmVyKGUucGFnZVgsIGUucGFnZVksIHJlbGF0ZWQuZWxlbWVudClcclxuICAgICAgICAgICAgICAgIGlmIChjYWxjdWxhdGUgPCBtaW4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluID0gY2FsY3VsYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSByZWxhdGVkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBwbGFjZSBpbmRpY2F0b3IgaW4gdGhlIHNvcnRhYmxlIGxpc3QgYWNjb3JkaW5nIHRvIG9wdGlvbnMuc29ydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge1NvcnRhYmxlfSBzb3J0YWJsZVxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3BsYWNlSW5MaXN0KHNvcnRhYmxlLCB4LCB5LCBlbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlSW5Tb3J0YWJsZUxpc3Qoc29ydGFibGUsIHgsIHksIGVsZW1lbnQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlSW5PcmRlcmVkTGlzdChzb3J0YWJsZSwgZWxlbWVudClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2V0SWNvbihlbGVtZW50LCBzb3J0YWJsZSlcclxuICAgICAgICBpZiAoZWxlbWVudC5fX3NvcnRhYmxlLmRpc3BsYXkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBlbGVtZW50Ll9fc29ydGFibGUuZGlzcGxheSA9PT0gJ3Vuc2V0JyA/ICcnIDogZWxlbWVudC5fX3NvcnRhYmxlLmRpc3BsYXlcclxuICAgICAgICAgICAgZWxlbWVudC5fX3NvcnRhYmxlLmRpc3BsYXkgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVwbGFjZSBpdGVtIGluIGxpc3QgYXQgb3JpZ2luYWwgaW5kZXggcG9zaXRpb25cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9yZXBsYWNlSW5MaXN0KHNvcnRhYmxlLCBlbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gc29ydGFibGUuX2dldENoaWxkcmVuKClcclxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBlbGVtZW50Ll9fc29ydGFibGUuaW5kZXhcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltpbmRleF0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudCwgY2hpbGRyZW5baW5kZXhdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQoZWxlbWVudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzb3J0YWJsZS5lbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY291bnQgdGhlIGluZGV4IG9mIHRoZSBjaGlsZCBpbiB0aGUgbGlzdCBvZiBjaGlsZHJlblxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2hpbGRcclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9nZXRJbmRleChjaGlsZClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldENoaWxkcmVuKClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuW2ldID09PSBjaGlsZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRyYXZlcnNlIGFuZCBzZWFyY2ggZGVzY2VuZGVudHMgaW4gRE9NXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBiYXNlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50W119IHJlc3VsdHMgdG8gcmV0dXJuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfdHJhdmVyc2VDaGlsZHJlbihiYXNlLCBzZWFyY2gsIHJlc3VsdHMpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgYmFzZS5jaGlsZHJlbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoLmluZGV4T2YoY2hpbGQuY2xhc3NOYW1lKSAhPT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGNoaWxkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYXZlcnNlQ2hpbGRyZW4oY2hpbGQsIHNlYXJjaCwgcmVzdWx0cylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBmaW5kIGNoaWxkcmVuIGluIGRpdlxyXG4gICAgICogQHBhcmFtIHtTb3J0YWJsZX0gc29ydGFibGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29yZGVyXSBzZWFyY2ggZm9yIGRyYWdPcmRlciBhcyB3ZWxsXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZ2V0Q2hpbGRyZW4ob3JkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWVwU2VhcmNoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHNlYXJjaCA9IFtdXHJcbiAgICAgICAgICAgIGlmIChvcmRlciAmJiB0aGlzLm9wdGlvbnMub3JkZXJDbGFzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcmFnQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoLnB1c2godGhpcy5vcHRpb25zLmRyYWdDbGFzcylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcmRlciAmJiB0aGlzLm9wdGlvbnMub3JkZXJDbGFzcylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2gucHVzaCh0aGlzLm9wdGlvbnMub3JkZXJDbGFzcylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghb3JkZXIgJiYgdGhpcy5vcHRpb25zLmRyYWdDbGFzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoLnB1c2godGhpcy5vcHRpb25zLmRyYWdDbGFzcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gW11cclxuICAgICAgICAgICAgdGhpcy5fdHJhdmVyc2VDaGlsZHJlbih0aGlzLmVsZW1lbnQsIHNlYXJjaCwgcmVzdWx0cylcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcmFnQ2xhc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gW11cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuZWxlbWVudC5jaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXRpbHMuY29udGFpbnNDbGFzc05hbWUoY2hpbGQsIHRoaXMub3B0aW9ucy5kcmFnQ2xhc3MpIHx8IChvcmRlciAmJiAhdGhpcy5vcHRpb25zLm9yZGVyQ2xhc3MgfHwgKG9yZGVyICYmIHRoaXMub3B0aW9ucy5vcmRlckNsYXNzICYmIHV0aWxzLmNvbnRhaW5zQ2xhc3NOYW1lKGNoaWxkLCB0aGlzLm9wdGlvbnMub3JkZXJDbGFzcykpKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChjaGlsZClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmVsZW1lbnQuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHBsYWNlIGluZGljYXRvciBpbiBhbiBvcmRlcmVkIGxpc3RcclxuICAgICAqIEBwYXJhbSB7U29ydGFibGV9IHNvcnRhYmxlXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkcmFnZ2luZ1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3BsYWNlSW5PcmRlcmVkTGlzdChzb3J0YWJsZSwgZHJhZ2dpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGRyYWdnaW5nLl9fc29ydGFibGUuY3VycmVudCAhPT0gc29ydGFibGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHNvcnRhYmxlLm9wdGlvbnMub3JkZXJJZFxyXG4gICAgICAgICAgICBsZXQgZHJhZ09yZGVyID0gZHJhZ2dpbmcuZ2V0QXR0cmlidXRlKGlkKVxyXG4gICAgICAgICAgICBkcmFnT3JkZXIgPSBzb3J0YWJsZS5vcHRpb25zLm9yZGVySWRJc051bWJlciA/IHBhcnNlRmxvYXQoZHJhZ09yZGVyKSA6IGRyYWdPcmRlclxyXG4gICAgICAgICAgICBsZXQgZm91bmRcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBzb3J0YWJsZS5fZ2V0Q2hpbGRyZW4odHJ1ZSlcclxuICAgICAgICAgICAgaWYgKHNvcnRhYmxlLm9wdGlvbnMucmV2ZXJzZU9yZGVyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZERyYWdPcmRlciA9IGNoaWxkLmdldEF0dHJpYnV0ZShpZClcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZERyYWdPcmRlciA9IHNvcnRhYmxlLm9wdGlvbnMub3JkZXJJc051bWJlciA/IHBhcnNlRmxvYXQoY2hpbGREcmFnT3JkZXIpIDogY2hpbGREcmFnT3JkZXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZHJhZ09yZGVyID4gY2hpbGREcmFnT3JkZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkcmFnZ2luZywgY2hpbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZERyYWdPcmRlciA9IGNoaWxkLmdldEF0dHJpYnV0ZShpZClcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZERyYWdPcmRlciA9IHNvcnRhYmxlLm9wdGlvbnMub3JkZXJJc051bWJlciA/IHBhcnNlRmxvYXQoY2hpbGREcmFnT3JkZXIpIDogY2hpbGREcmFnT3JkZXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZHJhZ09yZGVyIDwgY2hpbGREcmFnT3JkZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkcmFnZ2luZywgY2hpbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWZvdW5kKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzb3J0YWJsZS5lbGVtZW50LmFwcGVuZENoaWxkKGRyYWdnaW5nKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQgIT09IGRyYWdnaW5nLl9fc29ydGFibGUub3JpZ2luYWwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmcuX19zb3J0YWJsZS5jdXJyZW50LmVtaXQoJ2FkZC1yZW1vdmUtcGVuZGluZycsIGRyYWdnaW5nLCBkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmcuX19zb3J0YWJsZS5jdXJyZW50LmVtaXQoJ3JlbW92ZS1wZW5kaW5nJywgZHJhZ2dpbmcsIGRyYWdnaW5nLl9fc29ydGFibGUuY3VycmVudClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyTWF4aW11bVBlbmRpbmcoZHJhZ2dpbmcuX19zb3J0YWJsZS5jdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4aW11bShudWxsLCBkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc29ydGFibGUuZW1pdCgnYWRkLXBlbmRpbmcnLCBkcmFnZ2luZywgc29ydGFibGUpXHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZy5fX3NvcnRhYmxlLmlzQ29weSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc29ydGFibGUuZW1pdCgnY29weS1wZW5kaW5nJywgZHJhZ2dpbmcsIHNvcnRhYmxlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRyYWdnaW5nLl9fc29ydGFibGUuY3VycmVudCA9IHNvcnRhYmxlXHJcbiAgICAgICAgICAgIHRoaXMuX21heGltdW1QZW5kaW5nKGRyYWdnaW5nLCBzb3J0YWJsZSlcclxuICAgICAgICAgICAgc29ydGFibGUuZW1pdCgndXBkYXRlLXBlbmRpbmcnLCBkcmFnZ2luZywgc29ydGFibGUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2VhcmNoIGZvciB3aGVyZSB0byBwbGFjZSB1c2luZyBwZXJjZW50YWdlXHJcbiAgICAgKiBAcGFyYW0ge1NvcnRhYmxlfSBzb3J0YWJsZVxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZHJhZ2dpbmdcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IDAgPSBub3QgZm91bmQ7IDEgPSBub3RoaW5nIHRvIGRvOyAyID0gbW92ZWRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9wbGFjZUJ5UGVyY2VudGFnZShzb3J0YWJsZSwgZHJhZ2dpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgY3Vyc29yID0gZHJhZ2dpbmcuX19zb3J0YWJsZS5kcmFnZ2luZ1xyXG4gICAgICAgIGNvbnN0IHhhMSA9IGN1cnNvci5vZmZzZXRMZWZ0XHJcbiAgICAgICAgY29uc3QgeWExID0gY3Vyc29yLm9mZnNldFRvcFxyXG4gICAgICAgIGNvbnN0IHhhMiA9IGN1cnNvci5vZmZzZXRMZWZ0ICsgY3Vyc29yLm9mZnNldFdpZHRoXHJcbiAgICAgICAgY29uc3QgeWEyID0gY3Vyc29yLm9mZnNldFRvcCArIGN1cnNvci5vZmZzZXRIZWlnaHRcclxuICAgICAgICBsZXQgbGFyZ2VzdCA9IDAsIGNsb3Nlc3QsIGlzQmVmb3JlLCBpbmRpY2F0b3JcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gc29ydGFibGUuZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gc29ydGFibGUuX2dldENoaWxkcmVuKHRydWUpXHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgZWxlbWVudHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQgPT09IGRyYWdnaW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3IgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcG9zID0gdXRpbHMudG9HbG9iYWwoY2hpbGQpXHJcbiAgICAgICAgICAgIGNvbnN0IHhiMSA9IHBvcy54XHJcbiAgICAgICAgICAgIGNvbnN0IHliMSA9IHBvcy55XHJcbiAgICAgICAgICAgIGNvbnN0IHhiMiA9IHBvcy54ICsgY2hpbGQub2Zmc2V0V2lkdGhcclxuICAgICAgICAgICAgY29uc3QgeWIyID0gcG9zLnkgKyBjaGlsZC5vZmZzZXRIZWlnaHRcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHV0aWxzLnBlcmNlbnRhZ2UoeGExLCB5YTEsIHhhMiwgeWEyLCB4YjEsIHliMSwgeGIyLCB5YjIpXHJcbiAgICAgICAgICAgIGlmIChwZXJjZW50YWdlID4gbGFyZ2VzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGFyZ2VzdCA9IHBlcmNlbnRhZ2VcclxuICAgICAgICAgICAgICAgIGNsb3Nlc3QgPSBjaGlsZFxyXG4gICAgICAgICAgICAgICAgaXNCZWZvcmUgPSBpbmRpY2F0b3JcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xvc2VzdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZXN0ID09PSBkcmFnZ2luZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNCZWZvcmUgJiYgY2xvc2VzdC5uZXh0U2libGluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5pbnNlcnRCZWZvcmUoZHJhZ2dpbmcsIGNsb3Nlc3QubmV4dFNpYmxpbmcpXHJcbiAgICAgICAgICAgICAgICBzb3J0YWJsZS5lbWl0KCdvcmRlci1wZW5kaW5nJywgc29ydGFibGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50Lmluc2VydEJlZm9yZShkcmFnZ2luZywgY2xvc2VzdClcclxuICAgICAgICAgICAgICAgIHNvcnRhYmxlLmVtaXQoJ29yZGVyLXBlbmRpbmcnLCBzb3J0YWJsZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gMlxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNlYXJjaCBmb3Igd2hlcmUgdG8gcGxhY2UgdXNpbmcgZGlzdGFuY2VcclxuICAgICAqIEBwYXJhbSB7U29ydGFibGV9IHNvcnRhYmxlXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkcmFnZ2luZ1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBmYWxzZT1ub3RoaW5nIHRvIGRvXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcGxhY2VCeURpc3RhbmNlKHNvcnRhYmxlLCBkcmFnZ2luZywgeCwgeSlcclxuICAgIHtcclxuICAgICAgICBpZiAodXRpbHMuaW5zaWRlKHgsIHksIGRyYWdnaW5nKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbmRleCA9IC0xXHJcbiAgICAgICAgaWYgKGRyYWdnaW5nLl9fc29ydGFibGUuY3VycmVudCA9PT0gc29ydGFibGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbmRleCA9IHNvcnRhYmxlLl9nZXRJbmRleChkcmFnZ2luZylcclxuICAgICAgICAgICAgc29ydGFibGUuZWxlbWVudC5hcHBlbmRDaGlsZChkcmFnZ2luZylcclxuICAgICAgICAgICAgLy8gZHJhZ2dpbmcucmVtb3ZlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gSW5maW5pdHksIGNsb3Nlc3RcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gc29ydGFibGUuZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gc29ydGFibGUuX2dldENoaWxkcmVuKHRydWUpXHJcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgZWxlbWVudHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodXRpbHMuaW5zaWRlKHgsIHksIGNoaWxkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VzdCA9IGNoaWxkXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWVhc3VyZSA9IHV0aWxzLmRpc3RhbmNlVG9DbG9zZXN0Q29ybmVyKHgsIHksIGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgaWYgKG1lYXN1cmUgPCBkaXN0YW5jZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZXN0ID0gY2hpbGRcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IG1lYXN1cmVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50Lmluc2VydEJlZm9yZShkcmFnZ2luZywgY2xvc2VzdClcclxuICAgICAgICBpZiAoaW5kZXggPT09IHNvcnRhYmxlLl9nZXRJbmRleChkcmFnZ2luZykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9tYXhpbXVtUGVuZGluZyhkcmFnZ2luZywgc29ydGFibGUpXHJcbiAgICAgICAgc29ydGFibGUuZW1pdCgnb3JkZXItcGVuZGluZycsIGRyYWdnaW5nLCBzb3J0YWJsZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHBsYWNlIGluZGljYXRvciBpbiBhbiBzb3J0YWJsZSBsaXN0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGRyYWdnaW5nXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcGxhY2VJblNvcnRhYmxlTGlzdChzb3J0YWJsZSwgeCwgeSwgZHJhZ2dpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHNvcnRhYmxlLmVsZW1lbnRcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHNvcnRhYmxlLl9nZXRDaGlsZHJlbigpXHJcbiAgICAgICAgaWYgKCFjaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRyYWdnaW5nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5fcGxhY2VCeVBlcmNlbnRhZ2Uoc29ydGFibGUsIGRyYWdnaW5nKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGxhY2VCeURpc3RhbmNlKHNvcnRhYmxlLCBkcmFnZ2luZywgeCwgeSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQgIT09IHNvcnRhYmxlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc29ydGFibGUuZW1pdCgnYWRkLXBlbmRpbmcnLCBkcmFnZ2luZywgc29ydGFibGUpXHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZy5fX3NvcnRhYmxlLmlzQ29weSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc29ydGFibGUuZW1pdCgnY29weS1wZW5kaW5nJywgZHJhZ2dpbmcsIHNvcnRhYmxlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQgIT09IGRyYWdnaW5nLl9fc29ydGFibGUub3JpZ2luYWwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmcuX19zb3J0YWJsZS5jdXJyZW50LmVtaXQoJ2FkZC1yZW1vdmUtcGVuZGluZycsIGRyYWdnaW5nLCBkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmcuX19zb3J0YWJsZS5jdXJyZW50LmVtaXQoJ3JlbW92ZS1wZW5kaW5nJywgZHJhZ2dpbmcsIGRyYWdnaW5nLl9fc29ydGFibGUuY3VycmVudClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyTWF4aW11bVBlbmRpbmcoZHJhZ2dpbmcuX19zb3J0YWJsZS5jdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4aW11bShudWxsLCBkcmFnZ2luZy5fX3NvcnRhYmxlLmN1cnJlbnQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZHJhZ2dpbmcuX19zb3J0YWJsZS5jdXJyZW50ID0gc29ydGFibGVcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbWF4aW11bVBlbmRpbmcoZHJhZ2dpbmcsIHNvcnRhYmxlKVxyXG4gICAgICAgIHNvcnRhYmxlLmVtaXQoJ3VwZGF0ZS1wZW5kaW5nJywgZHJhZ2dpbmcsIHNvcnRhYmxlKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0IGljb24gaWYgYXZhaWxhYmxlXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkcmFnZ2luZ1xyXG4gICAgICogQHBhcmFtIHtTb3J0YWJsZX0gc29ydGFibGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NhbmNlbF0gZm9yY2UgY2FuY2VsIChmb3Igb3B0aW9ucy5jb3B5KVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3NldEljb24oZWxlbWVudCwgc29ydGFibGUsIGNhbmNlbClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBkcmFnZ2luZyA9IGVsZW1lbnQuX19zb3J0YWJsZS5kcmFnZ2luZ1xyXG4gICAgICAgIGlmIChkcmFnZ2luZyAmJiBkcmFnZ2luZy5pY29uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFzb3J0YWJsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc29ydGFibGUgPSBlbGVtZW50Ll9fc29ydGFibGUub3JpZ2luYWxcclxuICAgICAgICAgICAgICAgIGlmIChjYW5jZWwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmcuaWNvbi5zcmMgPSBzb3J0YWJsZS5vcHRpb25zLmljb25zLmNhbmNlbFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nLmljb24uc3JjID0gc29ydGFibGUub3B0aW9ucy5vZmZMaXN0ID09PSAnZGVsZXRlJyA/IHNvcnRhYmxlLm9wdGlvbnMuaWNvbnMuZGVsZXRlIDogc29ydGFibGUub3B0aW9ucy5pY29ucy5jYW5jZWxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Ll9fc29ydGFibGUuaXNDb3B5KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nLmljb24uc3JjID0gc29ydGFibGUub3B0aW9ucy5pY29ucy5jb3B5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmcuaWNvbi5zcmMgPSBlbGVtZW50Ll9fc29ydGFibGUub3JpZ2luYWwgPT09IHNvcnRhYmxlID8gc29ydGFibGUub3B0aW9ucy5pY29ucy5yZW9yZGVyIDogc29ydGFibGUub3B0aW9ucy5pY29ucy5tb3ZlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgYSBtYXhpbXVtIGNvdW50ZXIgdG8gdGhlIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7U29ydGFibGV9IHNvcnRhYmxlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfbWF4aW11bUNvdW50ZXIoZWxlbWVudCwgc29ydGFibGUpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gLTFcclxuICAgICAgICBpZiAoc29ydGFibGUub3B0aW9ucy5tYXhpbXVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBzb3J0YWJsZS5fZ2V0Q2hpbGRyZW4oKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkICE9PSBlbGVtZW50ICYmIGNoaWxkLl9fc29ydGFibGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSBjaGlsZC5fX3NvcnRhYmxlLm1heGltdW0gPiBjb3VudCA/IGNoaWxkLl9fc29ydGFibGUubWF4aW11bSA6IGNvdW50XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudC5fX3NvcnRhYmxlLm1heGltdW0gPSBjb3VudCArIDFcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBtYXhpbXVtXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfbWF4aW11bShlbGVtZW50LCBzb3J0YWJsZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoc29ydGFibGUub3B0aW9ucy5tYXhpbXVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBzb3J0YWJsZS5fZ2V0Q2hpbGRyZW4oKVxyXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gc29ydGFibGUub3B0aW9ucy5tYXhpbXVtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc29ydGFibGUucmVtb3ZlUGVuZGluZylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc29ydGFibGUucmVtb3ZlUGVuZGluZy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IHNvcnRhYmxlLnJlbW92ZVBlbmRpbmcucG9wKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9IGNoaWxkLl9fc29ydGFibGUuZGlzcGxheSA9PT0gJ3Vuc2V0JyA/ICcnIDogY2hpbGQuX19zb3J0YWJsZS5kaXNwbGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLl9fc29ydGFibGUuZGlzcGxheSA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGFibGUuZW1pdCgnbWF4aW11bS1yZW1vdmUnLCBjaGlsZCwgc29ydGFibGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlLnJlbW92ZVBlbmRpbmcgPSBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21heGltdW1Db3VudGVyKGVsZW1lbnQsIHNvcnRhYmxlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2xlYXIgcGVuZGluZyBsaXN0XHJcbiAgICAgKiBAcGFyYW0ge1NvcnRhYmxlfSBzb3J0YWJsZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2NsZWFyTWF4aW11bVBlbmRpbmcoc29ydGFibGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHNvcnRhYmxlLnJlbW92ZVBlbmRpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB3aGlsZSAoc29ydGFibGUucmVtb3ZlUGVuZGluZy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gc29ydGFibGUucmVtb3ZlUGVuZGluZy5wb3AoKVxyXG4gICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9IGNoaWxkLl9fc29ydGFibGUuZGlzcGxheSA9PT0gJ3Vuc2V0JyA/ICcnIDogY2hpbGQuX19zb3J0YWJsZS5kaXNwbGF5XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fX3NvcnRhYmxlLmRpc3BsYXkgPSBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc29ydGFibGUucmVtb3ZlUGVuZGluZyA9IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcGVuZGluZyBtYXhpbXVtXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge1NvcnRhYmxlfSBzb3J0YWJsZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX21heGltdW1QZW5kaW5nKGVsZW1lbnQsIHNvcnRhYmxlKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChzb3J0YWJsZS5vcHRpb25zLm1heGltdW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHNvcnRhYmxlLl9nZXRDaGlsZHJlbigpXHJcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiBzb3J0YWJsZS5vcHRpb25zLm1heGltdW0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVQZW5kaW5nID0gc29ydGFibGUucmVtb3ZlUGVuZGluZyA/IHNvcnRhYmxlLnJlbW92ZVBlbmRpbmcuc2xpY2UoMCkgOiBbXVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xlYXJNYXhpbXVtUGVuZGluZyhzb3J0YWJsZSlcclxuICAgICAgICAgICAgICAgIHNvcnRhYmxlLnJlbW92ZVBlbmRpbmcgPSBbXVxyXG4gICAgICAgICAgICAgICAgbGV0IHNvcnRcclxuICAgICAgICAgICAgICAgIGlmIChzb3J0YWJsZS5vcHRpb25zLm1heGltdW1GSUZPKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnQgPSBjaGlsZHJlbi5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhID09PSBlbGVtZW50ID8gMSA6IGEuX19zb3J0YWJsZS5tYXhpbXVtIC0gYi5fX3NvcnRhYmxlLm1heGltdW0gfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzb3J0ID0gY2hpbGRyZW4uc29ydCgoYSwgYikgPT4geyByZXR1cm4gYSA9PT0gZWxlbWVudCA/IDEgOiBiLl9fc29ydGFibGUubWF4aW11bSAtIGEuX19zb3J0YWJsZS5tYXhpbXVtIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aCAtIHNvcnRhYmxlLm9wdGlvbnMubWF4aW11bTsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhpZGUgPSBzb3J0W2ldXHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZS5fX3NvcnRhYmxlLmRpc3BsYXkgPSBoaWRlLnN0eWxlLmRpc3BsYXkgfHwgJ3Vuc2V0J1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlLnJlbW92ZVBlbmRpbmcucHVzaChoaWRlKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzYXZlUGVuZGluZy5pbmRleE9mKGhpZGUpID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlLmVtaXQoJ21heGltdW0tcmVtb3ZlLXBlbmRpbmcnLCBoaWRlLCBzb3J0YWJsZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjaGFuZ2UgY3Vyc29yIGR1cmluZyBtb3VzZWRvd25cclxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX21vdXNlRG93bihlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3Vyc29ySG92ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB1dGlscy5zdHlsZShlLmN1cnJlbnRUYXJnZXQsICdjdXJzb3InLCB0aGlzLm9wdGlvbnMuY3Vyc29yRG93bilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjaGFuZ2UgY3Vyc29yIGR1cmluZyBtb3VzZXVwXHJcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9tb3VzZVVwKGUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdjbGlja2VkJywgZS5jdXJyZW50VGFyZ2V0LCB0aGlzKVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3Vyc29ySG92ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB1dGlscy5zdHlsZShlLmN1cnJlbnRUYXJnZXQsICdjdXJzb3InLCB0aGlzLm9wdGlvbnMuY3Vyc29ySG92ZXIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogZmlyZXMgd2hlbiBhbiBlbGVtZW50IGlzIHBpY2tlZCB1cCBiZWNhdXNlIGl0IHdhcyBtb3ZlZCBiZXlvbmQgdGhlIG9wdGlvbnMudGhyZXNob2xkXHJcbiAqIEBldmVudCBTb3J0YWJsZSNwaWNrdXBcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudCBiZWluZyBkcmFnZ2VkXHJcbiAqIEBwcm9wZXJ0eSB7U29ydGFibGV9IGN1cnJlbnQgc29ydGFibGUgd2l0aCBlbGVtZW50IHBsYWNlaG9sZGVyXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIGZpcmVzIHdoZW4gYSBzb3J0YWJsZSBpcyByZW9yZGVyZWRcclxuICogQGV2ZW50IFNvcnRhYmxlI29yZGVyXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgdGhhdCB3YXMgcmVvcmRlcmVkXHJcbiAqIEBwcm9wZXJ0eSB7U29ydGFibGV9IHNvcnRhYmxlIHdoZXJlIGVsZW1lbnQgd2FzIHBsYWNlZFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBmaXJlcyB3aGVuIGFuIGVsZW1lbnQgaXMgYWRkZWQgdG8gdGhpcyBzb3J0YWJsZVxyXG4gKiBAZXZlbnQgU29ydGFibGUjYWRkXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgYWRkZWRcclxuICogQHByb3BlcnR5IHtTb3J0YWJsZX0gc29ydGFibGUgd2hlcmUgZWxlbWVudCB3YXMgYWRkZWRcclxuICovXHJcblxyXG4vKipcclxuICogZmlyZXMgd2hlbiBhbiBlbGVtZW50IGlzIHJlbW92ZWQgZnJvbSB0aGlzIHNvcnRhYmxlXHJcbiAqIEBldmVudCBTb3J0YWJsZSNyZW1vdmVcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudCByZW1vdmVkXHJcbiAqIEBwcm9wZXJ0eSB7U29ydGFibGV9IHNvcnRhYmxlIHdoZXJlIGVsZW1lbnQgd2FzIHJlbW92ZWRcclxuICovXHJcblxyXG4vKipcclxuICogZmlyZXMgd2hlbiBhbiBlbGVtZW50IGlzIHJlbW92ZWQgZnJvbSBhbGwgc29ydGFibGVzXHJcbiAqIEBldmVudCBTb3J0YWJsZSNkZWxldGVcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudCByZW1vdmVkXHJcbiAqIEBwcm9wZXJ0eSB7U29ydGFibGV9IHNvcnRhYmxlIHdoZXJlIGVsZW1lbnQgd2FzIGRyYWdnZWQgZnJvbVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBmaXJlcyB3aGVuIGEgY29weSBvZiBhbiBlbGVtZW50IGlzIGRyb3BwZWRcclxuICogQGV2ZW50IFNvcnRhYmxlI2NvcHlcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudCByZW1vdmVkXHJcbiAqIEBwcm9wZXJ0eSB7U29ydGFibGV9IHNvcnRhYmxlIHdoZXJlIGVsZW1lbnQgd2FzIGRyYWdnZWQgZnJvbVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBmaXJlcyB3aGVuIHRoZSBzb3J0YWJsZSBpcyB1cGRhdGVkIHdpdGggYW4gYWRkLCByZW1vdmUsIG9yIG9yZGVyIGNoYW5nZVxyXG4gKiBAZXZlbnQgU29ydGFibGUjdXBkYXRlXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgY2hhbmdlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBzb3J0YWJsZSB3aXRoIGVsZW1lbnRcclxuICovXHJcblxyXG4vKipcclxuICogZmlyZXMgd2hlbiBhbiBlbGVtZW50IGlzIHJlbW92ZWQgYmVjYXVzZSBtYXhpbXVtIHdhcyByZWFjaGVkIGZvciB0aGUgc29ydGFibGVcclxuICogQGV2ZW50IFNvcnRhYmxlI21heGltdW0tcmVtb3ZlXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgcmVtb3ZlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBzb3J0YWJsZSB3aGVyZSBlbGVtZW50IHdhcyBkcmFnZ2VkIGZyb21cclxuICovXHJcblxyXG4vKipcclxuICogZmlyZXMgd2hlbiBvcmRlciB3YXMgY2hhbmdlZCBidXQgZWxlbWVudCB3YXMgbm90IGRyb3BwZWQgeWV0XHJcbiAqIEBldmVudCBTb3J0YWJsZSNvcmRlci1wZW5kaW5nXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBjdXJyZW50IHNvcnRhYmxlIHdpdGggZWxlbWVudCBwbGFjZWhvbGRlclxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBmaXJlcyB3aGVuIGVsZW1lbnQgaXMgYWRkZWQgYnV0IG5vdCBkcm9wcGVkIHlldFxyXG4gKiBAZXZlbnQgU29ydGFibGUjYWRkLXBlbmRpbmdcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudCBiZWluZyBkcmFnZ2VkXHJcbiAqIEBwcm9wZXJ0eSB7U29ydGFibGV9IGN1cnJlbnQgc29ydGFibGUgd2l0aCBlbGVtZW50IHBsYWNlaG9sZGVyXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIGZpcmVzIHdoZW4gZWxlbWVudCBpcyByZW1vdmVkIGJ1dCBub3QgZHJvcHBlZCB5ZXRcclxuICogQGV2ZW50IFNvcnRhYmxlI3JlbW92ZS1wZW5kaW5nXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBjdXJyZW50IHNvcnRhYmxlIHdpdGggZWxlbWVudCBwbGFjZWhvbGRlclxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBmaXJlcyB3aGVuIGVsZW1lbnQgaXMgcmVtb3ZlZCBhZnRlciBiZWluZyB0ZW1wb3JhcmlseSBhZGRlZFxyXG4gKiBAZXZlbnQgU29ydGFibGUjYWRkLXJlbW92ZS1wZW5kaW5nXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBjdXJyZW50IHNvcnRhYmxlIHdpdGggZWxlbWVudCBwbGFjZWhvbGRlclxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBmaXJlcyB3aGVuIGFuIGVsZW1lbnQgaXMgYWJvdXQgdG8gYmUgcmVtb3ZlZCBmcm9tIGFsbCBzb3J0YWJsZXNcclxuICogQGV2ZW50IFNvcnRhYmxlI2RlbGV0ZS1wZW5kaW5nXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgcmVtb3ZlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBzb3J0YWJsZSB3aGVyZSBlbGVtZW50IHdhcyBkcmFnZ2VkIGZyb21cclxuICovXHJcblxyXG4vKipcclxuICogZmlyZXMgd2hlbiBhbiBlbGVtZW50IGlzIGFkZGVkLCByZW1vdmVkLCBvciByZW9yZGVyIGJ1dCBlbGVtZW50IGhhcyBub3QgZHJvcHBlZCB5ZXRcclxuICogQGV2ZW50IFNvcnRhYmxlI3VwZGF0ZS1wZW5kaW5nXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBjdXJyZW50IHNvcnRhYmxlIHdpdGggZWxlbWVudCBwbGFjZWhvbGRlclxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBmaXJlcyB3aGVuIGEgY29weSBvZiBhbiBlbGVtZW50IGlzIGFib3V0IHRvIGRyb3BcclxuICogQGV2ZW50IFNvcnRhYmxlI2NvcHktcGVuZGluZ1xyXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50IHJlbW92ZWRcclxuICogQHByb3BlcnR5IHtTb3J0YWJsZX0gc29ydGFibGUgd2hlcmUgZWxlbWVudCB3YXMgZHJhZ2dlZCBmcm9tXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIGZpcmVzIHdoZW4gYW4gZWxlbWVudCBpcyBhYm91dCB0byBiZSByZW1vdmVkIGJlY2F1c2UgbWF4aW11bSB3YXMgcmVhY2hlZCBmb3IgdGhlIHNvcnRhYmxlXHJcbiAqIEBldmVudCBTb3J0YWJsZSNtYXhpbXVtLXJlbW92ZS1wZW5kaW5nXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgcmVtb3ZlZFxyXG4gKiBAcHJvcGVydHkge1NvcnRhYmxlfSBzb3J0YWJsZSB3aGVyZSBlbGVtZW50IHdhcyBkcmFnZ2VkIGZyb21cclxuICovXHJcblxyXG4vKipcclxuICogZmlyZXMgd2hlbiBhbiBlbGVtZW50IGlzIGNsaWNrZWQgd2l0aG91dCBkcmFnZ2luZ1xyXG4gKiBAZXZlbnQgU29ydGFibGUjY2xpY2tlZFxyXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50IGNsaWNrZWRcclxuICogQHByb3BlcnR5IHtTb3J0YWJsZX0gc29ydGFibGUgd2hlcmUgZWxlbWVudCBpcyBhIGNoaWxkXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb3J0YWJsZSJdfQ==