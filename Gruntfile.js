module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                expand: true,
                cwd: './src/scss/',
                src: ['*.scss'],
                dest: './target/css/',
                ext: '.css'
            },
            dev: {
                options: {
                    style: 'expanded',
                    debugInfo: false,
                    lineNumbers: false
                },
                expand: true,
                cwd: './src/scss/',
                src: ['*.scss'],
                dest: './src/css/',
                ext: '.css'
            }
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', 'sass:dev');
};
