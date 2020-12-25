import Events from 'eventemitter3'
import clicked from 'clicked'

import { defaults } from './defaults'
import * as utils from './utils'
import { icons } from './icons'

export class Tree extends Events {
    /**
     * Create Tree
     * @param {(HTMLElement|string)} element - if a string is provided, it calls document.querySelector(element)
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
    constructor(element, tree, options) {
        super()
        this._options = utils.options(options, defaults)
        if (typeof element === 'string') {
            /**
             * Main div holding tree
             * @type {HTMLElement}
             */
            this.element = document.querySelector(element)
        } else {
            this.element = element
        }
        this.element[this._options.data] = tree
        document.body.addEventListener('mousemove', (e) => this._move(e))
        document.body.addEventListener('touchmove', (e) => this._move(e))
        document.body.addEventListener('mouseup', (e) => this._up(e))
        document.body.addEventListener('touchend', (e) => this._up(e))
        document.body.addEventListener('mouseleave', (e) => this._up(e))
        this._createIndicator()
        this.update()
    }

    /**
     * whether tree may be rearranged
     * @type {boolean}
     */
    get move() {
        return this._options.move
    }
    set move(value) {
        this._options.move = value
    }

    _createIndicator() {
        this._indicator = utils.html()
        const content = utils.html({ parent: this._indicator, styles: { display: 'flex' } })
        this._indicator.indentation = utils.html({ parent: content })
        this._indicator.icon = utils.html({ parent: content, defaultStyles: this._options.expandStyles, styles: { height: 0 } })
        this._indicator.line = utils.html({
            parent: content,
            styles: this._options.indicatorStyles
        })
    }

    leaf(data, level) {
        const leaf = utils.html()
        leaf.isLeaf = true
        leaf[this._options.data] = data
        leaf.content = utils.html({ parent: leaf, styles: { display: 'flex', alignItems: 'center' } })
        leaf.indentation = utils.html({ parent: leaf.content, styles: { width: level * this._options.indentation + 'px' } })
        leaf.icon = utils.html({ parent: leaf.content, html: data[this._options.expanded] ? icons.open : icons.closed, styles: this._options.expandStyles })
        leaf.name = utils.html({ parent: leaf.content, html: data[this._options.name], styles: this._options.nameStyles })

        leaf.name.addEventListener('mousedown', (e) => this._down(e))
        leaf.name.addEventListener('touchstart', (e) => this._down(e))
        for (let child of data[this._options.children]) {
            const add = this.leaf(child, level + 1)
            add[this._options.data].parent = data
            leaf.appendChild(add)
            if (!data[this._options.expanded]) {
                add.style.display = 'none'
            }
        }
        if (this._getChildren(leaf, true).length === 0) {
            this._hideIcon(leaf)
        }
        clicked(leaf.icon, () => this.toggleExpand(leaf))
        this.emit('render', leaf, this)
        return leaf
    }

    _getChildren(leaf, all) {
        leaf = leaf || this.element
        const children = []
        for (let child of leaf.children) {
            if (child.isLeaf && (all || child.style.display !== 'none')) {
                children.push(child)
            }
        }
        return children
    }

    _hideIcon(leaf) {
        if (leaf.isLeaf) {
            leaf.icon.style.opacity = 0
            leaf.icon.style.cursor = 'unset'
        }
    }

    _showIcon(leaf) {
        if (leaf.isLeaf) {
            leaf.icon.style.opacity = 1
            leaf.icon.style.cursor = this._options.expandStyles.cursor
        }
    }

    /** Expands all leaves */
    expandAll() {
        this._expandChildren(this.element)
    }

    _expandChildren(leaf) {
        for (let child of this._getChildren(leaf, true)) {
            this.expand(child)
            this._expandChildren(child)
        }
    }

    /** Collapses all leaves */
    collapseAll() {
        this._collapseChildren(this)
    }

    _collapseChildren(leaf) {
        for (let child of this._getChildren(leaf, true)) {
            this.collapse(child)
            this._collapseChildren(child)
        }
    }

    /**
     * Toggles a leaf
     * @param {HTMLElement} leaf
     */
    toggleExpand(leaf) {
        if (leaf.icon.style.opacity !== '0') {
            if (leaf[this._options.data][this._options.expanded]) {
                this.collapse(leaf)
            } else {
                this.expand(leaf)
            }
        }
    }

    /**
     * Expands a leaf
     * @param {HTMLElement} leaf
     */
    expand(leaf) {
        if (leaf.isLeaf) {
            const children = this._getChildren(leaf, true)
            if (children.length) {
                for (let child of children) {
                    child.style.display = 'block'
                }
                leaf[this._options.data][this._options.expanded] = true
                leaf.icon.innerHTML = icons.open
                this.emit('expand', leaf, this)
                this.emit('update', leaf, this)
            }
        }
    }

    /**
     * Collapses a leaf
     * @param {HTMLElement} leaf
     */
    collapse(leaf) {
        if (leaf.isLeaf) {
            const children = this._getChildren(leaf, true)
            if (children.length) {
                for (let child of children) {
                    child.style.display = 'none'
                }
                leaf[this._options.data][this._options.expanded] = false
                leaf.icon.innerHTML = icons.closed
                this.emit('collapse', leaf, this)
                this.emit('update', leaf, this)
            }
        }
    }

    /**
     * call this after tree's data has been updated outside of this library
     */
    update() {
        const scroll = this.element.scrollTop
        utils.removeChildren(this.element)
        for (let leaf of this.element[this._options.data][this._options.children]) {
            const add = this.leaf(leaf, 0)
            add[this._options.data].parent = this.element[this._options.data]
            this.element.appendChild(add)
        }
        this.element.scrollTop = scroll + 'px'
    }

    _down(e) {
        this._target = e.currentTarget.parentNode.parentNode
        this._isDown = { x: e.pageX, y: e.pageY }
        const pos = utils.toGlobal(this._target)
        this._offset = { x: e.pageX - pos.x, y: e.pageY - pos.y }
        if (this._options.holdTime) {
            this._holdTimeout = window.setTimeout(() => this._hold(), this._options.holdTime)
        }
        e.preventDefault()
        e.stopPropagation()
    }

    _hold() {
        this._holdTimeout = null
        this.edit(this._target)
    }

    /**
     * edit the name entry using the data
     * @param {object} data element of leaf
     */
    editData(data) {
        const children = this._getChildren(null, true)
        for (let child of children) {
            if (child.data === data) {
                this.edit(child)
            }
        }
    }

    /**
     * edit the name entry using the created element
     * @param {HTMLElement} leaf
     */
    edit(leaf) {
        this._editing = leaf
        this._input = utils.html({ parent: this._editing.name.parentNode, type: 'input', styles: this._options.nameStyles })
        const computed = window.getComputedStyle(this._editing.name)
        this._input.style.boxSizing = 'content-box'
        this._input.style.fontFamily = computed.getPropertyValue('font-family')
        this._input.style.fontSize = computed.getPropertyValue('font-size')
        this._input.value = this._editing.name.innerText
        this._input.setSelectionRange(0, this._input.value.length)
        this._input.focus()
        this._input.addEventListener('update', () => {
            this.nameChange(this._editing, this._input.value)
            this._holdClose()
        })
        this._input.addEventListener('keyup', (e) => {
            if (e.code === 'Escape') {
                this._holdClose()
            }
            if (e.code === 'Enter') {
                this.nameChange(this._editing, this._input.value)
                this._holdClose()
            }
        })
        this._editing.name.style.display = 'none'
        this._target = null
    }

    _holdClose() {
        if (this._editing) {
            this._input.remove()
            this._editing.name.style.display = 'block'
            this._editing = this._input = null
        }
    }

    nameChange(leaf, name) {
        leaf[this._options.data].name = this._input.value
        leaf.name.innerHTML = name
        this.emit('name-change', leaf, this._input.value, this)
        this.emit('update', leaf, this)
    }

    _setIndicator() {
        let level = 0
        let traverse = this._indicator.parentNode
        while (traverse !== this.element) {
            level++
            traverse = traverse.parentNode
        }
        this._indicator.indentation.style.width = level * this._options.indentation + 'px'
    }

    _pickup() {
        if (this._holdTimeout) {
            window.clearTimeout(this._holdTimeout)
            this._holdTimeout = null
        }
        this.emit('move-pending', this._target, this)
        const parent = this._target.parentNode
        parent.insertBefore(this._indicator, this._target)
        this._setIndicator()
        const pos = utils.toGlobal(this._target)
        document.body.appendChild(this._target)
        this._old = {
            opacity: this._target.style.opacity || 'unset',
            position: this._target.style.position || 'unset',
            boxShadow: this._target.name.style.boxShadow || 'unset'
        }
        this._target.style.position = 'absolute'
        this._target.name.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.25)'
        this._target.style.left = pos.x + 'px'
        this._target.style.top = pos.y + 'px'
        this._target.style.opacity = this._options.dragOpacity
        if (this._getChildren(parent, true).length === 0) {
            this._hideIcon(parent)
        }
    }

    _checkThreshold(e) {
        if (!this._options.move) {
            return false
        } else if (this._moving) {
            return true
        } else {
            if (utils.distance(this._isDown.x, this._isDown.y, e.pageX, e.pageY)) {
                this._moving = true
                this._pickup()
                return true
            } else {
                return false
            }
        }
    }

    _findClosest(e, entry) {
        const pos = utils.toGlobal(entry.name)
        if (pos.y + entry.name.offsetHeight / 2 <= e.pageY) {
            if (!this._closest.foundAbove) {
                if (utils.inside(e.pageX, e.pageY, entry.name)) {
                    this._closest.foundAbove = true
                    this._closest.above = entry
                } else {
                    const distance = utils.distancePointElement(e.pageX, e.pageY, entry.name)
                    if (distance < this._closest.distanceAbove) {
                        this._closest.distanceAbove = distance
                        this._closest.above = entry
                    }
                }
            }
        } else if (!this._closest.foundBelow) {
            if (utils.inside(e.pageX, e.pageY, entry.name)) {
                this._closest.foundBelow = true
                this._closest.below = entry
            } else {
                const distance = utils.distancePointElement(e.pageX, e.pageY, entry.name)
                if (distance < this._closest.distanceBelow) {
                    this._closest.distanceBelow = distance
                    this._closest.below = entry
                }
            }
        }
        for (let child of this._getChildren(entry)) {
            this._findClosest(e, child)
        }
    }

    _getFirstChild(element, all) {
        const children = this._getChildren(element, all)
        if (children.length) {
            return children[0]
        }
    }

    _getLastChild(element, all) {
        const children = this._getChildren(element, all)
        if (children.length) {
            return children[children.length - 1]
        }
    }

    _getParent(element) {
        element = element.parentNode
        while (element.style.display === 'none') {
            element = element.parentNode
        }
        return element
    }

    _move(e) {
        if (this._target && this._checkThreshold(e)) {
            this._indicator.remove()
            this._target.style.left = e.pageX - this._offset.x + 'px'
            this._target.style.top = e.pageY - this._offset.y + 'px'
            const x = utils.toGlobal(this._target.name).x
            this._closest = { distanceAbove: Infinity, distanceBelow: Infinity }
            for (let child of this._getChildren()) {
                this._findClosest(e, child)
            }
            if (!this._closest.above && !this._closest.below) {
                this.element.appendChild(this._indicator)
            } else if (!this._closest.above)  {
                // null [] leaf
                this.element.insertBefore(this._indicator, this._getFirstChild(this.element))
            } else if (!this._closest.below) {
                // leaf [] null
                let pos = utils.toGlobal(this._closest.above.name)
                if (x > pos.x + this._options.indentation) {
                    this._closest.above.insertBefore(this._indicator, this._getFirstChild(this._closest.above, true))
                } else if (x > pos.x - this._options.indentation) {
                    this._closest.above.parentNode.appendChild(this._indicator)
                } else {
                    let parent = this._closest.above
                    while (parent !== this.element && x < pos.x) {
                        parent = this._getParent(parent)
                        if (parent !== this.element) {
                            pos = utils.toGlobal(parent.name)
                        }
                    }
                    parent.appendChild(this._indicator)
                }
            } else if (this._closest.below.parentNode === this._closest.above) {
                // parent [] child
                this._closest.above.insertBefore(this._indicator, this._closest.below)
            } else if (this._closest.below.parentNode === this._closest.above.parentNode) {
                // sibling [] sibling
                const pos = utils.toGlobal(this._closest.above.name)
                if (x > pos.x + this._options.indentation) {
                    this._closest.above.insertBefore(this._indicator, this._getLastChild(this._closest.above, true))
                } else {
                    this._closest.above.parentNode.insertBefore(this._indicator, this._closest.below)
                }
            } else {
                // child [] parent^
                let pos = utils.toGlobal(this._closest.above.name)
                if (x > pos.x + this._options.indentation) {
                    this._closest.above.insertBefore(this._indicator, this._getLastChild(this._closest.above, true))
                } else if (x > pos.x - this._options.indentation) {
                    this._closest.above.parentNode.appendChild(this._indicator)
                } else if (x < utils.toGlobal(this._closest.below.name).x) {
                    this._closest.below.parentNode.insertBefore(this._indicator, this._closest.below)
                } else {
                    let parent = this._closest.above
                    while (parent.parentNode !== this._closest.below.parentNode && x < pos.x) {
                        parent = this._getParent(parent)
                        pos = utils.toGlobal(parent.name)
                    }
                    parent.appendChild(this._indicator)
                }
            }
            this._setIndicator()
        }
    }

    _up(e) {
        if (this._target) {
            if (!this._moving) {
                if (this._options.expandOnClick) {
                    this.toggleExpand(this._target)
                }
                this.emit('clicked', this._target, e, this)
            } else {
                this._indicator.parentNode.insertBefore(this._target, this._indicator)
                this.expand(this._indicator.parentNode)
                this._showIcon(this._indicator.parentNode)
                this._target.style.position = this._old.position === 'unset' ? '' : this._old.position
                this._target.name.style.boxShadow = this._old.boxShadow === 'unset' ? '' : this._old.boxShadow
                this._target.style.opacity = this._old.opacity === 'unset' ? '' : this._old.opacity
                this._target.indentation.style.width = this._indicator.indentation.offsetWidth + 'px'
                this._indicator.remove()
                this._moveData()
                this.emit('move', this._target, this)
                this.emit('update', this._target, this)
            }
            if (this._holdTimeout) {
                window.clearTimeout(this._holdTimeout)
                this._holdTimeout = null
            }
            this._target = this._moving = null
        }
    }

    _moveData() {
        this._target[this._options.data].parent.children.splice(this._target[this._options.data].parent.children.indexOf(this._target[this._options.data]), 1)
        this._target.parentNode[this._options.data].children.splice(utils.getChildIndex(this._target.parentNode, this._target), 0, this._target[this._options.data])
        this._target[this._options.data].parent = this._target.parentNode[this._options.data]
    }
}

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