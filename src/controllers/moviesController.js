const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd');
        /* Genres.findAll()
        .then(allGenres =>
            res.render('moviesAdd', {
                allGenres
            })
        ) */
    },
    create: function (req,res) {
        const {
            title,
            rating,
            awards,
            release_date,
            length,
        } = req.body;

        Movies.create({
            title, 
            rating, 
            awards, 
            release_date, 
            length, 
        })
        .then(() => {
            res.redirect('/movies');
        })
        .catch(err => console.log(err));
    },
    edit: function(req,res) {
        Movies.findByPk(+req.params.id)
        .then(Movie => {
            res.render('moviesEdit', {
                Movie
            });
        })
        /* const genresPromise = Genres.findAll();
        const moviePromise = Movie.findByPk(req.params.id);
        Promise.all([genresPromise, moviePromise]); */ 
    },
    update: function (req,res) {
        const {
            title,
            rating,
            awards,
            release_date,
            length 
        } = req.body;

        Movies.update({
            title, 
            rating, 
            awards, 
            release_date, 
            length,
        }, {
            where: {
                id: +req.params.id
            }
        })
        .then(() => {
            res.redirect('/movies');
        })
        .catch(err => console.log(err));
    },
    delete: function (req,res) {
        Movies.findByPk(+req.params.id)
        .then(Movie => {
            res.render('moviesDelete', {
                Movie
            });
        });
    },
    destroy: function (req,res) {
        Movies.destroy({
            where: {
                id: +req.params.id
            }
        })
        .then(() => {
            res.redirect('/movies');
        })
        .catch(error => console.log(error));
    }
}

module.exports = moviesController;