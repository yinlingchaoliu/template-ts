import path from 'path'
import shelljs from 'shelljs'
import { program } from 'commander'
import { fileURLToPath } from 'url'
import fs from 'fs'

//切换npm
function switchNpm() {
	shelljs.exec('npm config set registry https://registry.npmjs.org/')
}

//切换淘宝源
function switchTaobao() {
	shelljs.exec('npm config set registry https://registry.npm.taobao.org/')
}

/**
 * 账号登录
 */
function loginNpm() {
	shelljs.exec('set timeout 30')
	shelljs.exec('spawn npm adduser')
	shelljs.exec('expect "Username:"')
	shelljs.exec('send "yinlingchaoliu"')
	shelljs.exec('expect "Password:"')
	shelljs.exec('send "chentong6749"')
	shelljs.exec('interact')
}

function publish() {
	shelljs.cd('dist')
	shelljs.exec('npm publish --access public') // 发布
}

function build() {
	shelljs.exec('yarn dev')
}

function copy() {
	shelljs.exec('cp package.json README.md dist')
}

/**
 * version 自动++
 */
function version() {
	const __dirname = path.dirname(fileURLToPath(import.meta.url))
	const targetFile = path.resolve(__dirname, './dist/package.json')
	// const packagejson = require(targetFile);
	const packagejson = JSON.parse(fs.readFileSync(targetFile))
	// fs.readFile(targetFile)
	const currentVersion = packagejson.version
	const versionArr = currentVersion.split('.')
	const [mainVersion, subVersion, phaseVersion] = versionArr

	// 默认版本号
	const defaultVersion = `${mainVersion}.${subVersion}.${+phaseVersion + 1}`

	let newVersion = defaultVersion

	// 从命令行参数中取版本号; 失效的
	program.option('-v | --versions <type>', 'Add release version number', defaultVersion)

	program.parse(process.argv)

	if (program.versions) {
		newVersion = program.versions
	}
	console.log('newVersion: ' + newVersion)

	// shelljs.sed('-i', '"name": "ktools"', '"name": "@kagol/ktools"', targetFile); // 修改包名
	shelljs.sed('-i', `"version": "${currentVersion}"`, `"version": "${newVersion}"`, targetFile) // 修改版本号
}

function main() {
	build()
	copy()
	// version()
	switchNpm()
	//暂时不用
	// loginNpm()
	publish()
	// try {
	// } finally {
	// 	// switchTaobao()
	// }
}

main()
