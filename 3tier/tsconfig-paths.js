const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

const paths = tsConfig.compilerOptions.paths;

Object.keys(paths).forEach((key) => {
  const result = paths[key].map((item) => item.replace('/src', ''));
  paths[key] = result;
});

const baseUrl = tsConfig.compilerOptions.outDir;

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});