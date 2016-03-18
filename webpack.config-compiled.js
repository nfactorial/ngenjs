'use strict';

var path = require('path');

module.exports = {
    entry: {
        app: ['./src/ngen.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js/,
            loader: 'babel-loader',
            include: [path.resolve(__dirname, 'src')]
        }]
    }
};

//# sourceMappingURL=webpack.config-compiled.js.map