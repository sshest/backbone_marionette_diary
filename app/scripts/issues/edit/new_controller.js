define(["app", "issues/edit/edit_view"], function(App, View) {
  App.module("Create", function(Create, App, Backbone, Marionette, $, _){
    var Controller = Marionette.Controller.extend({
      addIssue: function() {
        require(["models/issue"], function() {
            var issue = new App.Models.Issue();
            var view = new View.EditForm({model: issue});
            var self = Create.Controller;
                App.mainRegion.show(view);
                var map = view.showMap();

                self.listenTo(view, 'form:submit', function(data) {
                    var saving = issue.save(data);
                    
                    if(saving) {
                        $.when(saving).done(function() {
                            App.trigger('issues:list');
                        }).fail(function(response) {
                            throw error('Saving failed');//Ошибка
                        console.log(response);
                        });
                    } else {
                        //Вызываем события "data:invalid" с объектом-коллекцией ошибок
                        view.triggerMethod('data:invalid', issue.validationError);
                    }
                });
        });        
      }
    });
    Create.Controller = new Controller();
    App.commands.execute('show:heading', 'Создание новой записи');
  });
  return App.Create.Controller;
});
