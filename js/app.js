var map;
var actualMarkers = ko.observableArray([]);
var filter;
var filteredArray = ko.observableArray([]);
var notFilteredArray = ko.observableArray([]);
var mapsLoaded = false;

var initialLocations = [
	{
		name: 'Santa Cruz',
		position: {
			lat: 43.350570,
			lng: -8.346710
		},
		info: 'Santa Cruz Info'
	},
	{
		name: 'Santa Cristina',
		position:{
			lat: 43.340583,
			lng: -8.381279
		},
		info: 'Santa Cristina Info'
	},
	{
		name: 'Torre de Hércules',
		position: {
			lat: 43.38620,
			lng: -8.406444
		},
		info: 'Torre de Hércules Info'
	},
	{
		name: 'María Pita',
		position:{
			lat: 43.371566,
			lng: -8.395897
		},
		info: 'María Pita Info'
	},
	{
		name: 'Catedral de Santiago de Compostela',
		position: {
			lat: 42.880590,
			lng: -8.544680
		},
		info: 'Catedral Info'
	}
];

function Location(data, activate, marker){
	this.name = data.name;
	this.position = data.position;
	this.info = data.info;
	this.active = activate;
	this.animate = false;
	this.marker = marker;
}

function initMap() {
	var self = this;
	mapsLoaded = true;
    // Constructor creates a new Google map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.350570, lng: -8.346710},
        zoom: 13
    });
    var bounds = new google.maps.LatLngBounds();
    this.initialLocations.forEach(function(markItem){
    	var marker = new google.maps.Marker({
    		position: markItem.position,
			animation: google.maps.Animation.DROP,
    		map: map,
    		title: markItem.name
    	})
    	bounds.extend(marker.getPosition());
    	actualMarkers.push(new Location(markItem, true, marker));

    	// Add Click event to map marker
    	marker.addListener('click', function() {
				var self = this;
				ko.utils.arrayForEach(filteredArray(), function(item) {
					if (item.animate){
						item.animate = false;
						item.marker.setAnimation(null);
					}else{
						if (item.name == marker.title)
						{
							item.animate = true;
							marker.setAnimation(google.maps.Animation.BOUNCE);
						}
					}
				});

				// Construct the url for get wiki info searching by title
				var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
					+ markItem.name +
					'&format=json&callback=wikiCallback';
				self.infoWindowLoaded = false;
				setTimeout(function() {
					if(!self.infowindowLoaded) {
						//Map doesn't loaded
						var infowindow = new google.maps.InfoWindow({
							content: 'Error loading Wikipedia info'
							});
			            infowindow.open(map, marker);
					}
				}, 5000);
			    $.ajax( {
			        url: wikiUrl,
			        dataType: 'jsonp',
			        success: function(response) {
			            var wikiTitles = response[1];
			            var wikiLinks = response[3];
			            var wikiInfo = response[2];
			            var infoToShow = '';
			            for (var i = 0; i < wikiTitles.length; i++){
			                var wikiTitle = wikiTitles[i];
			                infoToShow += '<li class="article">' +
			                    '<a href="' + wikiLinks[i] + '">'+ wikiTitle +'</a>' +
			                    '<p>' + wikiInfo[i] + '</p>'
			                    + '</li>';
			            };
			            infoToShow += '<p class="article"> Information from Wikipedia</p>'
			            var infowindow = new google.maps.InfoWindow({
							content: infoToShow
							});
			            infowindow.open(map, marker);
			            self.infowindowLoaded = true;
			        },
			        error: function(xhr, textStatus, errorThrown){
			        	var infowindow = new google.maps.InfoWindow({
							content: "Error loading Wikipedia data"
							});
			            infowindow.open(map, marker);
			            self.infowindowLoaded = true;
			        }
			    } );

		  	});
    });
    // Fit the map to marks
    map.fitBounds(bounds);
    refreshMapMarks();
}

function errorLoadingGoogleMaps(){
	$('#map').text('Error loading google maps error');
}

function refreshMapMarks(){
	var self = this;

	// Hide markers not filtered
	ko.utils.arrayFilter(this.notFiletredArray(),function(markItem){
		if (markItem.active){
			markItem.marker.setMap(null);
			markItem.active = false;
		}
	});

	var bounds = new google.maps.LatLngBounds();
	// Show the filtered markers to the map
	ko.utils.arrayForEach(filteredArray(), function(item) {
		if (!item.active){
			item.active = true;
			item.marker.setMap(map);
			bounds.extend(item.marker.getPosition());
		}
	});
};

var ViewModel = function(){
	var self = this;

	this.filter = ko.observable('');

	this.setFilter = function(){
		refreshMapMarks();
		return true;
	};

	// Markers to be active
	filteredArray = ko.computed(function(){
		if(!self.filter()) {
            return actualMarkers();
        } else {
            return ko.utils.arrayFilter(actualMarkers(), function(mark) {
                return mark.name.indexOf(self.filter()) > -1;
            });
        }
	});

	// Markers to be hidden
	notFiletredArray = ko.computed(function(){
        return ko.utils.arrayFilter(actualMarkers(), function(mark) {
            return mark.name.indexOf(self.filter()) <= -1;
        });
	});


	init = function(){
		refreshMapMarks();
	};

	nameClick = function(clicked){
		ko.utils.arrayFilter(actualMarkers(),function(markItem){
			if (markItem.name == clicked.name)
			{
				// Rise marker event
				google.maps.event.trigger(markItem.marker, 'click');
			}
		});
	};
}

ko.applyBindings(new ViewModel());
//loadScript();