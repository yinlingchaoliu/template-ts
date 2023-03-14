import path from 'path'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import { watch } from 'rollup' //不能直接引入rollup
import { uglify } from 'rollup-plugin-uglify'

//暂时无用
const resolveFile = function (filePath) {
	return path.join(__dirname, filePath)
}

const outputFile = function (mode) {
	if (mode == 'esm') {
		return `./dist/dist/index.js`
	} else {
		return `./dist/dist/index.${mode}.js`
	}
}

/**
 * 打包输入结构后续要考虑一下
 */
const pluginName = 'micro-app'
function getOptions(mode) {
	const result = {
		input: 'src/index.ts',
		output: {
			file: outputFile(mode),
			format: mode,
			sourcemap: true,
			name: 'MicroApp',
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript(),
			json({
				compact: true,
			}),
			replace({
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			}),
		],
	}

	if (process.env.NODE_ENV === 'production') {
		result.plugins.push(
			uglify({
				compress: {
					drop_console: true,
				},
			})
		)
	}

	return result
}

if (process.env.NODE_ENV === 'development') {
	const watcher = watch(getOptions('esm'))
	console.log('rollup is watching for file change...')

	watcher.on('event', (event) => {
		switch (event.code) {
			case 'START':
				console.log('rollup is rebuilding...')
				break
			case 'ERROR':
			case 'FATAL':
				console.log('error in rebuilding.')
				break
			case 'END':
				console.log('rebuild done.')
		}
	})
}

//支持多种输出类型
const modes = ['umd', 'esm', 'cjs', 'iife']
export default modes.map((mode) => getOptions(mode))
