define(["app", "issues/single/show_single_view", "googlemap", "youtube"], function(App, View) {
  //модуль контроллера представления отображения содержания отдельной записи о событии
  App.module("Showsingle", function(Show, App, Backbone, Marionette, $, _){
    var Controller = Marionette.Controller.extend({
    	showIssue: function(id) {
        require(["models/issue"], function() {
            //запрос модели по id
            var loadIssue = App.request("issue:single", id);
            //после получения модели
            $.when(loadIssue).done(function(issue) {
              //создаем экземпляр модели и отображаем
              var view = new View.ShowSingle({model: issue});
              var shown = App.mainRegion.show(view);
              //после отображения
              $.when(shown).done(function() {
                //если в модели хранятся координаты - представление должно показать маркер на карте
                if (view.model.get('coords')!='') {
                  view.showOnMap();
                }
                //если в модели есть url видео - отображаем плеер youtube
                if (view.model.get('videoId')!=''){
                  view.showPlayer();
                }
              });
              //выполняем команду, связанную с событием 'show:single:heading', с ней передается навзвание
              //события для отображения в заголовке
              App.commands.execute('show:single:heading', view.model.get('issueTitle'));
            });
        });      
    	}
    });
    Show.Controller = new Controller();
    
  });
  return App.Showsingle.Controller;
});