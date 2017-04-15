import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/Preliminaries.js',
  plugins: [
    babel()
  ],
  targets: [
    {
      format: 'umd',
      dest: 'dist/preliminaries.js',
      moduleName: 'preliminaries'
    },
    {
      format: 'es',
      dest: 'dist/preliminaries.mjs'
    }
  ]
};
