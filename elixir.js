/**
 * Created by claudio on 25/08/16.
 */
var Elixir = require('laravel-elixir');
var Gulp = require('gulp');

var Print = require('gulp-print');
var Plumber = require('gulp-plumber');

var imageSaver = require('./gulp');

var Task = Elixir.Task;

Elixir.extend('jsonImageSaver', function (src, pipe, options)
{
    new Task('jsonImageSaver', function ()
    {
        return Gulp
            .src(src)
            .pipe(Print())
            .pipe(Plumber())
            .pipe(imageSaver(options))
            .pipe(pipe)
            .pipe(Print());
    }).watch(src);
});
//TODO notify