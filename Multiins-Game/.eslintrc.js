module.exports = {
	env: {
		es6: true,
		node: true,
		mocha: true,
	},
	extends: 'airbnb-base',
	parserOptions: {
		ecmaVersion: 8, // or 2017
	},
	root: true,
	rules: {
		'no-tabs': 0,
		indent: [
			'error',
			'tab',
		],
		'linebreak-style': [
			'error',
			'unix',
		],
		quotes: [
			'error',
			'single',
		],
		semi: [
			'error',
			'never',
		],
		// rules: {// 因为eslint不识别webpack的路径别名
		// 	'import/extensions': [2, 'never', { 'web.js': 'never', json: 'never' }],
		// 	'import/no-extraneous-dependencies': [2, { devDependencies: true }],
		// 	'import/no-unresolved': [2, { ignore: ['antd-mobile'] }],
		// },
	},
}
