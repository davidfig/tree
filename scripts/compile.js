/* Copyright (c) 2020 YOPEY YOPEY LLC */

const { performance } = require('perf_hooks')
const fs = require('fs-extra')
const readLines = require('n-readlines')
const chokidar = require('chokidar')
const esbuild = require('esbuild').build
const express = require('express')
const WebSocket = require('ws')

const packageJSON = require('../package.json')

const port = 1234
const websocketPort = 1235
const linesToShow = 3

let _wss

function addZero(s) {
    if (s.length !== 2) {
        return `0${s}`
    } else {
        return s
    }
}

function log(s) {
    const time = new Date()
    let hours = time.getHours()
    let pm = false
    if (hours > 12) {
        hours -= 12
        pm = true
    }
    console.log(`[${hours}:${addZero(time.getMinutes())}${pm ? 'pm' : 'am'}]`, s)
}

// from https://stackoverflow.com/a/43532829/1955997
function roundTo(value, digits) {
    value = value * Math.pow(10, digits)
    value = Math.round(value)
    value = value / Math.pow(10, digits)
    return value
}

async function build(minify) {
    const now = performance.now()
    try {
        await esbuild({
            entryPoints: ['docs/code.js'],
            inject: ['scripts/live.js'],
            bundle: true,
            outfile: 'docs/index.js',
            minify,
            sourcemap: minify ? false : 'external',
        })
        log(`packaged javascript (${roundTo(performance.now() - now, 2)}ms).`)
    } catch(e) {
        log('error compiling javascript.')
        let s = ''
        for (const error of e.errors) {
            const lines = new readLines(error.location.file)
            let i = 1, line
            while (line = lines.next()) {
                if (i >= error.location.line - linesToShow && i <= error.location.line + linesToShow) {
                    if (i === error.location.line) {
                        let actual = line.toString()
                        actual = `${actual.substr(0, error.location.column)}` +
                            `<span style="background:red">${actual.substr(error.location.column, error.location.length)}</span>` +
                            actual.substr(error.location.column + error.location.length)
                        s += `<div style="background:blue;color:white">${actual}</div>`
                    } else {
                        s += line.toString() + '<br>'
                    }
                }
                i++
            }
        }
        const script = `window.addEventListener('load', () => {
            document.body.style.background = 'white'
            document.body.style.fontFamily = 'Consolas,monaco,monospace'
            document.body.style.margin = '1rem'
            document.body.style.width = 'auto'
            document.body.style.height = 'auto'
            document.body.innerHTML = \`${e.toString().replaceAll('\n', '<br>')}<br><br>${s}\`
        });` + await fs.readFile('scripts/live.js')
        await fs.outputFile('docs/index.js', script)
    }
}

async function production() {
    await build(true)
    log(`${packageJSON.name} v${packageJSON.version} deployed to docs`)
    process.exit(0)
}

function httpServer() {
    const app = express()
    app.use('/', express.static('docs'))
    app.listen(port, () => log(`${packageJSON.name} v${packageJSON.version} running at http://localhost:${port}`))
}

function webSocketServer() {
    _wss = new WebSocket.Server({
        port: websocketPort,
    })
    log(`Live reload socket server running on port ${websocketPort}`)
}

function signalSockets() {
    _wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send()
        }
    })
}

async function serve() {
    await build()
    const jsWatch = chokidar.watch(['docs/code.js', 'src/*.js'])
    jsWatch.on('change', async () => {
        await build()
        signalSockets()
    })
    httpServer()
    webSocketServer()
}

if (process.argv[2] === '--production') {
    production()
} else {
    serve()
}
