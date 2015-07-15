define(["app"], function(App) {
    App.module("Menu.View", function(View, App, Backbone, Marionette, $, _){
        View.Menu = Marionette.ItemView.extend({
            tagName: 'div',

            events: {
              'click #list': 'listClicked',
              'click #add': 'addClicked',
              'click #onMap': 'onMapClicked'
            },
            
            template: '#menu',

            listClicked: function(ev) {
              ev.preventDefault();
              this.trigger('menu:list');
            },
            addClicked: function(ev) {
              ev.preventDefault();
              this.trigger('menu:new');
            },
            onMapClicked: function(ev) {
              ev.preventDefault();
              this.trigger('menu:map');
            }
            
        });

    });
    return App.Menu.View;
});