import babel from "rollup-plugin-babel";

export default {
  entry: "src/Preliminaries.js",
  format: "es",
  dest: "dist/preliminaries.mjs",
  plugins: [
    babel({
      babelrc: false,
      presets: ["flow"]
    })
  ]
};
