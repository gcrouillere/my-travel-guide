import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import update from 'immutability-helper'

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

  initAddNewMap = (initPositionAtCreation = undefined) => {
    this.setState({ mapOverlayActive: true, initPositionAtCreation: initPositionAtCreation})
  }

  initAddNewPhotoBloc = (initPositionAtCreation = undefined) => {
    this.setState({ photoOverlayActive: true, initPositionAtCreation: initPositionAtCreation })
  }

  addNewTextContent = () => {
    this.props.addNewTextContent(this.props.id, { initPositionAtCreation: undefined })
  }

  addNewMap = (map) => {
    this.props.addNewMap(this.props.id, map, this.state.initPositionAtCreation)
  }

  addNewPhotoBloc = (data) => { this.props.addNewPhotoBloc(data, this.state.initPositionAtCreation) }

  addNewComponentOnDrag = (event, trigger) => { this.props.addNewComponentOnDrag(event, trigger) }

  abandonMapCreation = () => { this.setState({ mapOverlayActive: false }) }

  abandonPhotoCreation = () => { this.setState({ photoOverlayActive: false }) }

  render() {

    return(
      <div id="contentMenu" className={`contentMenu ${this.props.forceContentMenuHidding ? "disable-hover" : ""}`}>
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
            <div draggable className="btn btn-dark addNew" onClick={this.initAddNewMap}
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

        <MapInitialCenterOverlay mapOverlayActive={this.state.mapOverlayActive}
        abandonMapCreation={this.abandonMapCreation} ref={this.mapLocationInputRef} addNewMap={this.addNewMap}/>
        <PhotoInitialFileOverlay photoOverlayActive={this.state.photoOverlayActive} onPhotoSelected={this.onPhotoSelected}
        addNewPhotoBloc={this.addNewPhotoBloc} abandonPhotoCreation={this.abandonPhotoCreation}
        initPositionAtCreation={this.state.initPositionAtCreation}/>
      </div>
    )
  }
}

export default ContentMenu
