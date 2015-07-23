define(["app", "syphon"], function(App) {
  //модуль представления содержимого отдельной записи о событии
  App.module("ShowSingle.View", function(View, App, Backbone, Marionette, $, _){

    View.ShowSingle = Marionette.ItemView.extend({
      tagName: 'div',
      //шаблон представления
      template: "#show",
      //метод отображения карты и маркера
      showOnMap: function(coordinates) {
          //распарсить координаты модели
          var coords = JSON.parse(this.model.get('coords'));
          //опции карты
          var mapOptions = {
              center: new google.maps.LatLng(coords.A, coords.F),
              zoom: 8,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              draggable: false
          };
          //создаем и отображаем экземпляр карты
          var map = new google.maps.Map(document.getElementById("issuePlace"), mapOptions);
          //создаем маркер
          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(coords.A, coords.F),
              map: map,
              title: 'Hello World!',
              draggable:false
          });
      },
      showPlayer: function() {
        var player, id, url = this.model.get('videoUrl');
        //получаем из URL идентицикатор видео
        id = url.split('=')[1];
          //создем новый экземпляр плеера - передаем ему идентификатор видео 
          player = new YT.Player('issueVideo', {
            width: '480',
            height: 'auto',
            videoId: id
          });
      }
    });
    //устанавливаем команду при возникновении события "show:single:heading"
    App.commands.setHandler('show:single:heading', function(text) { 
      this.$(".title-h").text(text);
    });
  });
  return App.ShowSingle.View;
});

