import * as dotenv from "dotenv";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import scss from "rollup-plugin-scss";
import { terser } from "rollup-plugin-terser";

dotenv.config();
const { ENVIRONMENT } = process.env;

const pluginsJs = [
  typescript({ tsconfig: "./rollupTs.config.json" }),
  resolve(),
];

const isProdEnv = ENVIRONMENT === "production";

if (isProdEnv) pluginsJs.push(terser());

export default [
  {
    input: "src/public/index/js/index.ts",
    output: {
      file: "dist/public/index/index.js",
      format: "esm",
      sourcemap: false,
    },

    plugins: pluginsJs,
  },
  {
    input: "src/public/chatRoom/js/index.ts",
    output: {
      file: "dist/public/chatRoom/index.js",
      format: "esm",
      sourcemap: false,
    },

    plugins: pluginsJs,
  },
  {
    input: "src/public/index/styles/main.scss",
    plugins: [
      scss({
        output: "dist/public/index/styles.css",
        outputStyle: isProdEnv ? "compressed" : undefined,
      }),
    ],
  },
  {
    input: "src/public/chatRoom/styles/main.scss",
    plugins: [
      scss({
        output: "dist/public/chatRoom/styles.css",
        outputStyle: isProdEnv ? "compressed" : undefined,
      }),
    ],
  },
];
