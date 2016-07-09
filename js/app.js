var map;

var initialLocations = [
	{
		name: 'Santa Cruz',
		position: {
			lat: 43.350570,
			lng: -8.346710
		}
	},
	{
		name: 'Santa Cristina',
		position:{
			lat: 43.340583,
			lng: -8.381279
		}
	},
	{
		name: 'Torre de Hércules',
		position: {
			lat: 43.38620,
			lng: -8.406444
		}
	},
	{
		name: 'María Pita',
		position:{
			lat: 43.371566,
			lng: -8.395897
		}
	},
	{
		name: 'Catedral de Santiago de Compostela',
		position: {
			lat: 42.880590,
			lng: -8.544680
		}
	}
];

function initMap() {
        // Constructor creates a new map - only center and zoom are required.
    console.log('hi');
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.350570, lng: -8.346710},
        zoom: 13
    });

    var santaCruz = {lat: 43.350570, lng: -8.346710};
    initialLocations.forEach(function(markItem){
    	var marker = new google.maps.Marker({
    		position: markItem.position,
    		map: map,
    		title: markItem.name
    	})
    });
}


var ViewModel = function(){
	var self = this;
}

ko.applyBindings(new ViewModel());