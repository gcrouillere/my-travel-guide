import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

class MapComponent extends Component {

   render() {
   const GoogleMapExample = withScriptjs(withGoogleMap(props => (
      <GoogleMap
        defaultCenter = {{ lat: this.props.map.lat, lng: this.props.map.lng}}
        defaultZoom = { this.props.map.zoom }
        onClick={this.props.addMarker}
      >
      {this.props.markers.map(marker => <Marker key={1} position={marker.position} />)}
      </GoogleMap>
   )));

   return(
      <div>
        <GoogleMapExample
          googleMapURL="https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQ-CtTAfoyjiLEkFdwB5nZejFmBfIY4Eo"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={ <div style={{ height: `300px`, width: '100%' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
      </div>
   );
   }
};
export default MapComponent;
