define(["app", "issues/edit/edit_view"], function(App, View) {
  App.module("Edit", function(Edit, App, Backbone, Marionette, $, _){
    var Controller = Marionette.Controller.extend({
    	editIssue: function(id) {
        require(["models/issue"], function() {
            var loadIssue = App.request("issue:single", id);
            var self = Edit.Controller;

            $.when(loadIssue).done(function(issue) {
              var view = new View.EditForm({model: issue});
              var shown = App.mainRegion.show(view);
              
              $.when(shown).done(function() {
                view.showMap();
                document.getElementById('description').contentDocument.body.innerHTML = issue.get('issueDescription');
              });
          
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
                  view.triggerMethod('data:invalid', issue.validationError); 
                }
              });
            });
        });      
    	}
    });
    Edit.Controller = new Controller();
    App.commands.execute('show:heading', 'Редактирование записи');
  });
  return App.Edit.Controller;
});