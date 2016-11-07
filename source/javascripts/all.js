// This is where it all goes :)
function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('photomap'), {
    center: {lat: 59.911491, lng: 10.757933},
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    rotateControl: false,
    zoom: 7
  });
}

(function () {
  var igApi      = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=41682531.1677ed0.0345e6d7b61142afab3a948804bafcdc&count=33&callback=?',
      igData,
      igDataArr  = [];

  var instagramData;



  var getIgPhotosLocation = function(api, data, array) {
    $.when(
      $.getJSON(api, function(jsonData) {
        data = jsonData;
      })
    ).then(function () {
      if (data) {
        if (data.pagination) {
          console.log(data.pagination.next_url);
        }

        $.each(data.data, function(i, photoData) {
          if (photoData.location) {
            createPhotoObjectToArr(photoData, array);
          }
        });
      } else {
        console.log('there was an error collecting data');
      }
    });
  };



  var createPhotoObjectToArr = function(data, array) {
    var photoObject = {};
    photoObject.id = data.id;
    photoObject.latitude = data.location.latitude;
    photoObject.longitude = data.location.longitude;
    photoObject.locationName = data.location.name;
    array.push(photoObject);
  };

  getIgPhotosLocation(igApi, igData, igDataArr);
}());
