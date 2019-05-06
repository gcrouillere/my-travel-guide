import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MapInitialCenterOverlay from './contentMenu/mapInitialCenterOverlay'
import PhotoInitialFileOverlay from './contentMenu/photoInitialFileOverlay'
import mapLogo from './../../../assets/images/map-white.svg'
import textLogo from './../../../assets/images/write-white.svg'
import photoLogo from './../../../assets/images/see-white.svg'

class ContentMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      initPositionAtCreation: null,
      mapOverlayActive: false,
      photoOverlayActive: false,
      location: ""
    }
    this.mapLocationInputRef = React.createRef();
  }

  initAutoComplete = ({initPositionAtCreation = undefined} = {}) => {
    this.setState({mapOverlayActive: true, location: ""})
    let mapLocation = this.mapLocationInputRef.current.getInputNode()
    let userInput = ""
    this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {});
    google.maps.event.addDomListener(mapLocation, 'keydown', function(e) {
      if (e.key === "Enter") e.preventDefault(); // Do not submit the form on Enter.
    });
    google.maps.event.addDomListener(mapLocation, 'keyup', function(event) {
      userInput = event.target.value
    });
    this.autocomplete.addListener('place_changed', event => this.addNewMap(userInput, initPositionAtCreation));
  }

  addNewTextContent = () => {
    this.props.addNewTextContent(this.props.id, {initPositionAtCreation: undefined})
  }

  addNewMap = (mapLocation, initPositionAtCreation) => {
    let place = this.autocomplete.getPlace();
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

  initAddNewPhotoBloc = (initPositionAtCreation = undefined) => {
    this.setState({initPositionAtCreation: initPositionAtCreation, photoOverlayActive: true})
  }

  addNewPhotoBloc = (data) => { this.props.addNewPhotoBloc(data, this.state.initPositionAtCreation) }

  addNewComponentOnDrag = (event, trigger) => { this.props.addNewComponentOnDrag(event, trigger) }

  abandonMapCreation = () => { this.setState({mapOverlayActive: false}) }

  abandonPhotoCreation = () => { this.setState({photoOverlayActive: false}) }

  printLocation = (event) => { this.setState({location: event.target.value}) }

  render() {

    return(
      <div id="contentMenu" className="contentMenu">
        <div className="buttons">

          <div className="blocAddition text">
            <div draggable className="btn btn-dark addNew" onClick={this.addNewTextContent}
            onDragStart={(event) => this.addNewComponentOnDrag(event, "textCreation")} value="text">
              <div draggable={false} className="addIcone"><img src={textLogo}/></div>
              <div className="addExplain">
                <div>Click to add text in queue</div>
                <div>Drag to add text to a specific location</div>
              </div>
            </div>
          </div>

          <div className="blocAddition map">
            <div draggable className="btn btn-dark addNew" onClick={this.initAutoComplete}
            onDragStart={(event) => this.addNewComponentOnDrag(event, "mapCreation")} value="map">
              <div draggable={false} className="addIcone"><img src={mapLogo}/></div>
              <div className="addExplain">
                <div>Click to add map in queue</div>
                <div>Drag to add map to a specific location</div>
              </div>
            </div>
          </div>

          <div className="blocAddition photo">
            <div draggable className="btn btn-dark addNew" onClick={this.initAddNewPhotoBloc}
            onDragStart={(event) => this.addNewComponentOnDrag(event, "photoCreation")} value="photo">
              <div draggable={false} className="addIcone"><img src={photoLogo}/></div>
              <div className="addExplain">
                <div>Click to add photo in queue</div>
                <div>Drag to add photo to a specific location</div>
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

        <MapInitialCenterOverlay mapOverlayActive={this.state.mapOverlayActive} location={this.state.location}
        printLocation={this.printLocation} abandonMapCreation={this.abandonMapCreation} ref={this.mapLocationInputRef}/>
        <PhotoInitialFileOverlay photoOverlayActive={this.state.photoOverlayActive} onPhotoSelected={this.onPhotoSelected}
        addNewPhotoBloc={this.addNewPhotoBloc} abandonPhotoCreation={this.abandonPhotoCreation}
        initPositionAtCreation={this.state.initPositionAtCreation}/>
      </div>
    )
  }
}

export default ContentMenu
