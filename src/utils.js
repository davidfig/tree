/**
 * measure distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function distance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

/**
 * find closest distance from UIEvent to a corner of an element
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} element
 */
function distanceToClosestCorner(x, y, element)
{
    const pos = toGlobal(element)
    const topLeft = distance(x, y, pos.x, pos.y)
    const topRight = distance(x, y, pos.x + element.offsetWidth, pos.y)
    const bottomLeft = distance(x, y, pos.x, pos.y + element.offsetHeight)
    const bottomRight = distance(x, y, pos.x + element.offsetWidth, pos.y + element.offsetHeight)
    return Math.min(topLeft, topRight, bottomLeft, bottomRight)
}


/**
 * determine whether the mouse is inside an element
 * @param {HTMLElement} dragging
 * @param {HTMLElement} element
 */
function inside(x, y, element)
{
    const pos = toGlobal(element)
    const x1 = pos.x
    const y1 = pos.y
    const w1 = element.offsetWidth
    const h1 = element.offsetHeight
    return x >= x1 && x <= x1 + w1 && y >= y1 && y <= y1 + h1}

/**
 * determines global location of a div
 * from https://stackoverflow.com/a/26230989/1955997
 * @param {HTMLElement} e
 * @returns {PointLike}
 */
function toGlobal(e)
{
    const box = e.getBoundingClientRect()

    const body = document.body
    const docEl = document.documentElement

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

    const clientTop = docEl.clientTop || body.clientTop || 0
    const clientLeft = docEl.clientLeft || body.clientLeft || 0

    const top = box.top + scrollTop - clientTop
    const left = box.left + scrollLeft - clientLeft

    return { y: Math.round(top), x: Math.round(left) }
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
function options(options, defaults)
{
    options = options || {}
    for (let option in defaults)
    {
        options[option] = typeof options[option] !== 'undefined' ? options[option] : defaults[option]
    }
    return options
}

/**
 * set a style on an element
 * @param {HTMLElement} element
 * @param {string} style
 * @param {(string|string[])} value - single value or list of possible values (test each one in order to see if it works)
 */
function style(element, style, value)
{
    if (Array.isArray(value))
    {
        for (let entry of value)
        {
            element.style[style] = entry
            if (element.style[style] === entry)
            {
                break
            }
        }
    }
    else
    {
        element.style[style] = value
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
function percentage(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2)
{
    const sa = (xa2 - xa1) * (ya2 - ya1)
    const sb = (xb2 - xb1) * (yb2 - yb1)
    const si = Math.max(0, Math.min(xa2, xb2) - Math.max(xa1, xb1)) * Math.max(0, Math.min(ya2, yb2) - Math.max(ya1, yb1))
    const union = sa + sb - si
    if (union !== 0)
    {
        return si / union
    }
    else
    {
        return 0
    }
}

function removeChildren(element)
{
    while (element.firstChild)
    {
        element.firstChild.remove()
    }
}

function html(options)
{
    options = options || {}
    const object = document.createElement(options.type || 'div')
    if (options.parent)
    {
        options.parent.appendChild(object)
    }
    if (options.defaultStyles)
    {
        styles(object, options.defaultStyles)
    }
    if (options.styles)
    {
        styles(object, options.styles)
    }
    if (options.html)
    {
        object.innerHTML = options.html
    }
    if (options.id)
    {
        object.id = options.id
    }
    return object
}

function styles(object, styles)
{
    for (let style in styles)
    {
        if (Array.isArray(styles[style]))
        {
            for (let entry of styles[style])
            {
                object.style[style] = entry
                if (object.style[style] === entry)
                {
                    break
                }
            }
        }
        else
        {
            object.style[style] = styles[style]
        }
    }
}

module.exports = {
    removeChildren,
    distance,
    distanceToClosestCorner,
    inside,
    toGlobal,
    options,
    style,
    percentage,
    html,
    styles
}