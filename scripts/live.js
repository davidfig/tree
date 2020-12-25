const port = 1235
let first = true

function createSocket() {
    const socket = new WebSocket(`ws://localhost:${port}`)
    socket.addEventListener('message', () => window.location.reload())
    socket.addEventListener('close', () => {
        setTimeout(createSocket, 0)
    })
    socket.addEventListener('open', () => {
        if (!first) {
            window.location.reload()
        } else {
            first = false
        }
    })
}

window.addEventListener('load', () => {
    createSocket()
    console.log(`Live reload initialized on port ${port}...`)
})