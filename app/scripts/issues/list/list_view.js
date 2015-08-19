define(["app",
		"tpl!apps/scripts/templates/list.tpl",
		"tpl!apps/scripts/templates/issue.tpl",
		"tpl!apps/scripts/templates/empty.tpl"], function(App, ListTpl, IssueTpl, EmptyTpl) {
	App.module("View", function(View, App, Backbone, Marionette, $, _){
		//представление отдельной модели для отображения во вью коллекции
		View.Issue = Marionette.ItemView.extend({
			tagName:  'tr',
			template: IssueTpl,
			//события, создаваемые представлением
			triggers: {
				//удалить
				'click .remove': 'issue:remove',
				//редактировать
				'click .edit':   'issue:edit',
				//показать
				'click': 'issue:show'
			}
		});
		//это представление используется, если в коллекции нет моделей для отображения
		View.Empty = Marionette.ItemView.extend({
			tagName: 'tr',
			className: 'emptylist',
			template: EmptyTpl
		});
		//представление списка событий, в нем содержатся ссылки на представления - потомки
		//и пустое представление (в случае отсутствия в коллекции моделей)
		View.List = Marionette.CompositeView.extend({
			tagName:   'div',
			className: 'row t',
			template:  ListTpl,

			childView: View.Issue,

			childViewContainer: 'tbody',

			emptyView: View.Empty,

            onBeforeShow: function(view) {
            	//делаем таблицу сортируемой с помощью плагина tablesorter
            	view.$('.table').tablesorter({});
            }
		});
	});
	return App.View;
});
