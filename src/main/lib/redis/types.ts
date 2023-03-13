export interface AskedSshAuthData {
  passphrase?: string;
  password?: string;
}

export interface AskedRedisAuthData {
  tlsPassphrase?: string;
}

export interface PrefixesAndKeys {
  prefixes: Record<string, string[]>;
  keys: string[];
}

export interface KeyData {
  key: string;
  ttl?: number;
  value: string;
}

export interface SshRedisAddress {
  originalHost: string;
  originalPort: number;
  host: string;
  port: number;
}
