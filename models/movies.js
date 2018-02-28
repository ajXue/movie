var mongoose = require("mongoose");
var MovieSchemas = require("../schemas/movies");

var Movie = mongoose.model('Movie', MovieSchemas);

module.exports = Movie;