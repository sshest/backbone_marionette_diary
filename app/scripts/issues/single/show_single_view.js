define(["app", "syphon"], function(App) {
  App.module("ShowSingle.View", function(View, App, Backbone, Marionette, $, _){

    View.ShowSingle = Marionette.ItemView.extend({
      tagName: 'div',

      template: "#show",
      
      showOnMap: function(coordinates) {
          
          var coords = JSON.parse(this.model.get('coords'));

          var mapOptions = {
              center: new google.maps.LatLng(coords.A, coords.F),
              zoom: 8,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              draggable: false
          };
          var map = new google.maps.Map(document.getElementById("issuePlace"), mapOptions);

          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(coords.A, coords.F),
              map: map,
              title: 'Hello World!',
              draggable:false
          });
      },
      showPlayer: function() {
        var player, id, url = this.model.get('videoUrl');
        id = url.split('=')[1];
          player = new YT.Player('issueVideo', {
            width: '480',
            height: 'auto',
            videoId: id
          });
      }
    });
    App.commands.setHandler('show:single:heading', function(text) { 
      this.$(".title-h").text(text);
    });
  });
  return App.ShowSingle.View;
});

