var express = require("express");
//path模块提供了处理文件和目录的路径
var path = require('path');
var mongoose= require('mongoose');
var Movie = require("./models/movies");

//unserscore模块
var _ = require('underscore')
//process是nodejs的全局变量，process.env.PORT是值环境变量
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var app = express();

mongoose.connect('mongodb://localhost/movie');

//设置模板的路径
app.set('views', './views/pages');
//模板引擎使用的是jade
app.set('view engine', 'jade');

//创建 application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({extended:true}));
//加载静态资源、列如库之类的
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);
console.log("movie running")

/*
* 路由
* */
// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if(err) {
            console.log('err')
        }
        res.render('index',{
            title: "Movie首页",
            movies: movies
        })
    });

});

// detail page
app.get('/movie/:id', function (req, res) {
    var id= req.params.id;
    
    Movie.findById(id, function (err, movie) {
        res.render('detail',{
            title: 'movie  详情页',
            movie: movie
        })
    })
});

//删除
app.delete('/admin/delete', function (req, res) {
    console.log(req.query.id)
    var id = req.query.id;
    if(id) {
        Movie.remove({_id: id }, function (err, movie) {
            if(err ){
                console.log(err)
            }else {
                res.json({stateCode: 1})
            }
        })
    }

});

//更新电影
app.get('/admin/update/:id', function (req, res) {
   var id = req.params.id;
   if(id) {
        Movie.findById(id, function (err, movie) {
            if(err) {
                console.log(err)
            }
            console.log(movie);
            res.render('admin', {
                title: '后台更新',
                movie: movie
            })
        })
   }
});

//录入表单，数据的存储
app.post('/admin/movie/new', function (req, res) {
   var id = req.body.movie._id;
   var movieObj = req.body.movie;
   var _movie;
   if( id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if(err) {
                console.log('err');
            }
            //unserscore模块用于新的数据替换老的数据
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if(err) {
                    console.log(err)
                }

                res.redirect('/movie/'+ movie.id);
            })
        })
   } else {
   //    新添加是电影数据
       _movie = new Movie({
           doctor: movieObj.doctor,
           title: movieObj.title,
           language: movieObj.language,
           country: movieObj.country,
           commary: movieObj.commary,
           flash: movieObj.flash,
           poster: movieObj.poster,
           year: movieObj.year
       });
       _movie.save(function (err, movie) {
           if(err) {
               console.log(err)
           }

           res.redirect('/movie/'+ movie.id);
       })
   }
});

// list page
app.get('/admin/list', function (req, res) {
    Movie.fetch( function (err, movies) {
        if( err ) {
            console.log(err);
        }
        res.render('list',{
            title: 'movie 列表页',
            movies: movies
        })
    });

});

// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin',{
        title: 'movie 后台',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            language: '',
            summary: '',
            flash: ''
        }
    })
});