import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/typescript/App.ts", // Your main TypeScript file
  output: {
    file: "src/dist/bundle.js",
    format: "iife", // Immediately Invoked Function Expression
  },
  plugins: [
    typescript(),
    terser(), // Minifies the output
  ],
};
