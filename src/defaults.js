/**
 * Options for Tree
 * @typedef {object} Tree~TreeOptions
 * @property {string} [TreeOptions.children=children] name of tree parameter containing the children
 * @property {string} [TreeOptions.parent=parent] name of tree parameter containing the parent link
 * @property {number} [TreeOptions.name=name] name of tree parameter containing the text for a leaf
 * @property {number} [TreeOptions.expanded=expanded] name of tree parameter containing whether the leaf is expanded
 * @property {number} [TreeOptions.indentation=10] number of pixels to indent for each level
 * @property {number} [TreeOptions.nameStyles]
 * @property {number} [TreeOptions.threshold=10] number of pixels to move to start a drag
 * @property {boolean} [options.expandOnClick=true] expand and collapse node on click without drag
 * @property {string[]} [TreeOptions.indicatorStyles]
 */
module.exports = {
    children: 'children',
    parent: 'parent',
    name: 'name',
    expanded: 'expanded',
    indentation: 15,
    nameStyles: {
        padding: '0.5em 1em',
        margin: '0.1em',
        background: 'rgba(230,230,230)',
        userSelect: 'none',
        cursor: ['grab', '-webkit-grab', 'pointer'],
        width: '100px'
    },
    threshold: 10,
    indicatorStyles: {
        background: 'rgb(150,150,255)',
        height: '5px',
        paddingTop: 0,
        paddingBottom: 0
    },
    expandStyles: {
        width: '15px',
        height: '15px',
        cursor: 'pointer'
    },
    holdTime: 1000,
    expandOnClick: true
}