module.exports = function(grunt) {
    grunt.initConfig({
        // JS TASKS ================================================================
        browserify: {
            dist: {
                files: {
                    'public/dist/js/bundle.js': ['node_modules/mqtt/mqtt.js']
                },
                options: {
                    browserifyOptions: {
                        standalone: 'mqtt'
                    }
                }
            }
        },

        copy: {
            main: {
            }
        },

        // check all js files for errors
        jshint: {
            options: {
                "esversion": 6
            },
            all: ['Gruntfile.js', 'server.js', 'public/src/js/**/*.js', 'public/src/activity/js/**/*.js', 'app/**/*.js']
        },

        // take all the js files and minify them into app.min.js
        uglify: {
            // options: {
            //     mangle: false
            // },
            // build: {
            //     files: {
            //         'public/dist/js/app.min.js': ['public/src/js/**/*.js', 'public/src/js/*.js'],
            //         'public/dist/js/bundle.min.js': 'public/dist/js/bundle.js'
            //     }
            // },
            build: {
                files: [
                {
                    'public/dist/js/app.min.js': ['public/src/js/**/*.js', 'public/src/js/*.js'],
                    'public/dist/js/bundle.min.js': 'public/dist/js/bundle.js'
                },
                {
                    cwd: 'public/src/activity/js/',
                    src: ['*.js', '**/*.js'],
                    dest: 'public/dist/js', // destination folder
                    expand: true,  // allow dynamic building
                    flatten: true, // remove all unnecessary nesting
                    ext: '.min.js' // replace .js to .min.js
                }]
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
                files: ['public/src/**/*.js'],
                tasks: ['jshint', 'browserify', 'uglify']
            }
        },

        // watch our node server for changes
        nodemon: {
            dev: {
                script: 'server.js',
            },
            mqttTest: {
                script: 'server.js',
                options: {
                    args: ['--nohttp']
                }
            }
        },

        // run watch and nodemon at the same time
        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['nodemon', 'watch']
            },
            mqttTest: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['nodemon:mqttTest', 'watch']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['less', 'cssmin', 'copy', 'browserify', 'jshint', 'uglify', 'concurrent']);
    grunt.registerTask('mqttTest', ['less', 'cssmin', 'copy', 'browserify', 'jshint', 'uglify', 'concurrent:mqttTest']);
};