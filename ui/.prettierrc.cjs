// .prettierrc.js

module.exports = {
  arrowParens: 'avoid',
  singleQuote: true,
  printWidth: 80,
  plugins: ['prettier-plugin-svelte'],
  semi: true,
  svelteSortOrder: 'options-styles-scripts-markup',
  svelteStrictMode: false,
  svelteBracketNewLine: false,
  svelteIndentScriptAndStyle: true,
  trailingComma: 'none'
}