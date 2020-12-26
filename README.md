# tree
Vanilla drag-and-drop UI tree

## Rationale
I needed a tree components for my tools. Most of the available visual tree APIs require vue or react. And so yy-tree was created.

## Super Simple Example
```js
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

const tree = new Tree(data, { parent: document.body })
```

## Live Examples
https://davidfig.github.io/tree/

## API Documentation
https://davidfig.github.io/tree/jsdoc/

## Installation

    npm i yy-tree

## license
MIT License
(c) 2021 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
