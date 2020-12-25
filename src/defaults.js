export const defaults = {
    children: 'children',
    parent: 'parent',
    name: 'name',
    data: 'data',
    expanded: 'expanded',
    move: true,
    indentation: 20,
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
        width: '100px',
        padding: '0 1em'
    },
    expandStyles: {
        width: '15px',
        height: '15px',
        cursor: 'pointer'
    },
    holdTime: 1000,
    expandOnClick: true,
    dragOpacity: 0.75
}