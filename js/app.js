var map;

function initMap() {
        // Constructor creates a new map - only center and zoom are required.
    console.log('hi');
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });
}


var ViewModel = function(){
	var self = this;
}

ko.applyBindings(new ViewModel());