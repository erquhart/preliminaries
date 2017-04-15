import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
  entry: "src/index.js",
  format: "iife",
  dest: "dist/preliminaries.min.js",
  moduleName: "preliminaries",
  plugins: [babel(), uglify()]
};
