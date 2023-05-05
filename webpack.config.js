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
                },
                {
                    test: /\.png$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                                name: 'play_icon.png'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new htmlwebpackPlugin({
                template: './src/index.html'
            })
        ],
        devServer : {
            static : './dist',
            compress : true,
            port : 3000
        }
    }
}