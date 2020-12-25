const fs = require('fs-extra')

const dir = 'docs/jsdoc'

async function clean() {
    console.log(`Cleaning director ${dir}...`)
    await fs.emptyDir(dir)
    process.exit(0)
}

clean()