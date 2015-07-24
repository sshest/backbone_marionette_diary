define(["app", "issues/list/list_view", "tablesorter"], function(App, View) {
    //модуль контроллера списка
    App.module("List", function(List, App, Backbone, Marionette, $, _){
        var Controller = Marionette.Controller.extend({
            //может принимать аргумент с данными (наименованием аттрибута и значение,
            //в этом случае контроллер произведет запрос записей аттрибуты которых
            //будут соответствовать указанному значению)
            listIssues: function(data) {
                require(["models/issue"], function() {
                    var attr, value;
                    if (data) {
                      attr = data.attr;
                      value  = data.val;
                    }
                    //если аргумент не пеередавался - выполняется запрос всех записей коллекции
                    var loadList = (attr && value)? App.request("issue:search", attr, value): App.request("issue:list");
                    var self = List.Controller;
                    //если запрос выполнен успешно -  
                    $.when(loadList).done(function(issues) {
                        //строится представление на основе ответа
                        //и отображается в регионе
                        var view  = new View.List({collection: issues});
                        App.mainRegion.show(view);
                        //данный обработчик добавляет вывод модального окна
                        //при нажатии на кнопку "удалить"
                        self.listenTo(view, 'childview:issue:remove', function(childView, data) {
                          $('#myModal').modal({
                            show: false,
                            backdrop: true,
                            keyboard: true,
                          });
                          $('#myModal').modal('show');
                          //при нажатии на кнопку с классом btn-primary в модальном окне
                          //модель удаляется из хранилища, коллекции, а также
                          //удаляется ее представление
                          $('#myModal').on('click', '.btn-primary', function(){
                            data.model.destroy();                         
                            childView.remove();
                            //после этого модальное окно прячется
                            $('#myModal').modal('hide');
                          });
                        });
                        //обработчик события 'childview:issue:edit' представления списка
                        self.listenTo(view, 'childview:issue:edit', function(childView, data) {
                        //тригерит на уровне приложения событие "issue:edit" с привязанным к нему идентификатором модели
                          App.trigger('issue:edit', data.model.get('id'));
                        });
                        //обработчик события 'childview:issue:show' представления списка
                        self.listenTo(view, 'childview:issue:show', function(childView, data) {
                          //тригерит на уровне приложения событие "issue:show" с привязанным к нему идентификатором модели
                          App.trigger('issue:show', data.model.get('id'));
                        });
                    }); 
                  });            
            }
        });
        List.Controller = new Controller();
    });

    return App.List.Controller;
});
