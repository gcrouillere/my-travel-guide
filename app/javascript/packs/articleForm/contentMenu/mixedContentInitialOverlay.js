import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import update from 'immutability-helper'

import MapInitialCenterOverlay from './mapInitialCenterOverlay'
import PhotoInitialFileOverlay from './photoInitialFileOverlay'
import ajaxHelpers from '../../../utils/ajaxHelpers'
import mapLogo from './../../../../assets/images/map-white.svg'
import textLogo from './../../../../assets/images/write-white.svg'
import photoLogo from './../../../../assets/images/see-white.svg'
import deleteLogo from './../../../../assets/images/delete-white.svg'

class MixedContentInitialOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedContents: {
        box1: { src: null, text: null, content: {} },
        box2: { src: null, text: null, content: {} },
      },
      lastUpdateBox: "",
      mapOverlayActive: false,
      photoOverlayActive: false,
    }
  }

  static contentChoices = [{ logo: textLogo, text: "Text_content"}, { logo: mapLogo, text: "Map"}, { logo: photoLogo, text: "Photo"}]

  abandonMixedContentCreation = () => {
    this.props.abandonMixedContentCreation()
  }

  addNewMixedContentBLoc = () => {
    this.props.addNewMixedContentBLoc()
  }

  onDragStart = (event) => {
    const src = event.target.attributes.src.nodeValue
    const text = event.target.attributes.text.nodeValue

    event.dataTransfer.setData("type", [src, text].join("±"))
  }

  onDrop = (event, box) => {
    const selectedContent = event.dataTransfer.getData("type").split("±")
    const src = selectedContent[0]
    const text = selectedContent[1]
    let selectedContents = update(this.state.selectedContents, { [box]: { $set: { src: src, text: text, content: {} }}})

    this.deletePhotoFromCloudinary(box)

    if (text === "Map") {
      this.setState({ mapOverlayActive: true, lastUpdateBox: box, selectedContents: selectedContents })
    } else if (text === "Photo") {
      this.setState({ photoOverlayActive: true, lastUpdateBox: box, selectedContents: selectedContents })
    } else {
      this.setState({ lastUpdateBox: box, selectedContents: selectedContents })
    }
  }

  clearBox = (box) => {
    const selectedContents = update(this.state.selectedContents, { [box]: { $set: { src: null, text: null, content: {} }}})

    this.deletePhotoFromCloudinary(box)
    this.setState({ selectedContents: selectedContents})
  }

  deletePhotoFromCloudinary = (box) => {
    const photoPublicID = this.state.selectedContents[box].content.public_id

    if (photoPublicID) {
     ajaxHelpers.ajaxCall('GET', `/photos/remove_photo_from_cloudinary_only?public_id=${photoPublicID}`, {}, {})
    }
  }

  abandonMapCreation = () => {
    this.setState({ mapOverlayActive: false })
    this.clearBox(this.state.lastUpdateBox)
  }

  addNewMap = (map) => {
    const selectedContents = update(this.state.selectedContents, { [this.state.lastUpdateBox]: { content: { $set: map }}})
    this.setState({ mapOverlayActive: false, selectedContents: selectedContents })
  }

  addNewPhotoBloc = (photo) => {
    const newPhoto = update(photo, { original_width: { $set: photo.width }, original_height: { $set: photo.height }})
    const selectedContents = update(this.state.selectedContents, { [this.state.lastUpdateBox]: { content: { $set: newPhoto }}})

    this.setState({ photoOverlayActive: false, selectedContents: selectedContents })
  }

  abandonPhotoCreation = () => {
    this.setState({ photoOverlayActive: false })
    this.clearBox(this.state.lastUpdateBox)
  }

  addNewMixedContent = () => {
    this.props.addNewMixedContent(this.state.selectedContents)
  }

  render() {

    return (
      <div className={`mixedContentInitialOverlay ${this.props.mixedContentOverlayActive ? "active" : ""}`}>
        <button onClick={this.abandonMixedContentCreation} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <p className="mapOverlayTitle">Drag one content to each container:</p>

        <div className="contents">
          <div className="contentChoices">
            { MixedContentInitialOverlay.contentChoices.map( bloc =>
              <div key={bloc.text} className="contentSelect">
                <div className="btn btn-dark dragMix" onDragStart={this.onDragStart} text={bloc.text} src={bloc.logo} draggable>
                  <p draggable={false}>{bloc.text.split("_")[0]}</p>
                  <img draggable={false} src={bloc.logo}/>
                </div>
              </div>
            )}
          </div>

          <div className="selectedContents">
          { Object.keys(this.state.selectedContents).map( key =>
            <div key={key} className="selectedContentBox" onDrop={event => this.onDrop(event, key)} draggable={false} value={key}>
              { this.state.selectedContents[key].src && <div className="selectedContent btn btn-dark">
                <img className="clearBox" onClick={event => this.clearBox(key)} draggable={false} src={deleteLogo}/>
                <p>{this.state.selectedContents[key].text.split("_")[0]}</p>
                <img className="contentLogo" draggable={false} src={this.state.selectedContents[key].src} />
              </div> }
            </div>
          )}
          </div>

          <button onClick={this.addNewMixedContent} type="submit" className="btn btn-dark"
          disabled={!(this.state.selectedContents.box1.src && this.state.selectedContents.box2.src)}>
            Insert bloc
          </button>
        </div>

        <MapInitialCenterOverlay mapOverlayActive={this.state.mapOverlayActive} ref={this.mapLocationInputRef}
        abandonMapCreation={this.abandonMapCreation} addNewMap={this.addNewMap}/>
        <PhotoInitialFileOverlay photoOverlayActive={this.state.photoOverlayActive} addNewPhotoBloc={this.addNewPhotoBloc}
        abandonPhotoCreation={this.abandonPhotoCreation}/>
      </div>
    )
  }
}

MixedContentInitialOverlay.propTypes = {
  mixedContentOverlayActive: PropTypes.bool.isRequired,
  abandonMixedContentCreation: PropTypes.func.isRequired,
  addNewMixedContent: PropTypes.func.isRequired
}

export default MixedContentInitialOverlay
