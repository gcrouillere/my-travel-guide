import React, { Component } from 'react';
import MapComponent from './mapComponent'
import { helperFunctions } from './../../utils/helperFunction'

class ArticleFormMap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      map: this.props.map
    }
  }

  componentDidMount() {
     window.loadAutoComplete = this.loadAutoComplete;
     helperFunctions.loadJS('https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQ-CtTAfoyjiLEkFdwB5nZejFmBfIY4Eo&callback=loadAutoComplete')
  }

  loadAutoComplete = () => {
    var mapLocation = document.getElementById('mapLocation')
    this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {types: ['geocode']});
    google.maps.event.addDomListener(mapLocation, 'keydown', function(e) {
      if (e.key === "Enter") e.preventDefault(); // Do not submit the form on Enter.
    });
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect = () => {
    let place = this.autocomplete.getPlace();
    let address = place.address_components;
    if (address) {
      const map = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: this.state.map.zoom}
      this.setState({map: map})
    }
  }

  addMarker = (event) => {
    const marker = {position: event.latLng}
    this.setState({marker: this.state.markers.push(marker)})
  }

  render() {
    return (
      <div className="mapBloc">
        <div className="mapLocation">
          <input type="text" id="mapLocation"/>
        </div>
        {/*<MapComponent map={this.state.map} addMarker={this.addMarker} markers={this.state.markers}/>*/}
      </div>
    );
  }
}

export default ArticleFormMap
