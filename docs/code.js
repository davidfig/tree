const Highlight = require('./highlight')
const Tree = require('../src/tree')
const utils = require('../src/utils')

const data = {
    children: [
        { name: 'fruits', children: [
            { name: 'apples', children: [] },
            { name: 'oranges', children: [
                { name: 'tangerines', children: [] },
                { name: 'mandarins', children: [] },
                { name: 'pomelo', children: [] },
                { name: 'blood orange', children: [] },
            ] }
        ]},
        { name: 'vegetables', children: [
            { name: 'brocolli', children: [] },
        ] },
    ]
}

function test()
{
    const div = utils.html({ parent: document.body })
    const tree = new Tree(div, data)
    tree.expandAll()
}

window.onload = function ()
{
    test()
    Highlight()
}