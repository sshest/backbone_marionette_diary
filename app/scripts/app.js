define(["marionette", "bootstrap", "vendor/ValidationModel"], function(Marionette) {
	//Создание объекта приложения
	var App = new Marionette.Application();
	//Объявление регионов
	App.addRegions({
		'headerRegion': '#menu-wrapper',
		'mainRegion': '#main-wrapper'
	});
	//запуск роутера
	App.on("start", function(){
	  require(["router_app"], function() {
		  if(Backbone.history){
		    Backbone.history.start();
		  }
	  });	 
	});

	return App;
});
