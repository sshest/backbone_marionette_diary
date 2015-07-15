define(["app", "issues/map/map_view"], function(App, View) {
    App.module("Map", function(Map, App, Backbone, Marionette, $, _){
        var Controller = Marionette.Controller.extend({
            
            showMap: function() {
                require(["models/issue", "googlemap"], function() {
                                        
                    App.mainRegion.empty();

                    var loadList = App.request("issue:list");
                    var self = Map.Controller;
                    $.when(loadList).done(function(issues) {
                                            
                      var view  = new View ({collection: issues});
                      App.mainRegion.show(view);
                      App.commands.execute('menu-refresh', 'aMap');
                      
                      var mapOptions = {
                          center: new google.maps.LatLng(49.9945914, 36.2858248),
                          zoom: 8,
                          mapTypeId: google.maps.MapTypeId.ROADMAP
                      };
                      var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

                      var latlngbounds = new google.maps.LatLngBounds();
                      var events = view.collection.models;
                      _.each(events, function(issue) {
                        
                          if (issue.get('coords') != '') {
                              var coords = JSON.parse(issue.get('coords'));
                              
                              var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(coords.A, coords.F),
                                map: map,                            
                                draggable: false,
                                modelId: issue.get('id')
                              });
                              
                              var data_title = issue.get('issueTitle');
                              var infowindow = new google.maps.InfoWindow({
                                  content: data_title
                              });
                              
                              google.maps.event.addListener(marker, 'click', function() {
                                  App.trigger('issue:show', this.get('modelId'));
                              });
                              google.maps.event.addListener(marker, 'mouseover', function() {
                                      
                                      infowindow.open(map, marker);
                              });
                              google.maps.event.addListener(marker, 'mouseout', function() {
                                      infowindow.close();
                              });
                              latlngbounds.extend(marker.position);
                          }
                      });
                      map.setCenter( latlngbounds.getCenter(), map.fitBounds(latlngbounds));
                    });  
                });
            }
        });
        Map.Controller = new Controller();
    });

    return App.Map.Controller;
});
