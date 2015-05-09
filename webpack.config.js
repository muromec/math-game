var path = require("path");

module.exports = {
    entry: {
        main: path.join(__dirname, 'app/index.js'),
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader?compact=false&cacheDirectory=./.webpack-cache/', exclude: /node_modules/},

        ],
    },
    output: {
        path: path.join(__dirname, "build"),
        publicPath: "http://localhost:8000/build/",
        filename: "[name].js?[chunkhash]",
    },
    resolveLoader: {
        root: path.join(__dirname, "node_modules"),
    },
};
