import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import MapInitialCenterOverlay from './contentMenu/mapInitialCenterOverlay'
import PhotoInitialFileOverlay from './contentMenu/photoInitialFileOverlay'
import MixedContentInitialOverlay from './contentMenu/mixedContentInitialOverlay'
import mapLogo from './../../../assets/images/map-white.svg'
import textLogo from './../../../assets/images/write-white.svg'
import photoLogo from './../../../assets/images/see-white.svg'
import mixedContentLogo from './../../../assets/images/mixed-content-white.svg'

class ContentMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      initPositionAtCreation: null,
      mapOverlayActive: false,
      photoOverlayActive: false,
      mixedContentOverlayActive: false,
      location: "",
      mobileMenuActive: false
    }
    this.mapLocationInputRef = React.createRef();
  }

  initAddNewMap = (initPositionAtCreation = undefined) => {
    this.setState({ mapOverlayActive: true, initPositionAtCreation: initPositionAtCreation})
  }

  initAddNewPhotoBloc = (initPositionAtCreation = undefined) => {
    this.setState({ photoOverlayActive: true, initPositionAtCreation: initPositionAtCreation })
  }

  initAddNewMixedContentBloc = (initPositionAtCreation = undefined) => {
    this.setState({ mixedContentOverlayActive: true, initPositionAtCreation: initPositionAtCreation })
  }

  addNewTextContent = () => {
    this.props.addNewTextContent(this.props.id)
    this.setState({ mobileMenuActive: false })
  }

  addNewMap = (map) => { this.props.addNewMap(this.props.id, map, this.state.initPositionAtCreation) }

  addNewMixedContent = (selectedContents) => {
    this.setState({ mixedContentOverlayActive: false })
    this.props.addNewMixedContent(selectedContents, this.state.initPositionAtCreation)
  }

  addNewPhotoBloc = (data) => {
    this.abandonPhotoCreation()
    this.props.addNewPhotoBloc(data, this.state.initPositionAtCreation)
  }

  addNewComponentOnDrag = (event, trigger) => { this.props.addNewComponentOnDrag(event, trigger) }

  abandonMapCreation = () => { this.setState({ mapOverlayActive: false, mobileMenuActive: false }) }

  abandonPhotoCreation = () => { this.setState({ photoOverlayActive: false, mobileMenuActive: false }) }

  abandonMixedContentCreation = () => { this.setState({ mixedContentOverlayActive: false, mobileMenuActive: false }) }

  showMobileMenu = () => { this.setState({ mobileMenuActive: true }) }

  hideMobileMenu = () => { this.setState({ mobileMenuActive: false }) }

  render() {
    return(
      <div id="contentMenu" className={`contentMenu ${this.props.forceContentMenuHidding ? "disable-hover" : ""}`}>

        <div className="mobile-activation content" onClick={this.showMobileMenu}>Menu</div>

        <div className={`menuBody ${this.state.mobileMenuActive ? "active" : ""}`}>

          <div className="mobile-menu-header navbar navbar-light bg-dark">
            <div>Choose the element to insert</div>
            <button onClick={this.hideMobileMenu} className="close mobile-close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="buttons">
            <div className="blocAddition text">
              <div draggable className="btn btn-dark addNew" onClick={this.addNewTextContent}
              onDragStart={(event) => this.addNewComponentOnDrag(event, "textCreation")} value="text">
                <div draggable={false} className="addIcone"><img src={textLogo}/></div>
                <div className="addExplain">
                  <div className="clickText">Click to add text in queue</div>
                  <div className="dragText">Drag to add text to a specific location</div>
                </div>
              </div>
            </div>

            <div className="blocAddition map">
              <div draggable className="btn btn-dark addNew" onClick={this.initAddNewMap}
              onDragStart={(event) => this.addNewComponentOnDrag(event, "mapCreation")} value="map">
                <div draggable={false} className="addIcone"><img src={mapLogo}/></div>
                <div className="addExplain">
                  <div className="clickText">Click to add map in queue</div>
                  <div className="dragText">Drag to add map to a specific location</div>
                </div>
              </div>
            </div>

            <div className="blocAddition photo-button">
              <div draggable className="btn btn-dark addNew" onClick={this.initAddNewPhotoBloc}
              onDragStart={(event) => this.addNewComponentOnDrag(event, "photoCreation")} value="photo">
                <div draggable={false} className="addIcone"><img src={photoLogo}/></div>
                <div className="addExplain">
                  <div className="clickText">Click to add photo in queue</div>
                  <div className="dragText">Drag to add photo to a specific location</div>
                </div>
              </div>
            </div>

            <div className="blocAddition mixedContent-button">
              <div draggable className="btn btn-dark addNew" onClick={this.initAddNewMixedContentBloc}
              onDragStart={(event) => this.addNewComponentOnDrag(event, "mixedContentCreation")} value="mixedContent">
                <div draggable={false} className="addIcone"><img src={mixedContentLogo}/></div>
                <div className="addExplain">
                  <div className="clickText">Click to add mix in queue</div>
                  <div className="dragText">Drag to add mix to a specific location</div>
                </div>
              </div>
            </div>

          </div>
          <div className="expand content">
            <div className="menu">
              <p>M</p>
              <p>E</p>
              <p>N</p>
              <p>U</p>
            </div>
            <div className="chevron-closed">&lt;</div>
            <div className="chevron-open">></div>
          </div>
        </div>

        <MapInitialCenterOverlay mapOverlayActive={this.state.mapOverlayActive} ref={this.mapLocationInputRef}
        abandonMapCreation={this.abandonMapCreation} addNewMap={this.addNewMap}/>
        <PhotoInitialFileOverlay photoOverlayActive={this.state.photoOverlayActive} addNewPhotoBloc={this.addNewPhotoBloc}
        abandonPhotoCreation={this.abandonPhotoCreation}/>
        <MixedContentInitialOverlay mixedContentOverlayActive={this.state.mixedContentOverlayActive} addNewMixedContent={this.addNewMixedContent}
        abandonMixedContentCreation={this.abandonMixedContentCreation} />
      </div>
    )
  }
}

ContentMenu.propTypes = {
  elementsCount: PropTypes.number.isRequired,
  addNewTextContent: PropTypes.func.isRequired,
  addNewMap: PropTypes.func.isRequired,
  addNewPhotoBloc: PropTypes.func.isRequired,
  addNewComponentOnDrag: PropTypes.func.isRequired,
  forceContentMenuHidding: PropTypes.bool.isRequired,
}

export default ContentMenu
