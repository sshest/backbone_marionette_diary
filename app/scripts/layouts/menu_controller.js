define(["app", "layouts/menu_view"], function(App, View) {
    //Модуль, описывающий контроллер меню
    App.module("Menu", function(Menu, App, Backbone, Marionette, $, _){
        var Controller = Marionette.Controller.extend({
            drawMenu: function() {
                var self = Menu.Controller;
                //проверяем, содержит ли регион заголовка вью
                //если нет, а это происходит при смене состояния приложения
                //создаем вью и показываем его в регионе 
                if (!App.headerRegion.hasView()){
                    var view  = new View.Menu();
                    App.headerRegion.show(view);
                    //слушаем события во вью
                    //и триггерим события для обработки роутером
                    self.listenTo(view, 'menu:list', function() {
                        App.trigger('issues:list');
                    });

                    self.listenTo(view, 'menu:new', function() {
                      App.trigger('issue:new');
                    });

                    self.listenTo(view, 'menu:map', function() {
                      App.trigger('issues:map');
                    });
                }    
                //отображаем "стартовую страницу", очищая при этом 
                //главный регион    
                if (window.location.hash === ""){
                    App.mainRegion.empty();
                    $('#main-wrapper').html('<div><h2>Приветствую Вас в Дневнике 0.0.1., моем первом одностраничном приложении, <br/>предназначеном для хранения самых ярких Ваших переживаниях.</h2></div>');
                }   
            }
          
        });
        Menu.Controller = new Controller();
        
    });
    return App.Menu.Controller;
});