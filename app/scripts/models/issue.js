define(["app", "backbone", "localstorage"], function(App) { 							
	App.module("Models", function(Models, App, Backbone, Marionette, $, _){
		//создаем локальное хранилище для хранения данных модели и коллекции
		issueStorage = new Backbone.LocalStorage('issues');
		//начало описание модели
		Models.Issue = Backbone.Model.extend({
			urlRoot: '/issue',
			localStorage: issueStorage,
			//значения модели по умолчанию
			defaults: {
				issueTitle: '',
				issueDescription: '',
				attitude: '',
				date: '',
				videoUrl: '',
				coords: ''
			},
			//метод, добавлющий уникальный идентификатор модели при ее создании
			//путем присвоения ему значения текущего времени в мс
			initialize: function() {
				if(this.isNew()) this.set('id', Date.now());
			},
			
			//валидация проводится средствами плагина Backbone.Validation
			validation: {
				issueTitle: {
					//значение - обязательное
					required: true,
					//критерий валидации
					minLength: 3,
					//сообщение при непрохождении валидации
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
			}
		});//конец описания модели

		//начало описания коллекции
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
		          		defer.resolve(data);
		        	}
		    	});
		    	//возвращаем промис объекта Deffered с данными коллекции
		    	//promise используется, чтобы иметь возможность отслеживать его состояние,
		    	//меняющееся асинхронно
		    	return defer.promise();
			},

		    //Получение одной записи по id
		    getIssue: function(Id){
		    	
		        var issue = new Models.Issue({id: Id});
		        var defer = $.Deferred();
		        issue.fetch({
			  	    success: function(data){
			          	defer.resolve(data);
			    	},
			      	error: function(data){
			        	defer.resolve(data);
			        	console.log('Single issue load error');
			      	}
		        });
		      	return defer.promise();
		    },
		    //Получение списка записей по атрибуту, соответствующему переданному значению
		    //функция принимает название атрибута и значение для проверки
		    getByAttrib: function(attr, value) { 
		    	var found, collection = API.getAllIssues();
		    	//использование Deffered-объекта позволяет применять конструкцию 
		    	//when ... done для обеспечения синхронного выполнения кода
		    	$.when(collection).done(function(issues) {
			    	var pattern = new RegExp(value);
			    	found = issues.filter(function(issue) {
			    		//возвращает только модели, соответствующие критерию
			    		return pattern.test(issue.get(attr));
					});
				});
				//возвращает отфильтрованную коллекцию
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
