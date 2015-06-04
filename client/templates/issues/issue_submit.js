/*Template.issueSubmit.onCreated(function() {
  Session.set('issueSubmitErrors', {});
});*/

Template.issueSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('issueSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('issueSubmitErrors')[field] ? 'has-error' : '';
  },
  gps: function () {
    return Session.get("gps");
  }
});

Template.issueSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var issue = {
      gps: $(e.target).find('[name=gps]').val(),
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val()
    };
    
    var errors = validateIssue(issue);
    if (errors.title || errors.gps)
      return Session.set('issueSubmitErrors', errors);
    
    Meteor.call('issueInsert', issue, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.issueExists)
        throwError('This link has already been issueed');
      
      Router.go('issuePage', {_id: result._id});  
    });
  }
});

Template.issueSubmit.helpers({
  newIssueMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(-8.60, 115.21),
        zoom: 8
      };
    }
  }
});

/*Template.issueSubmit.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('newIssueMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});*/


Template.issueSubmit.onCreated(function() {
    
// copied from the top
Session.set('issueSubmitErrors', {});
    
  GoogleMaps.ready('newIssueMap', function(map) {
    google.maps.event.addListener(map.instance, 'click', function(event) {
//      Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
//      console.log('lat:' + event.latLng.lat() +' lng: ' + event.latLng.lng());
        Session.set('gps', event.latLng.lat() + ',' + event.latLng.lng());
        Template.issueSubmit.gps123 = function() {
            return Session.get('gps')
        };
    });

    var markers = {};      

    Markers.find().observe({  
      added: function(document) {
        // Create a marker for this document
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          // We store the document _id on the marker in order 
          // to update the document within the 'dragend' event below.
          id: document._id
        });

        // This listener lets us drag markers on the map and update their corresponding document.
        google.maps.event.addListener(marker, 'dragend', function(event) {
          Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
        });

        // Store this marker instance within the markers object.
        markers[document._id] = marker;
      },
      changed: function(newDocument, oldDocument) {
        markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
      },
      removed: function(oldDocument) {
        // Remove the marker from the map
        markers[oldDocument._id].setMap(null);

        // Clear the event listener
        google.maps.event.clearInstanceListeners(
          markers[oldDocument._id]);

        // Remove the reference to this marker instance
        delete markers[oldDocument._id];
      }
    });

  });
});