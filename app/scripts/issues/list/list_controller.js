define(["app", "issues/list/list_view", "tablesorter"], function(App, View) {
    App.module("List", function(List, App, Backbone, Marionette, $, _){
        var Controller = Marionette.Controller.extend({
            listIssues: function(data) {
                require(["models/issue"], function() {
                    var attr, value;
                    if (data) {
                      attr = data.attr;
                      value  = data.val;
                    }
                    var loadList = (attr && value)? App.request("issue:search", attr, value): App.request("issue:list");
                    debugger;
                    var self = List.Controller;
                    $.when(loadList).done(function(issues) {
                        debugger;
                        var view  = new View.List({collection: issues});
                        App.mainRegion.show(view);
                        
                        self.listenTo(view, 'childview:issue:remove', function(childView, data) {
                          $('#myModal').modal({
                            show: false,
                            backdrop: true,
                            keyboard: true,
                          });
                          $('#myModal').modal('show');
                          $('#myModal').on('click', '.btn-primary', function(){
                            data.model.destroy();                         
                            childView.remove();
                            $('#myModal').modal('hide');
                          });
                        });

                        self.listenTo(view, 'childview:issue:edit', function(childView, data) {
                          App.trigger('issue:edit', data.model.get('id'));
                        });

                        self.listenTo(view, 'childview:issue:id:show', function(childView, data) {
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
