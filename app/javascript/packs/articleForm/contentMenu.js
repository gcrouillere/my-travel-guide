import React, { Component } from 'react'

class ContentMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chevron: ">"
    }
  }

 initAutoComplete = () => {
  document.querySelector(".mapInitialCenterOverlay").classList.add("active")
  var mapLocation = document.getElementById('initialMapLocation')
  this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {types: ['geocode']});
  google.maps.event.addDomListener(mapLocation, 'keydown', function(e) {
    if (e.key === "Enter") e.preventDefault(); // Do not submit the form on Enter.
  });
  this.autocomplete.addListener('place_changed', this.addNewMap);
 }

  addNewTextContent = () => {this.props.addNewTextContent(this.props.id)}

  addNewMap = () => {
    let place = this.autocomplete.getPlace();
    if (place.address_components) {
      const mapCenter = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
      this.props.addNewMap(this.props.id, mapCenter)
    } else {
      const mapCenter = {lat: 0, lng: 0}
      this.props.addNewMap(this.props.id, mapCenter)
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

  abandonMapCreation = () => {
    document.querySelector(".mapInitialCenterOverlay").classList.remove("active")
  }

  render() {
    return(
      <div className="contentMenu">
        <div className="buttons">
          <div className="blocAddition"><button className="btn btn-dark" onClick={this.addNewTextContent}>Add new text bloc</button></div>
          <div className="blocAddition"><button className="btn btn-dark" onClick={this.initAutoComplete}>Add new map</button></div>
        </div>
        <div className="expand" onClick={this.expandMenu}><span>{this.state.chevron}</span></div>

        <div className="mapInitialCenterOverlay">
          <button onClick={this.abandonMapCreation} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <p className="mapOverlayTitle">Which area do you want to show ?</p>
          <p className="mapOverlaydescription">If no suggestion is given, try a near match. You 'll be able to fine tune the map in the article editor.</p>
          <div className="input-group input-group-lg">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-large">Map's center</span>
            </div>
            <input type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-large" id="initialMapLocation"/>
          </div>
        </div>
      </div>
    )
  }
}

export default ContentMenu
