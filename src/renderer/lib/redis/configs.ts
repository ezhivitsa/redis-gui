import { ClusterNode, ClusterOptions, RedisOptions } from 'ioredis';
import { ConnectConfig as SshConfig } from 'ssh2';

import {
  ConnectionAdvanced,
  ConnectionAuth,
  ConnectionMain,
  ConnectionSsh,
  ConnectionTls,
  SshAuthMethod,
} from 'renderer/lib/db';

interface RedisConfigData {
  main: ConnectionMain;
  auth: ConnectionAuth;
  tls: ConnectionTls;
  advanced: ConnectionAdvanced;
}

function getRedisAdvancedConfig(advanced: ConnectionAdvanced): RedisOptions {
  const options: RedisOptions = {};

  options.family = advanced.family;
  options.db = advanced.db;
  options.keyPrefix = advanced.keyPrefix || undefined;
  options.stringNumbers = advanced.stringNumbers;

  return options;
}

function getRedisCommonConfig({ main, auth, tls, advanced }: RedisConfigData): RedisOptions {
  const options: RedisOptions = {};

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

  return {
    ...options,
    ...getRedisAdvancedConfig(advanced),
  };
}

export function getSshConfig(ssh: ConnectionSsh): SshConfig {
  const config: SshConfig = {
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
  options.host = main.addresses[0]?.host || undefined;

  return {
    ...options,
    ...getRedisCommonConfig({ main, auth, tls, advanced }),
  };
}

export function getRedisClusterConfig({ main, auth, tls, advanced }: RedisConfigData): [ClusterNode[], ClusterOptions] {
  const nodes = main.addresses.map(
    (address): ClusterNode => ({
      host: address.host,
      port: Number(address.port) || undefined,
    }),
  );

  const options: ClusterOptions = {
    redisOptions: getRedisCommonConfig({ main, auth, tls, advanced }),
  };

  return [nodes, options];
}

export function getRedisSentinelConfig({ main, auth, tls, advanced }: RedisConfigData): RedisOptions {
  const options: RedisOptions = {};

  options.sentinels = main.addresses
    .filter(({ port }) => Number(port))
    .map((address) => ({
      host: address.host,
      port: Number(address.port),
    }));

  options.role = main.readOnly ? 'slave' : 'master';

  options.name = main.sentinelName;
  options.sentinelTLS;

  if (auth.performAuth) {
    options.sentinelPassword = auth.sentinelPassword;
    options.sentinelUsername = auth.sentinelUsername;
    options.password = auth.password;
    options.username = auth.username;
  }

  if (tls.enabled) {
    options.sentinelTLS = {
      ca: tls.ca?.text,
      crl: tls.crl?.text,
      key: tls.pem?.text,
      passphrase: tls.askForPassphraseEachTime ? undefined : tls.passphrase,
    };
  }

  return {
    ...options,
    ...getRedisAdvancedConfig(advanced),
  };
}
