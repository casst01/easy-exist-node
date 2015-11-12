module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jasmine_nodejs: {
      options: {
        specNameSuffix: 'spec.js',
        stopOnFailure: false,
        reporters: {
          console: {
            colors: true,
            cleanStack: 1,
            verbosity: 3,
            listStyle: "indent",
          }
        }
      },
      your_target: {
        specs: [
          'spec/**/*.js'
        ]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      js: [
        './lib/**/*.js',
        './spec/**/*.js'
      ],
    }

  });

  grunt.loadNpmTasks('grunt-jasmine-nodejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jasmine_nodejs']);
  grunt.registerTask('hint', ['jshint']);

};