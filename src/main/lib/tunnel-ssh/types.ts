export interface TunnelOptions {
  autoClose?: boolean;
}

export interface ForwardOptions {
  srcAddr: string;
  srcPort: number;
  dstAddr: string;
  dstPort: number;
}
