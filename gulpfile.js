const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
// const autoprefixer = require("gulp-autoprefixer");

// const pug = require("gulp-pug");

// exports.views = () => {
//   return src("./src/*.pug")
//     .pipe(
//       pug({
//         // Your options in here.
//       })
//     )
//     .pipe(dest("./dist"));
// };

//---- стили
function styles() {
  return src("app/assets/style/style.scss")
    // .pipe(autoprefixer({ overrideBrowsersList: ["last 10 version"] }))
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("app/assets/style"))
    .pipe(browserSync.stream());
}

//---- scripts
function scripts() {
  return src(["node_modules/swiper/swiper-bundle.js", "app/assets/js/*.js", '!app/assets/js/main.min.js'])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/assets/js"))
    .pipe(browserSync.stream());
}


function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function watching() {
  watch(["app/assets/style/style.scss"], styles);
  watch(["app/assets/js/main.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
  //   watch(["app/**/*.html"]).on('change'. browserSync.reload); если html имеет несколько вложений, он все перероет
}

function cleanDist() {
  return src('dist')
    .pipe(clean())
}

function building() {
    return src([
        'app/assets/style/style.min.css',
        'app/assets/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}


exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;


exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersync, watching);