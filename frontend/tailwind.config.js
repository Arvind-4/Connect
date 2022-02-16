const purgecss = require('@fullhuman/postcss-purgecss')
const cssnano = require('cssnano')
const path = require('path')

const templatePath = path.resolve(__dirname, '..', 'web', 'templates/**/*.html')

module.exports = {
    darkMode: 'media',
    content: [templatePath],
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        cssnano({
            preset: 'default'
        }),
        purgecss({
            content: [templatePath],
            enabled: true,
        })
    ]
}