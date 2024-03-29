const Encore = require('@symfony/webpack-encore');

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.css)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/js/app.js')      //main
    .addEntry('qr', './assets/js/qr.js')        //Mijn Strippenkaart
    .addEntry('scan', './assets/js/scan.js')    //Verwerk Strippenkaart

    .addEntry("select2js", './node_modules/select2/dist/js/select2.js')

    //.addEntry('page1', './assets/js/page1.js')
    //.addEntry('page2', './assets/js/page2.js')
    .addStyleEntry('Bulma', './assets/css/Sass-SCSS/bulmaStyles.scss')
    .addStyleEntry("style", './assets/css/app.css')

    .addStyleEntry("select2css", './node_modules/select2/dist/css/select2.css')

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

// uncomment if you use TypeScript
//.enableTypeScriptLoader()

// uncomment if you use Sass/SCSS files
.enableSassLoader()

// uncomment if you're having problems with a jQuery plugin
.autoProvidejQuery()
;

module.exports = {

}
module.exports = Encore.getWebpackConfig();