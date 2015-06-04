Template.map.helpers({
  issueMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        zoom: 9,
        center: new google.maps.LatLng(-8.60, 115.21),
//        center: new google.maps.LatLng(37.774546, -122.433523),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false
      };
    }
  }
});

Template.map.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('issueMap', function(issueMap) {
    // Add a marker to the map once it's ready
    /*var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });*/
    
      //var issueArray;

      
   
      
        //var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        

    var issueData = [
      new google.maps.LatLng(37.782551, -122.445368),
      new google.maps.LatLng(37.782745, -122.444586),
      new google.maps.LatLng(37.751266, -122.403355)
    ];       
      
      //console.log(map);
      
      var issueArray = new google.maps.MVCArray(issueData);
      
       var heatMapLayer = new google.maps.visualization.HeatmapLayer({
            data: issueArray,
            radius: 20
        });
      
    heatMapLayer.setMap(issueMap.instance);
      
/*   Enable user location detection more info here - http://www.w3schools.com/html/html5_geolocation.asp
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position){
    var latlon = position.coords.latitude + "," + position.coords.longitude;
      console.log(latlon);
    }
*/

      
    /*issues.observe({
        added: function (doc) {
        issueArray.push(new google.maps.LatLng(doc.Geolocation.Latitude, 
        doc.Geolocation.Longitude));
        // Add code to refresh heat map with the updated airportArray
        }
    });*/
      
  });
});