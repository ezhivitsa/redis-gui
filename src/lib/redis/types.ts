export interface AskedSshAuthData {
  passphrase?: string;
  password?: string;
}

export interface AskedRedisAuthData {
  tlsPassphrase?: string;
}

export interface PrefixesAndKeys {
  prefixes: string[];
  keys: string[];
}
