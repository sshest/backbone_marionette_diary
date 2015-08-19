define(["app", "issues/edit/edit_view"], function(App, View) {
  //Модуль контроллера редактирования записи о событии
  App.module("Edit", function(Edit, App, Backbone, Marionette, $, _){
    var Controller = Marionette.Controller.extend({
    	editIssue: function(id) {
        require(["models/issue"], function() {
            //запрос одной модели по id
            var loadIssue = App.request("issue:single", id);
            var self = Edit.Controller;

            $.when(loadIssue).done(function(issue) {
              //после загрузки единичной записи создаем вью-редактирования
              //передав во вью данную запись как модель
              var view = new View.EditForm({model: issue});
              //и отображаем вью в главном регионе
              var shown = App.mainRegion.show(view);
              //после отображения вью - создаем карту, хотя
              //правильнее бы это делать во вью, а не в контроллере
              $.when(shown).done(function() {
                view.showMap();
              });
          
              self.listenTo(view, 'form:submit', function(data) {
                //при событии отправки формы - сохраняем запись
                var saving = issue.save(data);
                if(saving) {
                  $.when(saving).done(function() {
                    //после успешного сохранения - тригеррим событие для роутера
                    //чтобы отобразить список событий
                    App.trigger('issues:list');
                  }).fail(function(response) {
                    throw error('Saving failed');//Ошибка - событие и сообщение для отладки
                    console.log(response);
                  });
                } else {
                  //модель не сохраняется, если не проходит валидацию
                  //запускаем метод обработки события об ошибке, а также передаем ему
                  //объект с сообщениями об ошибках
                  view.triggerMethod('data:invalid', issue.validationError); 
                }
              });
            });
            //выполняем комманду показа заголовка страницы (его приходится менять, т.к.
            //используется одно вью на два процесса - создание и редактирование)
            App.commands.execute('show:heading', 'Редактирование записи');
        });      
    	}
    });
    Edit.Controller = new Controller();
  });
  return App.Edit.Controller;
});