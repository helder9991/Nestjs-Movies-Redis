import * as Yup from 'yup';

const createMovieSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
});

const findOneMovieSchema = Yup.object().shape({
  id: Yup.string().uuid().required(),
});

const updateMovieSchema = Yup.object().shape({
  id: Yup.string().uuid().required(),
  name: Yup.string().required(),
  description: Yup.string().required(),
});

const removeMovieSchema = Yup.object().shape({
  id: Yup.string().uuid().required(),
});

export {
  createMovieSchema,
  findOneMovieSchema,
  updateMovieSchema,
  removeMovieSchema,
};
