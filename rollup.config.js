import buble from 'rollup-plugin-buble'

module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vuezy.common.js',
      format: 'cjs'
    },
    plugins: [
      buble(),
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vuezy.esm.js',
      format: 'esm'
    },
    plugins: [
      buble(),
    ]
  },
]