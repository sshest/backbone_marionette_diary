define(["app", "tpl!apps/scripts/templates/map.tpl"], function(App, MapTpl) {
	//модуль представления карты
	App.module("Map.View", function(View, App, Backbone, Marionette, $, _){
		View.Map = Marionette.ItemView.extend({
			tagName:  'div',
			template: MapTpl,
			//список генерируемых событий
			triggers: {
				'click .marker': 'issue:marker:title'
			}
		});

	});
	return App.Map.View.Map;
});
