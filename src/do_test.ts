import * as path from 'path'
import * as fs from 'fs'
import * as child_process from 'child_process'
import rimraf = require('rimraf')
import { outDir, inputDir, ansDir } from './setting';

export const runTest = (testCommand: string) => {
    if (fs.existsSync(outDir)) {
        rimraf.sync(outDir)
    }
    fs.mkdirSync(outDir)
    console.log(`<INFO> testing...`)

    fs.readdir(inputDir, (err, filenames) => {
        if (err) {
            console.error(err);
        }
        for (const f of filenames) {
            const inputFile = path.join(inputDir, f)
            const outPath = path.join(outDir, f)
            const ansFile = path.join(ansDir, f)
            if (!fs.existsSync(ansFile)) {
                console.error(`cannot find ${ansFile}`)
                return
            }
            child_process.execSync(`cat ${inputFile} | ${testCommand} > ${outPath}`)
            const o = fs.readFileSync(outPath, {encoding: 'utf-8'})
            const a = fs.readFileSync(ansFile, {encoding: 'utf-8'})
            const output = o.match(/[^\s]+/g)
            const ans = a.match(/[^\s]+/g)
            if (!ans) {
                console.error(`no contents in ${ansFile}`)
                return
            }
            if (!output) {
                console.error(`no contents in ${outPath}`)
                return
            }
            if (!ans.every((v, i) => output[i] === v)) {
                console.log(`<RESULT> ==WA== : ${inputFile}`)
            } else {
                console.log(`<RESULT> ==AC== : ${inputFile}`)
            }
        }
    })
}