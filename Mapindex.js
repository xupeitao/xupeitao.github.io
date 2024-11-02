// 
// <summary>
// Date          Name            Vers    Comments
// 2024-01-19    Peitao Xu       1.0     Build the About page.
// 2024-01-20    Peitao Xu       1.1     Build the Portfolio page.
// 2024-01-21    Peitao Xu       1.2     Build the Contact page.  
// 2024-03-20    Peitao Xu       2.0     Add Data Layer, Bicycle/Traffic/Transit layer.  
// 

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 43.0130, lng: -81.1994 },
    zoom: 14,
    mapTypeId: 'hybrid',
  });

  var Fanshawe = { lat: 43.0130, lng: -81.1994 };

  var marker = new google.maps.Marker({
      position: Fanshawe,
      draggable: false,
      map: map,
      title: 'Fanshawe!'
  });

    // Define the coordinates of the outernal path of "P"
    const outerCoords = [
      { lat: 43.022959, lng: -81.208201 }, 
      { lat: 43.022902, lng: -81.196858 },
      { lat: 43.020346, lng: -81.192454 },
      { lat: 43.016453, lng: -81.191572 },
      { lat: 43.012668, lng: -81.193447 },
      { lat: 43.010962, lng: -81.197544 },
      { lat: 43.011066, lng: -81.204019 },
      { lat: 43.004489, lng: -81.204309 },
      { lat: 43.004437, lng: -81.208787 },
    ];
  
    // Define the coordinates of the internal path of "P"
    const innerCoords = [
      { lat: 43.019519, lng: -81.203658 },
      { lat: 43.019415, lng: -81.198522 },
      { lat: 43.018085, lng: -81.196379 },
      { lat: 43.016635, lng: -81.196082 },
      { lat: 43.015252, lng: -81.196735 },
      { lat: 43.014081, lng: -81.198428 },
      { lat: 43.014344, lng: -81.203926 },
    ];
  
    map.data.add({
      geometry: new google.maps.Data.Polygon([
        outerCoords,
        innerCoords,
      ]),
    });

    map.data.setStyle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.15,
    });

  // Add Bicycle Layer
  const bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);

  // Add Traffic Layer
  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  // Add Transit Layer
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

}

initMap();
