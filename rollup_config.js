import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/main.js",
  output: {
    file: "./transpiled/bundle.js",
    format: "cjs",
  },
  plugins: [resolve()],
};
