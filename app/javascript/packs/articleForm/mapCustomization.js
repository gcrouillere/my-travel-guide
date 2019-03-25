import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class MapCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      content: ""
    }
  }

  abandonMapCustomization = () => { document.querySelector(".mapCustomization").classList.remove("active") }

  showInfoWindowForm = () => { document.querySelector(".infoWindowContent").classList.add("active") }

  handleInput = (event) => {
    this.setState({content: event.target.value})
  }

  initAddSimpleMarker = (event) => { this.props.initAddSimpleMarker(event) }

  initAddMarkerWithIW = (event, content) => { this.props.initAddMarkerWithIW(event, content) }

  render() {

    return (
      <div className="mapCustomization">
        <button onClick={this.abandonMapCustomization} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h3>What's next:</h3>
        <p onClick={this.showInfoWindowForm}>Add Marker with Infowindow</p>
        <p onClick={this.initAddSimpleMarker}>Add Simple Marker</p>
        <div className="infoWindowContent">
          <textarea value={this.state.content} onChange={this.handleInput}/>
          <button className="btn btn-dark"onClick={this.initAddMarkerWithIW(event, this.state.content)}>Place marker</button>
        </div>
      </div>
    )
  }
}

export default MapCustomization
