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
    }
  });

  // Load the plugin that provides the 'jasmine_node' task.
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', ['jasmine_node']);
  // Default task(s).
  grunt.registerTask('default', ['test']);

};