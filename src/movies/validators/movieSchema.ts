import * as Yup from 'yup';

const createMovieSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
});

const findAllMovieSchema = Yup.object().shape({
  page: Yup.number().positive().required(),
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
  findAllMovieSchema,
  findOneMovieSchema,
  updateMovieSchema,
  removeMovieSchema,
};
