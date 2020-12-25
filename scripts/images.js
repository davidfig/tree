const fs = require('fs-extra')

let s = 'export const icons={'

const files = ['closed', 'open']

async function convert() {
    for (let file of files) {
        console.log(`Copying ${file}...`)
        const svg = await fs.readFile(`images/${file}.svg`)
        s += `${file}:'${svg}',`
    }
    s = s.substr(0, s.length - 1) + '}'
    await fs.writeFile('./src/icons.js', s)
    process.exit()
}

convert()