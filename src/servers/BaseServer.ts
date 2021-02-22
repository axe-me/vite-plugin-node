import { ViteDevServer } from "vite";

export abstract class BaseServer {
  constructor(private server: ViteDevServer) {
  }

  public abstract start(): Promise<void>;
  public abstract restart(): Promise<void>;
}