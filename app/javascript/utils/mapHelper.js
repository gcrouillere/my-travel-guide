import tempMarkerLogo from './../../assets/images/circle-full-black.svg'
import pathStartLogo from './../../assets/images/circle-black.svg'
import pathEndLogo from './../../assets/images/path-end-black.svg'

export default {

  getPolylinePointLogo(index, polylineMarkers) {
    let icon = {}
    if (index == 0) {
      icon = {url: pathStartLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(12, 12)}
    } else if (index == polylineMarkers.length - 1) {
      icon = {url: pathEndLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(6, 23)}
    } else {
      icon = {url: tempMarkerLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(6, 6)}
    }
    return icon
  },

  manageDistanceInfoWindow(index, distanceDisplayed, polylineMarkers, googlePolyline, googleMarker, googleMap) {
    if ( distanceDisplayed && index == polylineMarkers.length - 1) {
      let distance = Math.round(google.maps.geometry.spherical.computeLength(googlePolyline.getPath()) / 1000 * 100) / 100;
      const infowindow = new google.maps.InfoWindow({content: `Path length: ${distance} km`, disableAutoPan: true});
      infowindow.open(googleMap, googleMarker);
    }
  },

  createMarker(marker, googleMap, icon, index, draggable) {
    return new google.maps.Marker({
      position: {lat: marker.lat, lng: marker.lng},
      map: googleMap,
      draggable: draggable,
      icon: icon,
      mapCenter: marker.mapCenter,
      markerIndex: index,
    })
  }
}
