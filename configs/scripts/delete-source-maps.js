import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import webpackPaths from '../webpack/webpack.paths';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function deleteSourceMaps() {
  if (fs.existsSync(webpackPaths.distMainPath)) rimraf.sync(path.join(webpackPaths.distMainPath, '*.js.map'));
  if (fs.existsSync(webpackPaths.distRendererPath)) rimraf.sync(path.join(webpackPaths.distRendererPath, '*.js.map'));
}
