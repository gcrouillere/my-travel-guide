import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ajaxHelpers from './../../utils/ajaxHelpers'

class MapLocationInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: this.props.location || ""
    }
    this.inputRef = React.createRef();
  }

  onDragStart = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  printLocation = (event) => {
    this.setState({location: event.target.value})
  }

  componentDidMount() {
    let mapLocation = this.inputRef.current
    let userInput = this.state.location
    this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {});
    google.maps.event.addDomListener(mapLocation, 'keydown', function(e) {
      if (e.key === "Enter") e.preventDefault(); // Do not submit the form on Enter.
    });
    google.maps.event.addDomListener(mapLocation, 'keyup', function(event) {
      userInput = event.target.value
    });
    this.autocomplete.addListener('place_changed', event =>
      this.handleAutoComplete(userInput)
    );
  }

  handleAutoComplete = async (userInput) => {
    const place = this.autocomplete.getPlace();
    let map = { }

    if (place.geometry) {
      map = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), name: place.formatted_address }
    } else {
      map = await ajaxHelpers.geocodePlace(userInput)
    }

    this.setState({ location: this.props.menu ? "" : map.name })
    this.props.handleMap(map)
  }

  render() {
    return (
      <div className="mapLocation">
        <div className="locationInput input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">Map's center</span>
          </div>
          <input type="text" className="form-control mapLocationInput" aria-label="Default"
          aria-describedby="inputGroup-sizing-default" id={`mapLocation${this.props.id}`}
          draggable onDragStart={this.onDragStart} value={this.state.location}
          onChange={this.printLocation} ref={this.inputRef}/>
        </div>
      </div>
    )
  }
}

export default MapLocationInput
