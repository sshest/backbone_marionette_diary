define(["app", "backbone", "localstorage"], function(App) { 							
	App.module("Models", function(Models, App, Backbone, Marionette, $, _){
		
		issueStorage = new Backbone.LocalStorage('issues');

		Models.Issue = Backbone.Model.extend({
			urlRoot: '/issue',
			localStorage: issueStorage,

			defaults: {
				issueTitle: '',
				issueDescription: '',
				attitude: '',
				date: '',
				videoUrl: '',
				coords: ''
			},
			initialize: function() {
				if(this.isNew()) this.set('id', Date.now());
			},
			

			validation: {
				issueTitle: {
					required: true,
					minLength: 3,
					msg: "Данное поле должно содержать минимум 3 символа"
				},
				issueDescription: {
					required: true,
					minLength: 10,
					msg: "Данное поле должно содержать минимум 10 символов"
				},
				date: {
					required: true,
					msg: "Данное поле должно быть заполнено"
				},
				videoUrl: {
					required: false,
					pattern: 'url',
					msg: "Некорректно введен url"
				}
			},
			isMatch: function(reg, attrib) {
				return reg.test(this.get(attrib));
			}
		});

		Models.IssueCollection = Backbone.Collection.extend({
			model: Models.Issue,
			url: '/list',
			localStorage: issueStorage
		});

		var API = {
			//Получение всех записей
		    getAllIssues: function(){
		        var issues = new Models.IssueCollection();
		        var defer = $.Deferred();
		        issues.fetch({
		        	success: function(data){
		          		debugger;
		          		defer.resolve(data);
		        	}
		    	});
		    	return defer.promise();
			},

		    //Получение одной записи по id
		    getIssue: function(Id){
		    	debugger;
		        var issue = new Models.Issue({id: Id});
		        var defer = $.Deferred();
		        issue.fetch({
			  	    success: function(data){
			  	    	debugger;
			          	defer.resolve(data);
			    	},
			      	error: function(data){
			      		debugger;
			        	defer.resolve(data);
			        	console.log('Single issue load error');
			      	}
		        });
		      	return defer.promise();
		    },
		    //Получение списка записей по атрибуту, соответствующему переданному значению
		    getByAttrib: function(attr, value) { 
		    	var found, collection = API.getAllIssues();
		    	$.when(collection).done(function(issues) {
			    	var pattern = new RegExp(value);
			    	found = issues.filter(function(issue) {
			    		return pattern.test(issue.get(attr));
					});
				});
				return new Models.IssueCollection(found);
		    }
		};

	    //Устанавливаем обработчики на запрос по получению пользователей (всех, одного, по фильтру названия)
		App.reqres.setHandler("issue:list", function(){
		    return API.getAllIssues();
		});
		App.reqres.setHandler("issue:single", function(id){
			return API.getIssue(id);
		});
		App.reqres.setHandler('issue:search', function(attr, value){
			return API.getByAttrib(attr, value);
		});
	});
});
