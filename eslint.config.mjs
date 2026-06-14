import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

export default [
	{ ignores: ['dist/', 'node_modules/'] },
	{
		files: ['nodes/**/*.ts'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',
		},
		rules: {
			...js.configs.recommended.rules,
			// n8n node code relies on these patterns; matches the previous .eslintrc.js
			'no-console': 'off',
			'no-unused-vars': 'off',
			'no-undef': 'off',
		},
	},
];
