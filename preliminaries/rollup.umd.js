import babel from "rollup-plugin-babel";

export default {
  entry: "src/Preliminaries.js",
  format: "umd",
  dest: "dist/preliminaries.js",
  moduleName: "preliminaries",
  plugins: [babel()]
};
