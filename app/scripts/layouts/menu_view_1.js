define(["app"], function(App) {
    App.module("Menu.View", function(View, App, Backbone, Marionette, $, _){
        View.Menu = Marionette.ItemView.extend({
            tagName: 'div',
            ui: {
              input: '#search'
            },

            events: {
              'click #list': 'listClicked',
              'click #add': 'addClicked',
              'click #onMap': 'onMapClicked',
              'keypress #search': 'onSearchKeypressed'
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
            },
            onSearchKeypressed: function(ev) {
              
              var searchText = this.ui.input.val().trim();
              if (ev.which === 13 && searchText) {
                App.trigger("issues:list", {"attr":"issueTitle", "val":searchText});
                this.ui.input.val('');
              }
            }
            
        });

    });
    return App.Menu.View;
});