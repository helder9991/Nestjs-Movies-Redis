import * as Yup from 'yup';

const createUserValidator = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8),
});

export { createUserValidator };
