define(["app"], function(App) {
	App.module("View", function(View, App, Backbone, Marionette, $, _){
		View.Issue = Marionette.ItemView.extend({
			tagName:  'tr',
			template: "#issue",

			triggers: {
				'click .remove': 'issue:remove',
				'click .edit':   'issue:edit',
				'click'/* .title*/: 'issue:id:show'
			}
		});

		View.Empty = Marionette.ItemView.extend({
			tagName: 'tr',
			className: 'emptylist',
			template: "#empty"
		});

		View.List = Marionette.CompositeView.extend({
			tagName:   'div',
			className: 'row t',
			template:  "#listTemplate",
			// ui: {
   //            input: '#search'
   //          },
            // events: {
            //   'keypress #search': 'onSearchKeypressed'
            // },

			childView: View.Issue,

			childViewContainer: 'tbody',

			emptyView: View.Empty,
			// onSearchKeypressed: function(ev) {
   //            var searchText = this.ui.input.val().trim();
   //            if (ev.which === 13 && searchText) {
   //              App.trigger("issues:list", {"attr":"issueTitle", "val":searchText});
   //              this.ui.input.val('');
   //            }
   //            ev.stopPropagation();
   //          },
            onBeforeShow: function(view) {
            	view.$('.table').tablesorter({});
            }
		});
	});
	return App.View;
});
