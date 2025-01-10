const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

// const avif = require("gulp-avif");
// const webp = require("gulp-webp");
// const imagemin = require("gulp-imagemin");
const newer = require('gulp-newer'); //--чистка кэша
const svgSprite = require('gulp-svg-sprite');
//const autoprefixer = require("gulp-autoprefixer");

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

//----- картинки
// function images() {
//   return src([
//     'app/assets/img/*.*', '!app/assets/img/svg/*.svg'
//   ])
//     .pipe(newer('app/assets/img/dist'))
//     .pipe(avif({quality: 50}))

//     .pipe(src('app/assets/img/*.*'))
//     .pipe(newer('app/assets/img/dist'))
//     .pipe(webp())

//     .pipe(src('app/assets/img/*.*'))
//     .pipe(newer('app/assets/img/dist'))
//     .pipe(imagemin())

//     .pipe(dest('app/assets/img/dist'))
// }

function sprite() {
  return src('app/assets/dist/*.svg');
}

//----шрифты
function fonts() {
  return src('app/assets/fonts')
    .pipe(fonter({
        formats: ['woff', 'ttf ']
      }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .piipe(dest('app/assets/fonts'));
}

//---- стили
function styles() {
  return (
    src('app/assets/style/style.scss')
      //.pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] }))
      .pipe(concat('style.min.css'))
      .pipe(scss({ outputStyle: 'compressed' }))
      .pipe(dest('app/assets/style'))
      .pipe(browserSync.stream())
  );
}

//---- scripts
function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/assets/js/*.js',
    '!app/assets/js/main.min.js',
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/assets/js'))
    .pipe(browserSync.stream());
}

function watching() {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
  watch(['app/assets/style/style.scss'], styles);
  //watch(["app/assets/img"], images);
  watch(['app/assets/js/main.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
  //   watch(["app/**/*.html"]).on('change'. browserSync.reload); если html имеет несколько вложений, он все перероет
}

function cleanDist() {
  return src('dist').pipe(clean());
}

function building() {
  return src(
    [
      'app/assets/style/style.min.css',
      'app/assets/js/main.min.js',
      'app/assets/img/dist/*.*',
      'app/**/*.html',
    ],
    { base: 'app' }
  ).pipe(dest('dist'));
}

exports.styles = styles;
exports.fonts = fonts;
exports.scripts = scripts;
//exports.images = images;
exports.sprite = sprite;

exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, watching);
