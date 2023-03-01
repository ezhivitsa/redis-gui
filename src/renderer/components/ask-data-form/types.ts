export enum AskDataField {
  SshPassphrase = 'sshPassphrase',
  SshPassword = 'sshPassword',
  TlsPassphrase = 'tlsPassphrase',
}

export interface AskDataValues {
  [AskDataField.SshPassphrase]?: string;
  [AskDataField.SshPassword]?: string;
  [AskDataField.TlsPassphrase]?: string;
}
