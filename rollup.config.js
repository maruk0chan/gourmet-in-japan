import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'


export default {
	plugins: [
		replace({
			'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL || ''),
		}),
		json({
			compact: true,
		}),
	],
}
