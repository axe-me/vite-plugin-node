import { RequestAdapter } from '..';
import {Context, ServerIO} from '@marblejs/core';
import { HttpListener, HttpServer } from '@marblejs/http';
import {Reader} from 'fp-ts/Reader';

export interface MarbleContext {
    server: Promise<ServerIO<HttpServer>>;
    listener: Reader<Context, HttpListener>;
}

export const MarbleHandler: RequestAdapter<MarbleContext> = async (app, req, res) => {
    const server = await app.server;
    app.listener(server.context)(req, res);

};