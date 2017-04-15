import babel from "rollup-plugin-babel";

export default {
  entry: "src/index.js",
  format: "umd",
  dest: "dist/preliminaries.js",
  moduleName: "preliminaries",
  plugins: [babel()]
};
