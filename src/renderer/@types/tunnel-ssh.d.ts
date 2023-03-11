declare module 'tunnel-ssh' {
  import { ListenOptions, Server } from 'net';
  import { ConnectConfig, Client } from 'ssh2';

  export function createTunnel(
    tunnelOptions: createTunnel.Config,
    serverOptions: ListenOptions,
    sshOptions: ConnectConfig,
    forwardOptions: createTunnel.ForwardOptions,
  ): Promise<[Server, Client]>;

  declare namespace createTunnel {
    interface TunnelOptions {
      autoClose?: boolean;
    }

    interface ForwardOptions {
      srcAddr: string;
      srcPort: number;
      dstAddr: string;
      dstPort: number;
    }
  }
}
