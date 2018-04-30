# yy-sortable
Vanilla drag-and-drop sortable list(s)

Features include:

* dragging and dropping between sortable and/or ordered lists (options.sort)
* three ways to handle dragging off lists:
  1. closest - find closest list
  2. cancel - return to original position before dragging
  3. delete - remove element from all lists
* lists that are copy-only or no-drop (options.copy and options.drop) 
* custom ghost image and icon support so dragging looks nicer and isn't limited by browser
* search descendents for a className when determining where to sort or how to order (options.deepSearch)
* limit the number of elements in a sortable (options.maximum)
* robust event system based on eventemitter3 (i.e., add, remove, order, update, delete, and -pending versions of these events)
* ordered lists may be reverse ordered and ordered by a data-? setting
* dynamically add elements
* uses built in drag and drop API

## Rationale
I tried many of the existing drag-and-drop libraries but could not find all the features I wanted in one neat package.

## Super Simple Example
```js
new Sortable(document.getElementById('sortme'))
```

## Examples Showing Features
[davidfig.github.io/sortable/](https://davidfig.github.io/sortable/)

## API Documentation
[davidfig.github.io/sortable/jsdoc/](https://davidfig.github.io/sortable/jsdoc/)

## Installation

    npm i yy-sortable

## Influences
I was greatly influenced by the design of [sortablejs](https://github.com/RubaXa/Sortable), which was *almost* perfect.

## license  
MIT License  
(c) 2018 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
