define(["app"], function(App) {
	App.module("Map.View", function(View, App, Backbone, Marionette, $, _){
		View.Map = Marionette.ItemView.extend({
			tagName:  'div',
			template: "#placesMap",

			triggers: {
				'click .marker': 'issue:marker:title'
			}
		});

	});
	return App.Map.View.Map;
});
