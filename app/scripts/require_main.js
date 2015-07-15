requirejs.config({
  baseUrl: "app/scripts",
  paths: {
    backbone: "vendor/backbone-amd/backbone",
    jquery: "vendor/jquery",
    localstorage: "vendor/backbone.localstorage",
    marionette: "vendor/backbone.marionette",
    text: "vendor/text",
    tpl: "vendor/underscore-tpl",
    underscore: "vendor/underscore-amd/underscore",
    bootstrap: "vendor/bootstrap.min",
    validation: "vendor/backbone-validation",
    syphon: "vendor/backbone.syphon",
    async: "vendor/requirejs-plugins/src/async",
    youtube: "vendor/youtube-iframe-api/youtube.iframe-api",
    googlemap: "vendor/requirejs-google-maps/dist/GoogleMap",
    tablesorter: "vendor/bower_components/tablesorter/jquery.tablesorter"
  },

  shim: {
    
    marionette: {
      deps: ["backbone"],
      exports: "Marionette"
    },
    bootstrap: ["jquery"],
    localstorage: {
      deps: ['backbone'],
      exports: 'Store'
    },
    tpl: ["text"],
    validation: ["backbone"],
    syphon: ["backbone"],
    youtube: {
      exports: "YT"
    }
  }
});

//Точка входа в приложение
require(["app"], function(App){
  App.start();
});