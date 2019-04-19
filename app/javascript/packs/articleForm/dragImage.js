import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class DragImage extends Component {
  constructor(props) {
    super(props)
  }

  sanitizeHTML(text) {
    const etc = text.length > 50 ? " ..." : ""
    return text.replace(/<(?:.|\n)*?>/gm, '').substr(0, 50) + etc
  }

  render() {

    return (
      <div id="dragImage" className={`dragImage-${this.props.activeDragImage ? "active" : ""}`}>
        {Object.keys(this.props.dragContent).map(dragContentKey => {
          if (dragContentKey == "text") { return (
            <div key={"dragImageContentText"} className="dragImageContent">
              <p>{this.sanitizeHTML(this.props.dragContent[dragContentKey])}</p>
            </div>
          )}
          else if (dragContentKey == "name") { return (
            <div key={"dragImageContentMap"} className="dragImageContent">
              <p>Map : {this.props.dragContent[dragContentKey]}</p>
            </div>
          )}
          else if (dragContentKey == "url") { return (
            <div key={"dragImageContentMap"} className="dragImageContent">
              <img src={this.props.dragContent[dragContentKey]} alt=""/>
            </div>
          )}
        })}
      </div>
    )
  }
}

export default DragImage
