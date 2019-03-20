import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MapInitialCenterOverlay from './mapInitialCenterOverlay'

class ContentMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chevron: ">"
    }
  }

  initAutoComplete = ({initPosition = undefined} = {}) => {
    document.querySelector(".mapInitialCenterOverlay").classList.add("active")
    document.getElementById('initialMapLocation').value = ""
    let mapLocation = document.getElementById('initialMapLocation')
    let userInput = ""
    this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {types: ['geocode']});
    google.maps.event.addDomListener(mapLocation, 'keydown', function(e) {
      if (e.key === "Enter") e.preventDefault(); // Do not submit the form on Enter.
    });
    google.maps.event.addDomListener(mapLocation, 'keyup', function(event) {
      userInput = event.target.value
    });
    this.autocomplete.addListener('place_changed', event => this.addNewMap(event, userInput, initPosition));
  }

  addNewTextContent = () => {this.props.addNewTextContent(this.props.id, {initPosition: undefined})}

  addNewMap = (event, mapLocation, initPosition) => {
    let place = this.autocomplete.getPlace();
    let name = ""
    if (place.address_components) {
      const mapCenter = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
      const name = place.formatted_address
      this.props.addNewMap(this.props.id, mapCenter, name, initPosition)
    } else {
      const mapCenter = {lat: 0, lng: 0}
      const name = mapLocation
      this.props.addNewMap(this.props.id, mapCenter, name, initPosition)
    }
  }

  expandMenu = (event) => {
    const classList = Array.from(document.querySelector(".contentMenu").classList)
    if (classList.indexOf("expanded") == -1) {
      document.querySelector(".contentMenu").classList.add("expanded")
      this.setState({chevron: "<"})
    } else {
       document.querySelector(".contentMenu").classList.remove("expanded")
       this.setState({chevron: ">"})
    }
  }

  addNewTextOnDrag = (event) => {this.props.addNewTextOnDrag()}

  addNewMapOnDrag = (event) => {this.props.addNewMapOnDrag()}

  render() {
    return(
      <div className="contentMenu">
        <div className="buttons">
          <div className="blocAddition">
            <button draggable className="btn btn-dark" onClick={this.addNewTextContent}
            onDragStart={this.addNewTextOnDrag}>
              Add new text bloc
            </button></div>
          <div className="blocAddition">
            <button draggable className="btn btn-dark" onClick={this.initAutoComplete}
             onDragStart={this.addNewMapOnDrag}>
              Add new map
            </button>
          </div>
        </div>
        <div className="expand" onClick={this.expandMenu}><span>{this.state.chevron}</span></div>

        <MapInitialCenterOverlay />
      </div>
    )
  }
}

export default ContentMenu
