define(["app", "issues/edit/edit_view"], function(App, View) {
  App.module("Create", function(Create, App, Backbone, Marionette, $, _){
    var Controller = Marionette.Controller.extend({
      addIssue: function() {
        require(["models/issue"], function() {
            //создаем новую модель и вью создания записи на ее основе
            var issue = new App.Models.Issue();
            var view = new View.EditForm({model: issue});
            //ссылка на контроллер
            var self = Create.Controller;
            //отображаем вью в главном регионе
            App.mainRegion.show(view);
            //после отображения вью - создаем карту с той же оговоркой, что и при редактировании
            var map = view.showMap();

            self.listenTo(view, 'form:submit', function(data) {
                //при событии отправки формы - сохраняем запись
                var saving = issue.save(data);
                //после успешного сохранения - тригеррим событие для роутера
                //чтобы отобразить список событий
                if(saving) {
                    $.when(saving).done(function() {
                        App.trigger('issues:list');
                    }).fail(function(response) {
                        throw error('Saving failed');//Ошибка - событие и сообщение для отладки
                        console.log(response);
                    });
                } else {
                    //Вызываем событие "data:invalid" с объектом-коллекцией ошибок
                    view.triggerMethod('data:invalid', issue.validationError);
                }
            });
            //выполняем комманду показа заголовка страницы (его приходится менять, т.к.
            //используется одно вью на два процесса - создание и редактирование)
            App.commands.execute('show:heading', 'Создание новой записи');
        });        
      }
    });
    Create.Controller = new Controller();
  });
  return App.Create.Controller;
});
