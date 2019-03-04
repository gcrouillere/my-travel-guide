import React, { Component } from 'react';

class ArticleFormMap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      map: this.props.map
    }
  }

  componentDidMount() {
    this.initAutoComplete()
    this.initMap()
  }

  initAutoComplete = () => {
    var mapLocation = document.getElementById('mapLocation')
    this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {types: ['geocode']});
    google.maps.event.addDomListener(mapLocation, 'keydown', function(e) {
      if (e.key === "Enter") e.preventDefault(); // Do not submit the form on Enter.
    });
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  initMap = () => {
    this.map = new google.maps.Map(document.getElementById(`map${this.props.map.id}`), {
      center: { lat: this.state.map.lat, lng: this.state.map.lng},
      zoom: this.props.map.zoom
    });
    this.state.markers.map((marker) => {
      var marker = new google.maps.Marker({
        position: marker.position,
        map: this.map,
      });
    })
    this.map.addListener('click', e => {this.addMarker(e, this.map)});
  }

  handlePlaceSelect = () => {
    let place = this.autocomplete.getPlace();
    let address = place.address_components;
    if (address) {
      const map = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: this.state.map.zoom}
      this.setState({map: map})
      this.initMap();
    }
  }

  addMarker = (event, map) => {
    const marker = {position: event.latLng}
    this.setState({marker: this.state.markers.push(marker)})
    this.initMap();
  }

  render() {
    return (
      <div className="mapBloc">
        <div className="mapLocation">
          <input type="text" id="mapLocation"/>
        </div>
        <div id={`map${this.props.map.id}`} style={{ width: 500, height: 500 }}></div>
      </div>
    );
  }
}

export default ArticleFormMap
