/* eslint-disable */

const gulp = require('gulp');
const {
  series,
  lastRun,
  watch
} = require('gulp');
const fs = require('fs');
const prettyHtml = require('gulp-html-beautify');
const mergeStream = require('merge-stream');
const sass = require('gulp-dart-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const autoPrefixer = require('gulp-autoprefixer');
const devServer = require('browser-sync').create();

const paths = {
  src: (path = '') => {
    return './src/' + path;
  },
  srcDist: (path = '') => {
    return './dist/' + path;
  }
};

/**
 * dist 폴더 정리
 */
const cleanDir = () => {
  return new Promise(res => {
    fs.rmdirSync(paths.srcDist(), {
      recursive: true
    });
    res();
  });
};

/**
 * 이미지 폴더 정리
 */
const cleanImages = () => {
  return new Promise(res => {
    fs.rmdirSync(paths.srcDist('/resources/images'), {
      recursive: true
    });
    res();
  });
};

/**
 * js 폴더 정리
 */
const cleanJs = () => {
  return new Promise(res => {
    fs.rmdirSync(paths.srcDist('/resources/js'), {
      recursive: true
    });
    res();
  });
};

/**
 * include 처리 된 HTML 생성
 */
const toHTML = () => {
  return gulp
    .src(paths.src('**/*.html'), {
      since: lastRun(toHTML)
    })
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@root',
      })
    )
    .pipe(gulp.dest(paths.srcDist()))
    .pipe(devServer.stream());
};

/**
 * include의 파일이 변경됐을 때 작업영역의 html 전부 리로드
 */
const toHTMLAll = () => {
  return gulp
    .src(paths.src('html/*.html'))
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@root',
      })
    )
    .pipe(gulp.dest(paths.srcDist('html')))
    .pipe(devServer.stream());
};

/**
 * HTML 코드 프리티어 적용
 */
const prettyHTML = () => {
  const options = {
    indentSize: 4
  };
  return gulp
    .src(paths.srcDist('**/*.html'))
    .pipe(prettyHtml(options))
    .pipe(gulp.dest(paths.srcDist()));
};

/**
 * 리소스 파일 복사(dist 폴더)
 */
const copyAssets = () => {
  const fonts = gulp
    .src(paths.src('resources/fonts/**'))
    .pipe(gulp.dest(paths.srcDist('resources/fonts')));
  const images = gulp
    .src(paths.src('/resources/images/**'))
    .pipe(gulp.dest(paths.srcDist('resources/images')));
  const js = gulp.src(paths.src('resources/js/**')).pipe(gulp.dest(paths.srcDist('resources/js')));
  return mergeStream(fonts, images, js);
};

/**
 * 이미지 통째로 복사(dist)
 */
const copyImages = () => {
  return gulp
    .src(paths.src('resources/images/**'))
    .pipe(gulp.dest(paths.srcDist('resources/images')))
    .pipe(devServer.stream());
};

/**
 * js 통째로 복사(dist)
 */
const copyJs = () => {
  return gulp
    .src(paths.src('resources/js/**'))
    .pipe(gulp.dest(paths.srcDist('resources/js')))
    .pipe(devServer.stream());
};

/**
 * scss 컴파일
 */
const compileScss = () => {
  return gulp
    .src(paths.src('resources/scss/**/*.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoPrefixer())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.srcDist('resources/css')))
    .pipe(devServer.stream());
};

// 개발모드 실행시 처음에 기본적으로 실행 될 task 
const devStartFunctions = series(cleanDir, toHTML, prettyHTML, compileScss, copyAssets);

/**
 * 빌드 task 들을 순차적으로 실행한다.
 */
exports.build = series(cleanDir, toHTML, prettyHTML, compileScss, copyAssets);

/**
 * 개발서버 시작
 */
exports.dev = async function () {
  devServer.init({
    server: {
      baseDir: paths.srcDist()
    },
    port: 4001,
    notify: false
  });

  devStartFunctions();

  // _includes 변경 감시
  watch(paths.src('_includes/*.md'), series(toHTMLAll, prettyHTML));
  // html 변경 감시
  watch(paths.src('**/*.html'), series(toHTML, prettyHTML));
  // scss 파일 변경 감시
  watch(paths.src('resources/scss/**/*.scss'), series(compileScss));
  // 이미지 변경 감시
  watch(paths.src('resources/images'), series(cleanImages, copyImages));
  // 자바스크립트 파일 변경 감시
  watch(paths.src('resources/js'), series(cleanJs, copyJs));
};