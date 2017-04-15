import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'preliminaries',
  dest: 'dist/index.js',
  plugins: [
    babel({include: 'index.js'})
  ]
};
