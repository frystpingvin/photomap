// This is where it all goes :)
var map;

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('photomap'), {
    center: {lat: 59.911491, lng: 10.757933},
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    rotateControl: false,
    zoom: 7
  });
  map.addListener('click', hideImage);
  map.addListener('drag', hideImage);
}

var apiCall   = 'https://api.flickr.com/services/rest/?method=flickr.photos.getWithGeoData&api_key=8ee1397e332c04f76981c9000befad6a&format=json&nojsoncallback=1&auth_token=72157676598877756-abf3fd6d5247e12d&api_sig=e91fc6039e9942533336658338bd7431',
    photos    = [],
    body      = $('body'),
    photoEl   = $('#photoinfo'),
    photoOpen = false;

var getPhotos = function(callback) {
  $.when(
    $.getJSON(apiCall, function(data) {
      data = data;
    })
  ).then(function(data) {
    var photosLength = data.photos.photo.length;

    $.each(data.photos.photo, function(i, photoData) {
      var photo = {};

      photo.farm   = photoData.farm;
      photo.id     = photoData.id;
      photo.secret = photoData.secret;
      photo.server = photoData.server;

      $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=8ee1397e332c04f76981c9000befad6a&photo_id=' + photo.id + '&format=json&nojsoncallback=1', function(data) {
        console.log(data);
        photo.latitude  = data.photo.location.latitude;
        photo.longitude = data.photo.location.longitude;
        photos.push(photo);

        if (photos.length == photosLength) {
          console.log('callback');
          callback(photos);
        }
      });

    });

  }).fail(function() {
    console.log('error');
  });
};

getPhotos(function(photos) {
  if (photos) {
    $.each(photos, function(i, photo) {
      var latitude    = photo.latitude;
      var longitude   = photo.longitude;
      var thumbnail   = '//farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_t.jpg';
      var image       = '//farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_h.jpg';
      var latLng      = new google.maps.LatLng(latitude, longitude);
      var marker      = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: thumbnail
      });
      marker.addListener('click', function() {
        showImage(image, marker.getPosition(), map.getBounds());
      });
    });
  }
});

var showImage = function(photo, markerPosition, mapBounds) {
  var mapBoundNorth = mapBounds.getNorthEast().lat();
  var mapBoundSouth = mapBounds.getSouthWest().lat();
  var markerLat     = markerPosition.lat();
  var latitude      = markerLat - ((mapBoundNorth - mapBoundSouth) * 0.25);
  var longitude     = markerPosition.lng();
  map.panTo({lat: latitude, lng: longitude});

  if (photoOpen) {
    photoEl.empty();
  } else {
    body.attr('id', 'do-show-photo');
    photoOpen = true;
  }

  photoEl.append('<img src="' + photo + '">');
};

var hideImage = function() {
  if (photoOpen) {
    console.log('hide image');
    body.removeAttr('id', 'do-show-photo');
    photoEl.empty();
  }
  photoOpen = false;
}
