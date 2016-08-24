/**
 * Created by claudio on 25/08/16.
 */
var Elixir = require('laravel-elixir');
var Gulp = require('gulp');

var Print = require('gulp-print');
var Plumber = require('gulp-plumber');

var imagesSaver = require('./gulp');

var Task = Elixir.Task;

Elixir.extend('jsonImagesSaver', function (src, pipe, options)
{
    new Task('jsonImagesSaver', function ()
    {
        return Gulp
            .src(src)
            .pipe(Print())
            .pipe(Plumber())
            .pipe(imagesSaver(options))
            .pipe(pipe)
            .pipe(Print());
    }).watch(src);
});
//TODO notify