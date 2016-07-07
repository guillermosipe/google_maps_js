// Listado de marcadores
var customIcons = {
      azul: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      rojo: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_red.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      morado: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_purple.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      amarillo: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      blanco: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_white.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      verde: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_green.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      negro: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_black.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      naranja: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_orange.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      gris: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_gray.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      },
      cafe: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_brown.png',
        shadow: 'http://labs.google.com/ridefinder/images/mm_20_shadow.png'
      }
    };

    function bindInfoWindow(marker, map, infoWindow, html) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
    }

    function load_posicion_mapa_direccion(latitud,longitud) {

      window.map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        disableDoubleClickZoom: true,
        streetViewControl: false,
        zoomControl: false
      });

      var infoWindow = new google.maps.InfoWindow;

      var bounds = new google.maps.LatLngBounds();

      var point = new google.maps.LatLng(
              parseFloat(latitud),
              parseFloat(longitud));

      var icon = customIcons["rojo"];

      var descripcion = "<b>Usted esta aqui</b>";
      var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: icon.icon,
            shadow: icon.shadow
          });
      bounds.extend(marker.position);
      bindInfoWindow(marker, map, infoWindow, descripcion);

      map.fitBounds(bounds);
      var listener = google.maps.event.addListener(map, "idle", function() {
            if (map.getZoom() > 16)
            {
                map.setZoom(16);
            }
            google.maps.event.removeListener(listener);
        });

        //obtener dirección
        var geocoder=new google.maps.Geocoder();

        geocoder.geocode({'latLng': point}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              analizar_geolocalizacion(results);
            }
        });
    }


    var etiquetas_google_maps =[
                                ["route"],//calle
                                ["street_number"],//numero
                                //["neighborhood","political"],//colonia
                                ["sublocality_level_1","sublocality","political"],//colonia
                                [ "administrative_area_level_3","political"],//delegacion
                                ["administrative_area_level_1","political"],//estado
                                ["postal_code"]];//cp

    function analizar_geolocalizacion(geolocalizacion)
    {
      var i = 0,j=0,contador=0;
      var direccion = new Array(-1,-1,-1,-1,-1,-1);

      while(i<geolocalizacion.length && contador!=direccion.length)
      {
        j=0;
        while(j<geolocalizacion[i].address_components.length && contador!=direccion.length )
        {
          //calle
          if(direccion[0]==-1 && (geolocalizacion[i].address_components[j].types.length == etiquetas_google_maps[0].length) && geolocalizacion[i].address_components[j].types.every(function(element, index) {for(var x in etiquetas_google_maps[0]){ if(element === etiquetas_google_maps[0][x]){return true;} } return false;}))
          {
            direccion[0]=geolocalizacion[i].address_components[j].long_name;
            contador++;
          }
          //numero
          if(direccion[1]==-1 && (geolocalizacion[i].address_components[j].types.length == etiquetas_google_maps[1].length) && geolocalizacion[i].address_components[j].types.every(function(element, index) {for(var x in etiquetas_google_maps[1]){ if(element === etiquetas_google_maps[1][x]){return true;} } return false;}))
          {
            direccion[1]=geolocalizacion[i].address_components[j].long_name;
            contador++;
          }
          //colonia
          if(direccion[2]==-1 && (geolocalizacion[i].address_components[j].types.length == etiquetas_google_maps[2].length) && geolocalizacion[i].address_components[j].types.every(function(element, index) {for(var x in etiquetas_google_maps[2]){ if(element === etiquetas_google_maps[2][x]){return true;} } return false;}))
          {
            direccion[2]=geolocalizacion[i].address_components[j].long_name;
            contador++;
          }
          //estado
          if(direccion[3]==-1 && (geolocalizacion[i].address_components[j].types.length == etiquetas_google_maps[3].length) && geolocalizacion[i].address_components[j].types.every(function(element, index) {for(var x in etiquetas_google_maps[3]){ if(element === etiquetas_google_maps[3][x]){return true;} } return false;}))
          {
            direccion[3]=geolocalizacion[i].address_components[j].long_name;
            contador++;
          }
          //delegacion
          if(direccion[4]==-1 && (geolocalizacion[i].address_components[j].types.length == etiquetas_google_maps[4].length) && geolocalizacion[i].address_components[j].types.every(function(element, index) {for(var x in etiquetas_google_maps[4]){ if(element === etiquetas_google_maps[4][x]){return true;} } return false;}))
          {
            direccion[4]=geolocalizacion[i].address_components[j].long_name;
            contador++;
          }
          //cp
          if(direccion[5]==-1 && (geolocalizacion[i].address_components[j].types.length == etiquetas_google_maps[5].length) && geolocalizacion[i].address_components[j].types.every(function(element, index) {for(var x in etiquetas_google_maps[5]){ if(element === etiquetas_google_maps[5][x]){return true;} } return false;}))
          {
            direccion[5]=geolocalizacion[i].address_components[j].long_name;
            contador++;
          }
          j++;
        }
        i++;
      }

      // llenar interfaz
      $("#domicilio").val(direccion[0]+" "+direccion[1]+", "+direccion[2]+", "+direccion[3]+", "+direccion[4]+", "+direccion[5])

    }

  function load_mapa_direccion(direccion) {

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': direccion}, geocodeResult);
    }


  function geocodeResult(results, status) {
    if (status == 'OK') {

      window.map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        disableDoubleClickZoom: true,
        streetViewControl: false,
        zoomControl: false
      });

      var infoWindow = new google.maps.InfoWindow;

      var bounds = new google.maps.LatLngBounds();

      var array_latlog = new Array();

      $.map(results[0].geometry.location, function(value, index) {
          array_latlog.push(value);
      });

      lat=array_latlog[0];
      log=array_latlog[1];

      var icon = customIcons["rojo"];

      var descripcion = "<b>Usted esta aqui</b>";
      var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            icon: icon.icon,
            shadow: icon.shadow
          });
      bounds.extend(marker.position);
      bindInfoWindow(marker, map, infoWindow, descripcion);

      map.fitBounds(bounds);
      var listener = google.maps.event.addListener(map, "idle", function() {
            if (map.getZoom() > 16)
            {
                map.setZoom(16);
            }
            google.maps.event.removeListener(listener);
        });
    } else {
        //ERROR
    }
}
