import forkMe from 'fork-me-github'

import { Tree } from '../src/tree'

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
    const tree = new Tree(data, { parent: document.body })
    tree.expandAll()
}

window.onload = function () {
    test()
    forkMe('https://github.com/davidfig/tree')
}