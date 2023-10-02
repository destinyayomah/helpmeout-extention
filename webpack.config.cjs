const path = require('path');

module.exports = {
    entry: './src/components/Controls.tsx', // Replace with the path to your component's entry file
    output: {
        filename: 'component-bundle.js', // Replace with the desired output filename
        path: path.resolve(__dirname, 'public/static'), // Replace with your desired output directory
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                    },
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/', // Specify the output directory for images
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
};
