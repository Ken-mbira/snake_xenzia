const path = require('path');
const htmlwebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => {
    return {
        mode : env.environment,
        entry : './src/index.js',
        output : {
            filename : 'main.js',
            path : path.resolve(__dirname, 'dist'),
            clean: true
        },
        module : {
            rules : [
                {
                    test : /\.css$/i,
                    use : ['style-loader', 'css-loader']
                }
            ]
        },
        plugins: [
            new htmlwebpackPlugin({
                title: "Snake Xenzia"
            })
        ],
        devServer : {
            static : './dist',
            compress : true,
            port : 3000
        }
    }
}