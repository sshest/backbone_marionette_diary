define(["app", "youtube", "googlemap", "syphon",
	"tpl!apps/scripts/templates/edit-form-view.tpl"], function(App, EditTpl) {
	App.module("EditForm.View", function(View, App, Backbone, Marionette, $, _){
		//Базовое представление для создания и редактирования
		View.EditForm = Marionette.ItemView.extend({
			tagName: 'div',
			ui: {
				adress_input: '#adress-input',
				colpalette: '#colpalette',
				redactor: '#description',
				preview: '#videoThumbnail'
			},
            //список обрабатываемых ДОМ-событий
			events: {
				'submit form': 'submitClicked',
				'change input#videoUrl': 'showThumb',
				'click .palette-label': 'toggleColorPalette',
				'click input[type="checkbox"], #colpalette': 'styleApply',
				'change #font-size': 'styleApply'
			},
			//шаблон для представления
			template: EditTpl,
			//метод, запускающийся после отображения представления
			//переключает iframe в редактируемый режим
			onShow: function() {
			 	var area = this.ui.redactor[0];
			 	area.contentWindow.document.designMode = "On";
			 	var description = this.model.get('issueDescription');
			 	area.contentDocument.body.innerHTML = description;
			 	//выбираем опцию селекта, исходя из значения свойства attitude модели
			 	var attitude = this.model.get('attitude');
			 	this.$('#selectAttitude').find("[value='" + attitude + "']").attr('selected', true);
			 	//если поле id модели не пустое, то отображаем превью видео с youtube
			 	var id = (this.$('#videoUrl').val()).split('=')[1];
			 	if (id) {
			 		this.ui.preview.find('img').attr('src', 'https://img.youtube.com/vi/'+id+'/mqdefault.jpg');
			 	}
			},
			//метод показывающий/скрывающий палитру цветов для выделения текста
			toggleColorPalette: function(ev) {
					var colpalette = document.getElementById("colpalette");
				    if(colpalette.className.indexOf('hidden') != -1) {
						colpalette.className = colpalette.className.replace(/hidden/, '');
				    } else if (colpalette.className.length === 0) {
							colpalette.className = 'hidden';
							} else {
								colpalette.className += ' hidden';
							}
					return false;
			},
			//метод, применяющий стили форматирования к тексту
			styleApply: function(ev) {
				
				var area = document.getElementById("description"), text = area.contentWindow.document.body.innerHTML;
	
				var target = ev.target||ev.srcElement;
				
				if (target.name === 'i' || target.name === 'b' || target.name === 'u') {
					area.contentWindow.document.execCommand(target.value, false, null);
				}
				if (ev.currentTarget.id === 'colpalette'){
					area.contentWindow.document.execCommand('ForeColor', false, target.value);
				}
				if (target.id === 'font-size') {
					area.contentWindow.document.execCommand('fontSize', false, target.value);
				}
			},
			//метод, отображающий превью при изменении поля с адресом видео
			showThumb: function(ev) {
				var id = $(ev.target).val().split('=')[1];
				this.ui.preview.find('img').attr('src', 'https://img.youtube.com/vi/'+id+'/mqdefault.jpg');
			},
			//обработчик отправки формы
			//задача - собрать значения полей в объект и передать его вместе с событием контроллеру
			submitClicked: function(ev) {
				ev.preventDefault();
				// var data = {};
				// var description = this.ui.redactor[0].contentWindow.document.body.innerHTML;
				// if(this.$('#issueTitle').val()) {data.issueTitle = this.$('#issueTitle').val()}; 
				// //if(this.$('#issueDescription').val()) {data.issueDescription = this.$('#issueDescription').val()};
				// if(description) {
				// 	data.issueDescription = description;
				// }
				// if(this.$('#selectAttitude').val()) {data.attitude = this.$('#selectAttitude').val()};
				// if(this.$('#date').val()) {data.date = this.$('#date').val()};
				// if(this.$('#videoUrl').val()) {data.videoUrl = this.$('#videoUrl').val()};
				// if(this.$('#markerCoords').val()) {data.coords = this.$('#markerCoords').val()};
				var description = this.ui.redactor[0].contentWindow.document.body.innerHTML;
				this.$el.find('#issueDescription').val(description);
				var data = Backbone.Syphon.serialize(this);
				this.trigger('form:submit', data);
			},
			//метод позволяющий установить маркер на карте
			//может вызываться как при клике на карте (тогда ему передается событие клика),
			//при вводе в поисковой строке текста,
			//при отображении представления редактирования 
			setMarker: function(event) {
					var map = event.map || this.map || this;
					var marker, markers = map.markers;
					//если карта уже содержит массив маркеров, то помещается первый в место события
					//таким образом не создается второго и т.д. маркера, мы лишь перемещаем единственный
					if (markers.length > 0) {
						marker = markers[0];
						marker.setPosition(event.latLng);
						//иначе - создается новый маркер
					} else {
						  marker = new google.maps.Marker({
							position: event.latLng,
							map: map,                            
							draggable: true
						});
						
						markers.push(marker);
					};
					//после этого карта центрируется по маркеру
					map.panTo(marker.position);
					function getMarkerCoords(ev) {
						var	markerCoords = JSON.stringify(ev.latLng);
							$('#markerCoords').val(markerCoords);
					};         
					//записываем преобразованные в JSON координаты маркера в скрытое поле ввода
					getMarkerCoords(event);
					//добавляем как обработчик события перетаскивания маркера функцию getMarkerCoords
					//для сохранения новый координат маркера 
					google.maps.event.addListener(marker, 'dragend', getMarkerCoords);
			}, 
			//метод, запускающий поиск с помощью google Geocoder API
			//запускается при возникновении события поднятия клавиши 
			coordsByAddress: function(map, self) {
					return function(){
						var ev = arguments[0];
						//поиск производится при длине введенной строки не менее 3 символов
						if (ev.target.value.length < 3) return;
						var geocoder = new google.maps.Geocoder();
						var geoRequest = {
							address: self.ui.adress_input.val()
						};
						//отправляем запрос - если статус ответа - "ОК",
						//тогда из ответа определяем координаты первого совпадения
						//и запускаем метод установки на карту маркера
						//в иных случаях можно выводить соответствующее информационное сообщение
						geocoder.geocode(geoRequest, function(result, status) {
							switch (status) {
								case "OK": 
									var location = result[0].geometry.location;
									var data = {latLng:location, map:map};
									self.setMarker(data);
								 	break;
								case 'ZERO_RESULTS':
									//рядом вывести надпись Адрес не найден
									break;
								case 'UNKNOWN_ERROR':
									// рядом вывести надпись Ошибка сервера, попробуйте снова
									break;
								default:
									//надпись - Невозможно выполнить запрос
									break;
							};
						});
					};
			},
			//отображение гугл-карты в представлении
			showMap: function() {
					var lat, lon, latitude, longitude;
					//если есть возможность получить координаты текущего положения пользователя
					//то используем их как центр карты
					navigator.geolocation.getCurrentPosition(function(pos) {
								
						latitude = pos.coords.latitude;
						longitude = pos.coords.longitude;
					});
					//если нет - центр зададим статично (Харьков)
					lat = latitude? latitude : 49.9945914; lon = longitude? longitude: 36.2858248;
					var mapOptions = {
						zoom: 10,
						center: new google.maps.LatLng(lat, lon),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var map = new google.maps.Map(document.getElementById("map"), mapOptions);
					map.markers = [];
					//если в модели содержатся координаты
					if (this.model.get('coords')) {
						//распарсим их и 	
						var coords = JSON.parse(this.model.get('coords'));
						//по этим координатам установим маркер						
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(coords.A, coords.F),
							map: map,                            
							draggable: true
						});
						//добавим слушателя на завершение перетаскивания маркера
						google.maps.event.addListener(marker, 'dragend', this.setMarker);
					} else {
						//если нет координат в модели, добавляем слушателя клика по карте, который создаст
						//в месте клика маркер
						google.maps.event.addListenerOnce(map, 'click', this.setMarker);
					}
					//добавляем слушеталя клика в поисковой строке для поиска
					//с помощью Goecoder
					google.maps.event.addDomListener(document.getElementById("adress-input"), 'keyup', this.coordsByAddress(map, this));
					//возвращаем карту, т.к. в моем случае метод используется контроллером и ему необходима ссылка на карту
					return map;
			},
			//если после валидации имеются сообщения об ошибках
			//он будут выведены в следующих за ними вспомогательных элементах
			onDataInvalid: function(errors) {
				//убираем предыдущие сообщения об ошибках и классы
				this.$el.find('form .error').removeClass('error');
				this.$el.find('form .help-inline').text('');
				//перебор всех сообщений об ошибках и вывод их эл-тах с классом "help-inline"
				//имеющих общего родителя с полем, не прошедшим валидацию
				for(var i in errors) {
					var field = this.$('[name="' + i + '"]');
					field.parents('.control-group').addClass('error').find('.help-inline').text(errors[i]);
				}
			}
		});
		//создаем комманду выводящую в заголовке представления текст
		//контроллер передаст сюда название события
		App.commands.setHandler('show:heading', function(text) { 
			this.$(".title-h").text(text);
		});
	});
	return App.EditForm.View;
});