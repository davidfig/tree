import Events from 'eventemitter3'
import clicked from 'clicked'

import { defaults, styleDefaults } from './defaults'
import * as utils from './utils'
import { icons } from './icons'

export class Tree extends Events {
    /**
     * Create Tree
     * @param {(HTMLElement|string)} element - if a string is provided, it calls document.querySelector(element)
     * @param {TreeData} tree - data for tree (see readme for description)
     * @param {TreeOptions} [options]
     * @param {boolean} [options.move=true] drag tree to rearrange
     * @param {boolean} [options.select=true] click to select node
     * @param {number} [options.indentation=20] number of pixels to indent for each level
     * @param {number} [options.threshold=10] number of pixels to move to start a drag
     * @param {number} [options.holdTime=2000] number of milliseconds before name can be edited (set to 0 to disable)
     * @param {boolean} [options.expandOnClick=true] expand and collapse node on click without drag except (will select before expanding if select=true)
     * @param {number} [options.dragOpacity=0.75] opacity setting for dragged item
     * @param {string} [options.classBaseName=yy-tree] first part of className for all DOM objects (e.g., yy-tree, yy-tree-indicator)
     * @param {boolean} [options.addStyles=true] attaches a style sheet with default and overridden styles; set to false to use your own stylesheet
     * @param {object} [styles]
     * @param {string[]} [styles.nameStyles] use these to override individual styles for the name (will be included in the attached stylesheet)
     * @param {string[]} [styles.contentStyles] use these to override individual styles for the content (will be included in the attached stylesheet)
     * @param {string[]} [styles.indicatorStyles] use these to override individual styles for the move-line indicator (will be included in the attached stylesheet)
     * @param {string[]} [styles.selectedStyles] use these to override individual styles for the selected item (will be included in the attached stylesheet)
     * @fires render
     * @fires clicked
     * @fires expand
     * @fires collapse
     * @fires name-change
     * @fires move
     * @fires move-pending
     * @fires update
     */
    constructor(element, tree, options, styles) {
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
        this.element.classList.add(this.classBaseName)
        this.element.data = tree
        document.body.addEventListener('mousemove', (e) => this._move(e))
        document.body.addEventListener('touchmove', (e) => this._move(e))
        document.body.addEventListener('mouseup', (e) => this._up(e))
        document.body.addEventListener('touchend', (e) => this._up(e))
        document.body.addEventListener('mouseleave', (e) => this._up(e))
        this._createIndicator()
        if (this._options.addStyles !== false) {
            this._addStyles(styles)
        }
        this.update()
    }

    /**
     * className's prefix (e.g., "yy-tree"-content)
     * @type {string}
     */
    get classBaseName() {
        return this._options.classBaseName
    }
    set classBaseName(value) {
        if (value !== this._options.classBaseName) {
            this._options.classBaseName = value
            this.update()
        }
    }

