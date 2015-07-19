define(["app", "youtube", "googlemap"], function(App) {
	App.module("EditForm.View", function(View, App, Backbone, Marionette, $, _){
		//Базовое представление для создания и редактирования
		View.EditForm = Marionette.ItemView.extend({
			tagName: 'div',
			ui: {
				adress_input: '#adress-input',
				colpalette: '#colpalette',
				redactor: '#description'
			},

			events: {
				'submit form': 'submitClicked',
				'change input#videoUrl': 'showThumb',
				'click .palette-label': 'toggleColorPalette',
				'click input[type="checkbox"], #colpalette': 'styleApply',
				'change #font-size': 'styleApply'
			},

			template: "#edit",
			
			onShow: function() {
			 	var area = this.ui.redactor[0];
			 	area.contentWindow.document.designMode = "On";
			 	var attitude = this.model.get('attitude');
			 					debugger;
			 	var a = this.$('#selectAttitude').find("[value='" + attitude + "']");
			 	a.attr('selected', true);
			},
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
			showThumb: function() {
				var id = (this.$('#videoUrl').val()).split('=')[1],
					player = new YT.Player('videoThumbnail', {
						videoId: id

					});
			},
			submitClicked: function(ev) {
				ev.preventDefault();
				var data = {};
				var description = this.ui.redactor[0].contentWindow.document.body.innerHTML;
				if(this.$('#issueTitle').val()) {data.issueTitle = this.$('#issueTitle').val()}; 
				//if(this.$('#issueDescription').val()) {data.issueDescription = this.$('#issueDescription').val()};
				if(description) {
					data.issueDescription = description;
				}
				if(this.$('#selectAttitude').val()) {data.attitude = this.$('#selectAttitude').val()};
				if(this.$('#date').val()) {data.date = this.$('#date').val()};
				if(this.$('#videoUrl').val()) {data.videoUrl = this.$('#videoUrl').val()};
				if(this.$('#markerCoords').val()) {data.coords = this.$('#markerCoords').val()};

				this.trigger('form:submit', data);
			},
			
			setMarker: function(event) {
					var map = event.map || this;
					var marker, markers = map.markers;
					debugger;
					if (markers.length > 0) {
						marker = markers[0];
						marker.setPosition(event.latLng);
					} else {
						  marker = new google.maps.Marker({
							position: event.latLng,
							map: map,                            
							draggable: true
						});
						
						markers.push(marker);
					};
					map.panTo(marker.position);
					var markerCoords;
					function getMarkerCoords(ev) {
							markerCoords = JSON.stringify(ev.latLng);
							$('#markerCoords').val(markerCoords);
							debugger;
					};         
					

					getMarkerCoords(event);

					google.maps.event.addListener(marker, 'dragend', getMarkerCoords);
			}, 

			coordsByAddress: function(map, self) {
					return function(){debugger;
						var ev = arguments[0];
						
						if (ev.target.value.length < 3) return;
						var geocoder = new google.maps.Geocoder();
						var geoRequest = {
							address: self.ui.adress_input.val()
						};
						geocoder.geocode(geoRequest, function(result, status) {
							switch (status) {
								case "OK": 
									var location = result[0].geometry.location;
									var data = {latLng:location, map:map};
									//если есть еще маркеры на карте - удалить их
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

			showMap: function() {
					var lat, lon, latitude, longitude;
					
					navigator.geolocation.getCurrentPosition(function(pos) {
								
						latitude = pos.coords.latitude;
						longitude = pos.coords.longitude;
					});
					lat = latitude? latitude : 49.9945914; lon = longitude? longitude: 36.2858248;
					var mapOptions = {
						zoom: 10,
						center: new google.maps.LatLng(lat, lon),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var map = new google.maps.Map(document.getElementById("map"), mapOptions);
					map.markers = [];

					if (this.model.get('coords')) {
							
						var coords = JSON.parse(this.model.get('coords'));
												
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(coords.A, coords.F),
							map: map,                            
							draggable: true
						});
					} else {
						google.maps.event.addListenerOnce(map, 'click', this.setMarker);
					}
					google.maps.event.addDomListener(document.getElementById("adress-input"), 'keyup', this.coordsByAddress(map, this));

	
					return map;
			},

			

			onDataInvalid: function(errors) {
				this.$el.find('form .error').removeClass('error');
				this.$el.find('form .help-inline').text('');

				for(var i in errors) {
					var field = this.$('[name="' + i + '"]');
					field.parents('.control-group').addClass('error').find('.help-inline').text(errors[i]);
					//field.next().text(errors[i]);
				}
			}
		});
		

		App.commands.setHandler('show:heading', function(text) { 
			this.$(".title-h").text(text);
		});
	});
	return App.EditForm.View;
});

