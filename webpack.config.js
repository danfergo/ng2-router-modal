module.exports = {
    entry: "./index.ts",
    output: {
        path: 'dist/',
        publicPath: '/',
        filename: 'bundle.js',
        libraryTarget: 'umd',
        library: 'ng2-router-modal'
    },

    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts',  '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};