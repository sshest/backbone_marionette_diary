define(["app"], function(App) {
	//модуль представления карты
	App.module("Map.View", function(View, App, Backbone, Marionette, $, _){
		View.Map = Marionette.ItemView.extend({
			tagName:  'div',
			template: "#placesMap",
			//список производимых событий
			triggers: {
				'click .marker': 'issue:marker:title'
			}
		});

	});
	return App.Map.View.Map;
});
