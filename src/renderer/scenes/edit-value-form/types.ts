import { Redis } from 'lib/redis';

export enum EditDataField {
  RedisId = 'redisId',
  Key = 'key',
  CanEditKey = 'canEditKey',
  Ttl = 'ttl',
  Value = 'value',
}

export interface EditDataValues {
  [EditDataField.RedisId]: string;
  [EditDataField.Key]: string;
  [EditDataField.CanEditKey]: boolean;
  [EditDataField.Ttl]?: number;
  [EditDataField.Value]: string;
}

export interface Props {
  connections: Redis[];
}
