import babel from "rollup-plugin-babel";

export default {
  entry: "src/index.js",
  format: "es",
  dest: "dist/preliminaries.mjs",
  plugins: [
    babel({
      babelrc: false,
      presets: ["flow"]
    })
  ]
};
