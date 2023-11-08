import path from 'path';
import 'colors';

/**
 * modified from vitejs source code, just to make the console output looks vite-like
 */
import debug from 'debug';

export function createDebugger(ns: string) {
  const log = debug(ns);
  return (msg: string, ...args: any[]) => {
    log(msg, ...args);
  };
}
export const queryRE = /\?.*$/;
export const hashRE = /#.*$/;

export const cleanUrl = (url: string) =>
  url.replace(hashRE, '').replace(queryRE, '');

export function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export default function mergeDeep(target: object, source: object) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      // @ts-expect-error access unknow property
      if (isObject(source[key])) {
        if (!(key in target)) {
          // @ts-expect-error access unknow property
          Object.assign(output, { [key]: source[key] });
        } else {
          // @ts-expect-error access unknow property
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        // @ts-expect-error access unknow property
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
const CacheFileMap: Record<string, number> = {};

export function SwcFileUpdate(FileId: string, appPath: string) {
  console.clear();

  let rootPath = '';
  FileId.split(path.sep).forEach((spath) => {
    appPath.split('/').forEach((apath) => {
      if (apath === spath && rootPath === '')
        rootPath = apath;
    });
  });

  const FileNameIndex = FileId.split(path.sep).indexOf(rootPath);
  const FilePath = path.join(...FileId.split(path.sep).slice(FileNameIndex));
  if (CacheFileMap[FilePath] === undefined)
    CacheFileMap[FilePath] = 0;
  else CacheFileMap[FilePath] += 1;

  CacheFileMap[FilePath] !== 0
    /* eslint-disable no-console */
    && console.log(`${FilePath} ✖️ [ ${CacheFileMap[FilePath]} ] updated`.yellow);
}
