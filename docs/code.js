import forkMe from 'fork-me-github'

import { Tree } from '../src/tree'
import * as utils from '../src/utils'

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

function test() {
    const div = utils.html({ parent: document.body })
    const tree = new Tree(div, data)
    tree.expandAll()
}

window.onload = function () {
    test()
    forkMe('https://github.com/davidfig/tree')
}