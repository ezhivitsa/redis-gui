import { Config as TunnelSshConfig } from 'tunnel-ssh';
import { RedisOptions, ClusterNode, ClusterOptions } from 'ioredis';

import {
  ConnectionSsh,
  SshAuthMethod,
  ConnectionType,
  ConnectionMain,
  ConnectionAuth,
  ConnectionTls,
  ConnectionAdvanced,
} from 'lib/db';

interface RedisConfigData {
  main: ConnectionMain;
  auth: ConnectionAuth;
  tls: ConnectionTls;
  advanced: ConnectionAdvanced;
}

export function getSshConfig(ssh: ConnectionSsh): TunnelSshConfig {
  const config: TunnelSshConfig = {
    host: ssh.host,
    port: Number(ssh.port) || undefined,
    username: ssh.username,
  };

  if (ssh.authMethod === SshAuthMethod.Password) {
    config.password = ssh.askForPasswordEachTime ? undefined : ssh.password;
  } else {
    config.privateKey = ssh.privateKey?.text;
    config.passphrase = ssh.askForPassphraseEachTime ? undefined : ssh.passphrase;
  }

  return config;
}

export function getRedisDirectConfig({ main, auth, tls, advanced }: RedisConfigData): RedisOptions {
  const options: RedisOptions = {};

  options.port = Number(main.addresses[0]?.port) || undefined;
  options.host = main.addresses[0]?.port || undefined;
  options.readOnly = main.readOnly;

  if (auth.performAuth) {
    options.password = auth.password;
    options.username = auth.username;
  }

  if (tls.enabled) {
    options.tls = {
      ca: tls.ca?.text,
      crl: tls.crl?.text,
      key: tls.pem?.text,
      passphrase: tls.askForPassphraseEachTime ? undefined : tls.passphrase,
    };
  }

  options.family = advanced.family;
  options.db = advanced.db;
  options.keyPrefix = advanced.keyPrefix || undefined;
  options.stringNumbers = advanced.stringNumbers;

  return options;
}

export function getRedisClusterConfig({
  main,
  auth,
  tls,
  advanced,
}: RedisConfigData): [ClusterNode[], ClusterOptions] {}
