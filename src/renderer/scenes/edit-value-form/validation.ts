import { yup } from 'renderer/lib/yup';

export const validationSchema = yup.object().shape({
  key: yup.string().required(),
  redisId: yup.string().required(),
  ttl: yup.number(),
  value: yup.string().required(),
});
