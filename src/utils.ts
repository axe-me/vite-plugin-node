/**
 * modified from vitejs source code, just to make the console output looks vite-like
 */
import debug from "debug";

export function createDebugger(ns: string) {
  const log = debug(ns);
  return (msg: string, ...args: any[]) => {
    log(msg, ...args);
  };
}
export const queryRE = /\?.*$/;
export const hashRE = /#.*$/;

export const cleanUrl = (url: string) =>
  url.replace(hashRE, "").replace(queryRE, "");
