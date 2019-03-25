import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MapInitialCenterOverlay from './mapInitialCenterOverlay'
import mapLogo from './../../../assets/images/map-white.svg'
import textLogo from './../../../assets/images/write-white.svg'

class ContentMenu extends Component {

  constructor(props) {
    super(props)
  }

  initAutoComplete = ({initPositionAtCreation = undefined} = {}) => {
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
    this.autocomplete.addListener('place_changed', event => this.addNewMap(event, userInput, initPositionAtCreation));
  }

  addNewTextContent = () => {this.props.addNewTextContent(this.props.id, {initPositionAtCreation: undefined})}

  addNewMap = (event, mapLocation, initPositionAtCreation) => {
    let place = this.autocomplete.getPlace();
    let name = ""
    if (place.address_components) {
      const mapCenter = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
      const name = place.formatted_address
      this.props.addNewMap(this.props.id, mapCenter, name, initPositionAtCreation)
    } else {
      const mapCenter = {lat: 0, lng: 0}
      const name = mapLocation
      this.props.addNewMap(this.props.id, mapCenter, name, initPositionAtCreation)
    }
  }

  addNewTextOnDrag = (event) => {this.props.addNewTextOnDrag()}

  addNewMapOnDrag = (event) => {this.props.addNewMapOnDrag()}

  render() {
    return(
      <div className="contentMenu">
        <div className="buttons">

          <div className="blocAddition">
            <div draggable className="btn btn-dark addNewTextContent" onClick={this.addNewTextContent}
            onDragStart={this.addNewTextOnDrag}>
              <div className="addIcone"><img src={textLogo}/></div>
              <div className="addExplain">
                <div>Click to add text in queue</div>
                <div>Drag to add text to a specific location</div>
              </div>
            </div>
          </div>

          <div className="blocAddition">
            <div draggable className="btn btn-dark addNewTextContent" onClick={this.initAutoComplete}
            onDragStart={this.addNewMapOnDrag}>
              <div className="addIcone"><img src={mapLogo}/></div>
              <div className="addExplain">
                <div>Click to add map in queue</div>
                <div>Drag to add map to a specific location</div>
              </div>
            </div>
          </div>

        </div>
        <div className="expand">
          <div className="menu">
            <p>M</p>
            <p>E</p>
            <p>N</p>
            <p>U</p>
          </div>
          <div className="chevron-closed">&lt;</div>
          <div className="chevron-open">></div>
        </div>

        <MapInitialCenterOverlay />
      </div>
    )
  }
}

export default ContentMenu