    /**
     * indentation for tree
     * @type {number}
     */
    get indentation() {
        return this._options.indentation
    }
    set indentation(value) {
        if (value !== this._options.indentation) {
            this._options.indentation = value
            this._indicator.style.marginLeft = value + 'px'
            this.update()
        }
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

    _leaf(data, level) {
        const leaf = utils.html({ className: `${this.classBaseName}-leaf` })
        leaf.isLeaf = true
        leaf.data = data
        leaf.content = utils.html({ parent: leaf, className: `${this.classBaseName}-content` })
        leaf.style.marginLeft = this.indentation + 'px'
        leaf.icon = utils.html({
            parent: leaf.content,
            html: data.expanded ? icons.open : icons.closed,
            className: `${this.classBaseName}-expand`
        })
        leaf.name = utils.html({ parent: leaf.content, html: data.name, className: `${this.classBaseName}-name` })
        leaf.name.addEventListener('mousedown', (e) => this._down(e))
        leaf.name.addEventListener('touchstart', (e) => this._down(e))
        for (let child of data.children) {
            const add = this._leaf(child, level + 1)
            add.data.parent = data
            leaf.appendChild(add)
            if (!data.expanded) {
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

    _createIndicator() {
        this._indicator = utils.html()
        this._indicator.style.marginLeft = this.indentation + 'px'
        const content = utils.html({ parent: this._indicator })
        content.style.display = 'flex'
        this._indicator.indentation = utils.html({ parent: content })
        this._indicator.icon = utils.html({ parent: content, className: `${this.classBaseName}-expand` })
        this._indicator.icon.style.height = 0
        this._indicator.line = utils.html({ parent: content, className: `${this.classBaseName}-indicator` })
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
            leaf.icon.style.cursor = this._options.cursorExpand
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
            if (leaf.data.expanded) {
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
                leaf.data.expanded = true
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
                leaf.data.expanded = false
                leaf.icon.innerHTML = icons.closed
                this.emit('collapse', leaf, this)
                this.emit('update', leaf, this)
            }
        }
    }

    /** call this after tree's data has been updated outside of this library */
    update() {
        const scroll = this.element.scrollTop
        utils.removeChildren(this.element)
        for (let leaf of this.element.data.children) {
            const add = this._leaf(leaf, 0)
            add.data.parent = this.element.data
            this.element.appendChild(add)
        }
        this.element.scrollTop = scroll + 'px'
    }

    _down(e) {
        this._target = e.currentTarget.parentNode.parentNode
        let alreadySelected
        if (this.selection === this._target) {
            alreadySelected = true
        } else {
            if (this.selection) {
                this.selection.name.classList.remove(`${this.classBaseName}-select`)
            }
            this.selection = this._target
            this.selection.name.classList.add(`${this.classBaseName}-select`)
        }
        this._isDown = { x: e.pageX, y: e.pageY, alreadySelected }
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
        this._input = utils.html({ parent: this._editing.name.parentNode, type: 'input', className: `${this.classBaseName}-name` })
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

    /**
     * change the name of a leaf
     * @param {HTMLElement} leaf
     * @param {string} name
     */
    nameChange(leaf, name) {
        leaf.data.name = this._input.value
        leaf.name.innerHTML = name
        this.emit('name-change', leaf, this._input.value, this)
        this.emit('update', leaf, this)
    }

    /**
     * Find a leaf based using its data
     * @param {object} leaf
     * @param {HTMLElement} [root=this.element]
     */
    getLeaf(leaf, root = this.element) {
        this.findInTree(root, data => data === leaf)
    }

    /**
     * call the callback function on each node; returns the node if callback === true
     * @param {function} callback
     */
    findInTree(leaf, callback) {
        for (const child of leaf.children) {
            if (callback(child)) {
                return child
            }
            const find = this.findInTree(child, callback)
            if (find) {
                return find
            }
        }
    }

    _pickup() {
        if (this._holdTimeout) {
            window.clearTimeout(this._holdTimeout)
            this._holdTimeout = null
        }
        this.emit('move-pending', this._target, this)
        const parent = this._target.parentNode
        parent.insertBefore(this._indicator, this._target)
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
                if (x > pos.x + this.indentation) {
                    this._closest.above.insertBefore(this._indicator, this._getFirstChild(this._closest.above, true))
                } else if (x > pos.x - this.indentation) {
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
                if (x > pos.x + this.indentation) {
                    this._closest.above.insertBefore(this._indicator, this._getLastChild(this._closest.above, true))
                } else {
                    this._closest.above.parentNode.insertBefore(this._indicator, this._closest.below)
                }
            } else {
                // child [] parent^
                let pos = utils.toGlobal(this._closest.above.name)
                if (x > pos.x + this.indentation) {
                    this._closest.above.insertBefore(this._indicator, this._getLastChild(this._closest.above, true))
                } else if (x > pos.x - this.indentation) {
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
        }
    }

    _up(e) {
        if (this._target) {
            if (!this._moving) {
                if (this._options.expandOnClick && (!this._options.select || this._isDown.alreadySelected)) {
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
        this._target.data.parent.children.splice(this._target.data.parent.children.indexOf(this._target.data), 1)
        this._target.parentNode.data.children.splice(utils.getChildIndex(this._target.parentNode, this._target), 0, this._target.data)
        this._target.data.parent = this._target.parentNode.data
    }

    _addStyles(userStyles) {
        const styles = utils.options(userStyles, styleDefaults)
        let s = `.${this.classBaseName}-name{`
        for (const key in styles.nameStyles) {
            s += `${key}:${styles.nameStyles[key]};`
        }
        s += `}.${this.classBaseName}-content{`
        for (const key in styles.contentStyles) {
            s += `${key}:${styles.contentStyles[key]};`
        }
        s += `}.${this.classBaseName}-indicator{`
        for (const key in styles.indicatorStyles) {
            s += `${key}:${styles.indicatorStyles[key]};`
        }
        s += `}.${this.classBaseName}-expand{`
        for (const key in styles.expandStyles) {
            s += `${key}:${styles.expandStyles[key]};`
        }
        s += `}.${this.classBaseName}-select{`
        for (const key in styles.selectStyles) {
            s += `${key}:${styles.selectStyles[key]};`
        }
        s + '}'
        const style = document.createElement('style')
        style.innerHTML = s
        document.head.appendChild(style)
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