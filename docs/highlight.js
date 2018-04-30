const highlight = require('highlight.js')
const ForkMe = require('fork-me-github').default

// shows the code in the demo
module.exports = function()
{
    var client = new XMLHttpRequest()
    client.open('GET', 'code.js')
    client.onreadystatechange = function()
    {
        var code = document.getElementById('code')
        code.innerHTML = client.responseText
        highlight.highlightBlock(code)
    }
    client.send()
    ForkMe()
}