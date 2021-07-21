export interface AskedSshAuthData {
  passphrase?: string;
  password?: string;
}

export interface AskedRedisAuthData {
  tlsPassphrase?: string;
}

export interface IRedis {
  connect(data: AskedRedisAuthData): Promise<void>;
  disconnect(): void;
}
