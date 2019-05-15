import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import htmlSanitizer from './../../utils/htmlSanitizer'

class DragImage extends Component {
  constructor(props) {
    super(props)
  }

  sanitizeAndTruncateHTML(html) {
    return htmlSanitizer.sanitizeAndTruncateHTML(html, 50)
  }

  render() {

    return (
      <div id="dragImage" className={`dragImage-${this.props.activeDragImage ? "active" : ""}`}>
        {Object.keys(this.props.dragContent).map(dragContentKey => {
          if (dragContentKey == "text") { return (
            <div key={"dragImageContentText"}>
              <p>{this.sanitizeAndTruncateHTML(this.props.dragContent[dragContentKey])}</p>
            </div>
          )}
          else if (dragContentKey == "name") { return (
            <div key={"dragImageContentMap"}>
              <p>Map : {this.props.dragContent[dragContentKey]}</p>
            </div>
          )}
          else if (dragContentKey == "url") { return (
            <div key={"dragImageContentMap"} className="imageDragging">
              <img src={this.props.dragContent[dragContentKey]} alt=""/>
            </div>
          )}
        })}
      </div>
    )
  }
}

export default DragImage
