import * as Yup from 'yup';

const createUserSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8),
});

const authUserSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8),
});

export { createUserSchema, authUserSchema };
