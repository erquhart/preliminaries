import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'preliminaries',
  dest: 'dist/index.js',
  plugins: [
    babel({include: 'src/index.js'})
  ]
};
