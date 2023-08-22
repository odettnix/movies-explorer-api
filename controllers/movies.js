const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

function getMovies(req, res, next) {
  const owner = req.user._id;
  Movie
    .find({ owner })
    .then((movies) => {
      if (!movies || movies.length === 0) {
        res.send('Сохраненных фильмов не найдено');
      }
      return res.send(movies);
    })
    .catch(next);
}

function addMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.valueOf() !== userId) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
      Movie
        .findByIdAndRemove(movieId)
        .then(() => res.send({ message: 'Фильм успешно удален' }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
