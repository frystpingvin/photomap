function initMap(){map=new google.maps.Map(document.getElementById("photomap"),{center:{lat:59.911491,lng:10.757933},zoomControl:!1,streetViewControl:!1,mapTypeControl:!1,rotateControl:!1,zoom:7}),map.addListener("click",hideImage),map.addListener("drag",hideImage)}var map,apiCall="https://api.flickr.com/services/rest/?method=flickr.photos.getWithGeoData&api_key=8ee1397e332c04f76981c9000befad6a&format=json&nojsoncallback=1&auth_token=72157676598877756-abf3fd6d5247e12d&api_sig=e91fc6039e9942533336658338bd7431",photos=[],body=$("body"),photoEl=$("#photoinfo"),photoOpen=!1,getPhotos=function(o){$.when($.getJSON(apiCall,function(o){o=o})).then(function(t){var e=t.photos.photo.length;$.each(t.photos.photo,function(t,a){var n={};n.farm=a.farm,n.id=a.id,n.secret=a.secret,n.server=a.server,$.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=8ee1397e332c04f76981c9000befad6a&photo_id="+n.id+"&format=json&nojsoncallback=1",function(t){console.log(t),n.latitude=t.photo.location.latitude,n.longitude=t.photo.location.longitude,photos.push(n),photos.length==e&&(console.log("callback"),o(photos))})})}).fail(function(){console.log("error")})};getPhotos(function(o){o&&$.each(o,function(o,t){var e=t.latitude,a=t.longitude,n="//farm"+t.farm+".staticflickr.com/"+t.server+"/"+t.id+"_"+t.secret+"_t.jpg",i="//farm"+t.farm+".staticflickr.com/"+t.server+"/"+t.id+"_"+t.secret+"_h.jpg",p=new google.maps.LatLng(e,a),c=new google.maps.Marker({position:p,map:map,icon:n});c.addListener("click",function(){showImage(i,c.getPosition(),map.getBounds())})})});var showImage=function(o,t,e){var a=e.getNorthEast().lat(),n=e.getSouthWest().lat(),i=t.lat(),p=i-.25*(a-n),c=t.lng();map.panTo({lat:p,lng:c}),photoOpen?photoEl.empty():(body.attr("id","do-show-photo"),photoOpen=!0),photoEl.append('<img src="'+o+'">')},hideImage=function(){photoOpen&&(console.log("hide image"),body.removeAttr("id","do-show-photo"),photoEl.empty()),photoOpen=!1};