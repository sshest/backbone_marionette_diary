define(["app", "tpl!templates/menu.tpl"], function(App, MenuTpl) {
    App.module("DiaryApp.Menu.View", function(View, App, Backbone, Marionette, $, _){
        View.Menu = Marionette.ItemView.extend({
            tagName: 'div',

            events: {
              'click #list': 'listClicked',
              'click #add': 'addClicked',
              'click #onMap': 'onMapClicked',
              'keypress #search': 'onSearchKeypressed'
            },
            
            ui: {
              input: '#search'
            },
            
            template: MenuTpl,

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
                App.vent.trigger('menu:search', 'issueTitle', searchText);
              }
            }
        });

        App.commands.setHandler('menu:refresh', function(id) { 
            if (id === 'list') {
              this.ui.input.parent().show();
            } else {
              this.ui.input.parent().hide(); // нужно ли обернуть в $ this.ui.input?
            }
            this.$('a').removeAttr('href');
            this.$("li").not("[id === '" + id + "']").children("a").attr('href', '#');
            
        });
    });
    return App.DiaryApp.Menu.View;
});