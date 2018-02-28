var mongoose = require("mongoose");

var MovieSchemas= new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    meta: {
       createdAt: {
           type: Date,
           fault: Date.now()
       },
        updateAt: {
            type: Date,
            fault: Date.now()
        }
    }
});

//每次存储一个数据，都调用一下
MovieSchemas.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    //将存储流程继续往下走
    next();
});


//在模型model实例化的时候才有这个方法

MovieSchemas.statics = {
    fetch: function(cb) {   //用来去除目前数据块所有的数据
        return this
            .find({})
            .sort('meta.updateAt')   //排序
            .exec(cb)
    },
    findById: function (id , cb) {
        return this
            .findOne({ _id: id})
            .sort('meta.updateAt')   //排序
            .exec(cb)
    }
}

module.exports = MovieSchemas;
