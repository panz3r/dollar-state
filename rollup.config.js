import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import buble from "rollup-plugin-buble";
import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

const uglifyCfg = {
  output: {
    preamble: `
/*
* Copyright (c) 2018 Mattia Panzeri <mattia.panzeri93@gmail.com>
* 
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. 
*/
`
  }
};

export default [
  // browser-friendly UMD build
  {
    input: "src/main.js",
    output: {
      name: "$tate",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      resolve(),
      commonjs(),
      buble({
        exclude: ["node_modules/**"]
      }), // transpile ES2015+ to ES5
      uglify(uglifyCfg) // Uglify output code
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/main.js",
    external: ["immer"],
    output: {
      file: pkg.main,
      format: "cjs"
    },
    plugins: [
      buble({
        exclude: ["node_modules/**"]
      }),
      uglify(uglifyCfg)
    ]
  },
  // ES module (for bundlers) build.
  {
    input: "src/main.js",
    external: ["immer"],
    output: {
      file: pkg.module,
      format: "es"
    },
    plugins: [
      buble({
        exclude: ["node_modules/**"]
      })
    ]
  }
];
