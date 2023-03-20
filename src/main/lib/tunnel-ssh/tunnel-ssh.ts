import net, { ListenOptions, Server, Socket } from 'net';
import { Client, ConnectConfig } from 'ssh2';

import { ForwardOptions, TunnelOptions } from './types';

function autoClose(server: Server, connection: Socket): void {
  connection.on('close', () => {
    server.getConnections((error, count) => {
      if (count === 0) {
        server.close();
      }
    });
  });
}

async function createServer(options: ListenOptions): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    const errorHandler = (error: Error): void => {
      reject(error);
    };
    server.on('error', errorHandler);
    process.on('uncaughtException', errorHandler);
    server.listen(options);
    server.on('listening', () => {
      process.removeListener('uncaughtException' as any, errorHandler);
      resolve(server);
    });
  });
}

async function createClient(config: ConnectConfig): Promise<Client> {
  return new Promise(function (resolve, reject) {
    const conn = new Client();
    conn.on('ready', () => resolve(conn));
    conn.on('error', reject);
    conn.connect(config);
  });
}

export async function createTunnel(
  tunnelOptions: TunnelOptions,
  serverOptions: ListenOptions,
  sshOptions: ConnectConfig,
  forwardOptions: ForwardOptions,
): Promise<[Server, Client]> {
  return new Promise(async (resolve, reject) => {
    let server: Server;
    let conn: Client;
    try {
      server = await createServer(serverOptions);
    } catch (e) {
      return reject(e);
    }

    try {
      conn = await createClient(sshOptions);
    } catch (e) {
      server.close();
      return reject(e);
    }
    server.on('connection', (connection) => {
      if (tunnelOptions.autoClose) {
        autoClose(server, connection);
      }

      conn.forwardOut(
        forwardOptions.srcAddr,
        forwardOptions.srcPort,
        forwardOptions.dstAddr,
        forwardOptions.dstPort,
        (err, stream) => {
          connection.pipe(stream).pipe(connection);
        },
      );
    });

    server.on('close', () => conn.end());
    resolve([server, conn]);
  });
}
