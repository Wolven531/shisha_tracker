module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Technically everything inside of jasmine_node is 100% useless,
     * but it is required for the plugin to run the specs properly. Also,
     * 'src' can be any value. What an odd plugin.
     */
    jasmine_node: {
      src : '.'
      /*
      options: {
        specFolders: [],
        projectRoot: '', 
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      }
      */
    },

    apidoc: {
      myapp: {
        src: 'controllers/',
        dest: 'docs/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-apidoc');

  grunt.registerTask('docs', ['apidoc']);
  grunt.registerTask('test', ['jasmine_node']);
  // Default task(s).
  grunt.registerTask('default', ['test']);

};