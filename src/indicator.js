import * as utils from './utils'

export class Indicator {
    constructor(tree) {
        this._indicator = utils.html()
        this._indicator.style.marginLeft = tree.indentation + 'px'
        const content = utils.html({ parent: this._indicator })
        content.style.display = 'flex'
        this._indicator.indentation = utils.html({ parent: content })
        this._indicator.icon = utils.html({ parent: content, className: `${tree.classBaseName}-expand` })
        this._indicator.icon.style.height = 0
        this._indicator.line = utils.html({ parent: content, className: `${tree.classBaseName}-indicator` })
    }

    get() {
        return this._indicator
    }

    set _marginLeft(value) {
        this._indicator.style.marginLeft = value + 'px'
    }
}