var map;
var markersList;
var actualMarkers = [];
var filter;

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

function Location(data){
	this.name = ko.observable(data.name);
	this.position = ko.observable(data.position);
	this.info = ko.observable(data.info);
}

function initMap() {
	var self = this;
    // Constructor creates a new Google map
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.350570, lng: -8.346710},
        zoom: 13
    });
    var bounds = new google.maps.LatLngBounds();
    this.initialLocations.forEach(function(markItem){
    	var marker = new google.maps.Marker({
    		position: markItem.position,
    		map: map,
    		title: markItem.name
    	})
    	bounds.extend(marker.getPosition());
    	self.actualMarkers.push(marker);
    });
    // Fit the map to marks
    map.fitBounds(bounds);

}

var ViewModel = function(){
	var self = this;

	this.filter = ko.observable('');
	this.markersList = ko.observableArray([]);

	initialLocations.forEach(function(locationItem)
	{
		self.markersList.push( new Location(locationItem) );

	});

	this.setFilter = function(){
		// no needed for now
		refreshMapMarks();
	};

	this.filteredArray = ko.computed(function(){
		if(!self.filter()) {
            return self.markersList();
        } else {
            return ko.utils.arrayFilter(self.markersList(), function(mark) {
                return mark.name().indexOf(self.filter()) > -1;
            });
        }
	});

	init = function(){
		refreshMapMarks();
	};

	nameClick = function(clicked){
		console.log(self.actualMarkers);
		self.actualMarkers.forEach(function(markItem){
			if (markItem.title == clicked.name())
			{
				// Rise marker event
				google.maps.event.trigger(markItem, 'click');
			}
		});
	};

	refreshMapMarks = function(){
		// Delete Actual Markers from map
		this.actualMarkers.forEach(function(markItem){
			markItem.setMap(null);
		});
		self.actualMarkers = [];
		var bounds = new google.maps.LatLngBounds();

		// Add the filtered markers to the map
		ko.utils.arrayForEach(self.filteredArray(), function(item) {
			var marker = new google.maps.Marker({
	    		position: item.position(),
	    		map: map,
	    		title: item.name()
	    		});

    		bounds.extend(marker.getPosition());

    		marker.addListener('click', function() {
    			var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
    				+ item.name() +
    				'&format=json&callback=wikiCallback';
			    $.ajax( {
			        url: wikiUrl,
			        dataType: 'jsonp',
			        success: function(response) {
			           // do something with data
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
			            var infowindow = new google.maps.InfoWindow({
    						content: infoToShow
  						});
			            infowindow.open(map, marker);
			        }
			    } );

		  	});

    		self.actualMarkers.push(marker);
    	});
    	// Fit the map to marks
    	map.fitBounds(bounds);
	};
}


ko.applyBindings(new ViewModel());