module.exports = function(grunt) {
    grunt.initConfig({
        // JS TASKS ================================================================
        webpack: {
            mqtt: {
                entry: './node_modules/mqtt/mqtt.js',
                output: {
                    path: 'public/dist/js/',
                    filename: 'browserMqtt.js',
                    library: 'mqtt'
                },
                progress: false,
            },
        },

        // check all js files for errors
        jshint: {
            all: ['public/src/js/**/*.js']
        },

        // take all the js files and minify them into app.min.js
        uglify: {
            build: {
                files: {
                    'public/dist/js/app.min.js': ['public/src/js/**/*.js', 'public/src/js/*.js'],
                    'public/dist/js/browserMqtt.min.js': 'public/dist/js/browserMqtt.js'
                }
            }
        },

        // CSS TASKS ===============================================================
        // process the less file to style.css
        less: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'public/dist/css/style.css': 'public/src/css/style.less'
                }
            }
        },

        // take the processed style.css file and minify
        cssmin: {
            build: {
                files: {
                    'public/dist/css/style.min.css': 'public/dist/css/style.css'
                }
            }
        },

        // COOL TASKS ==============================================================
        // watch css and js files and process the above tasks
        watch: {
            css: {
                files: ['public/src/css/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: ['public/src/js/**/*.js', 'public/src/js/*.js'],
                tasks: ['jshint', 'uglify']
            }
        },

        // watch our node server for changes
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },

        // run watch and nodemon at the same time
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['less', 'cssmin', 'webpack', 'jshint', 'uglify', 'concurrent']);
};