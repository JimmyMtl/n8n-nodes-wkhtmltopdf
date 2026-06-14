import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { fixupPluginRules } from '@eslint/compat';
import n8nBase from 'eslint-plugin-n8n-nodes-base';

// eslint-plugin-n8n-nodes-base@1.16.x still calls the context methods that
// ESLint 9 removed (e.g. context.getFilename()). fixupPluginRules shims them
// so the plugin's rules run under ESLint 10.
const n8n = fixupPluginRules(n8nBase);

export default [
	{ ignores: ['dist/', 'node_modules/'] },
	{
		files: ['nodes/**/*.ts'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',
		},
		plugins: { 'n8n-nodes-base': n8n },
		rules: {
			...js.configs.recommended.rules,
			// n8n node code relies on these patterns; matches the previous .eslintrc.js
			'no-console': 'off',
			'no-unused-vars': 'off',
			'no-undef': 'off',
			...n8nBase.configs.nodes.rules,
		},
	},
	{
		files: ['package.json'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		plugins: { 'n8n-nodes-base': n8n },
		rules: {
			...n8nBase.configs.community.rules,
		},
	},
];
