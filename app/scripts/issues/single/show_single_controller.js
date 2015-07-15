define(["app", "issues/single/show_single_view", "googlemap", "youtube"], function(App, View) {
  App.module("Showsingle", function(Show, App, Backbone, Marionette, $, _){
    var Controller = Marionette.Controller.extend({
    	showIssue: function(id) {
        require(["models/issue"], function() {
            var loadIssue = App.request("issue:single", id);
            var self = Show.Controller;
            $.when(loadIssue).done(function(issue) {
              var view = new View.ShowSingle({model: issue});
              var shown = App.mainRegion.show(view);
              $.when(shown).done(function() {
                if (view.model.get('coords')!='') {
                  view.showOnMap();
                }
                if (view.model.get('videoId')!=''){
                  view.showPlayer();
                }
              });
              App.commands.execute('show:single:heading', view.model.get('issueTitle'));
            });
        });      
    	}
    });
    Show.Controller = new Controller();
    
  });
  return App.Showsingle.Controller;
});