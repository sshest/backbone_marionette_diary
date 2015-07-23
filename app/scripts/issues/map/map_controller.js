define(["app", "issues/map/map_view"], function(App, View) {
    //модуль контроллера карты
    App.module("Map", function(Map, App, Backbone, Marionette, $, _){
        var Controller = Marionette.Controller.extend({
            
            showMap: function() {
                require(["models/issue", "googlemap"], function() {
                    //на всяк случай очищаем регион                    
                    App.mainRegion.empty();
                    //получаем через request/response список событий
                    var loadList = App.request("issue:list");
                    var self = Map.Controller;
                    $.when(loadList).done(function(issues) {
                      //когда список получен - строим на его основе представление
                      var view  = new View ({collection: issues});
                      //и отображаем в регионе
                      App.mainRegion.show(view);
                      //опции для гугл-карты
                      var mapOptions = {
                          center: new google.maps.LatLng(49.9945914, 36.2858248),
                          zoom: 8,
                          mapTypeId: google.maps.MapTypeId.ROADMAP
                      };
                      //строим новую карту 
                      var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
                      //полычаем новый экземпляр области карты LatLngBounds
                      var latlngbounds = new google.maps.LatLngBounds();
                      var events = view.collection.models;
                      _.each(events, function(issue) {
                        //для каждой модели коллекции проверяем,
                        //если она хранит непустое значение координат события
                          if (issue.get('coords') != '') {
                              //преобразуем координаты в объект
                              var coords = JSON.parse(issue.get('coords'));
                              //создаем маркер с этими координатами
                              var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(coords.A, coords.F),
                                map: map,                            
                                draggable: false,
                                //создаем свойство в маркере для хранения идентификатора своего объекта 
                                modelId: issue.get('id')
                              });
                              
                              var data_title = issue.get('issueTitle');
                              //получаем новый экземпляр информ.окна API google maps
                              var infowindow = new google.maps.InfoWindow({
                                  content: data_title
                              });
                              //обработчик клика на маркере, который триггерит событие "issue:show"
                              //для показа содержавния определенной записи о событии
                              google.maps.event.addListener(marker, 'click', function() {
                                  App.trigger('issue:show', this.get('modelId'));
                              });
                              //обработчик наведения указателя мыши на маркер
                              google.maps.event.addListener(marker, 'mouseover', function() {
                                  //показывает информационное окно - в окне выводится название события   
                                  infowindow.open(map, marker);
                              });
                              //обработчик события выхода указателя мыши с маркера
                              google.maps.event.addListener(marker, 'mouseout', function() {
                                  //убирает информационное окно
                                  infowindow.close();
                              });
                              //при каждом добавлении маркера область latlngbounds расширяется
                              //так, чтобы внутри ее содержался и данный маркер
                              latlngbounds.extend(marker.position);
                          }
                      });
                      //после отображения всех маркеров карта центруется по центру области latlngbounds
                      //ее масштаб меняется так, чтобы полностью отображать область с маркерами 
                      map.setCenter( latlngbounds.getCenter(), map.fitBounds(latlngbounds));
                    });  
                });
            }
        });
        Map.Controller = new Controller();
    });

    return App.Map.Controller;
});
