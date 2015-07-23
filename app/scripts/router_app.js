define(["app"], function(App) {
	App.module("DiaryApp", function(DiaryApp, App, Backbone, Marionette, $, _){
	  
	  DiaryApp.Router = Marionette.AppRouter.extend({
	    //список роутов
	    appRoutes: {
	      "":               "drawMenu",
	      "list":          "listIssues",
	       "issue/:id/edit": "editIssue",
	       "issue/new":      "addIssue",
	       "issue/:id": 	"showIssue",
	       "places": 		"showMap", 
	    }
	  });
	  //API, содержашщий функционал роутера 
	  var API = {
	  	drawMenu: function() {
	  		require(["layouts/menu_controller"], function(controller) {
	  			controller.drawMenu();
	  		});
	  	},

	    listIssues: function(data){
	     	require(["issues/list/list_controller", "layouts/menu_controller"], function(listController, menuController) {
	     	 	menuController.drawMenu();
	     	 	listController.listIssues(data);
	      	});	
	    },

	    editIssue: function(id){
	       	require(["issues/edit/edit_controller", "layouts/menu_controller"], function(editController, menuController) {
	     	 	menuController.drawMenu();
	     	 	editController.editIssue(id);
	      	});
	    },
	    addIssue: function() {
	      	require(["issues/edit/new_controller", "layouts/menu_controller"], function(addController, menuController) {
	     	 	menuController.drawMenu();
	     	 	addController.addIssue();
	      	});
	    },
	    showIssue: function(id){
	    	require(["issues/single/show_single_controller", "layouts/menu_controller"], function(showController, menuController) {
	     		menuController.drawMenu();
	     		showController.showIssue(id);
	      	});
	    },
	    showMap: function() {
	      	require(["issues/map/map_controller", "layouts/menu_controller"], function(mapController, menuController) {
	     	 	menuController.drawMenu();
	     	 	mapController.showMap();
	     	});
	  	}
	  };

	  //Слушатели событий, изменяющие состояния приложения
	  this.listenTo(App, 'menu:start', function() {  		
	  	Backbone.history.navigate('');
	  	API.drawMenu();
	  });

	  this.listenTo(App, 'issue:show', function(id) {  		
	  	Backbone.history.navigate('/issue/' + id);
	  	API.showIssue(id);
	  });

	  this.listenTo(App, 'issues:map', function() {  		
	  	Backbone.history.navigate('/places');
	  	API.showMap();
	  });

	  this.listenTo(App, 'issues:list', function(data) {  		
	  	Backbone.history.navigate('/list');
	  	API.listIssues(data);
	  });

	  this.listenTo(App, 'issue:edit', function(id) { 		
	  	Backbone.history.navigate('/issue/' + id + '/edit');
	  	API.editIssue(id);
	  });

	  this.listenTo(App, 'issue:new', function() { 			
	    Backbone.history.navigate('/issue/new');
	    API.addIssue();
	  });

	  App.addInitializer(function(){
	    new DiaryApp.Router({
	      controller: API
	    });
	  });
	});
	return App.DiaryApp.Router;
});
