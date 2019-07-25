import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import htmlSanitizer from './../../utils/htmlSanitizer'

class DragImage extends Component {
  constructor(props) {
    super(props)
    this.divRef = React.createRef()
  }

  sanitizeAndTruncateHTML(html) {
    return htmlSanitizer.sanitizeAndTruncateHTML(html, 50)
  }

  getDragImageNode() {
    return this.divRef.current
  }

  render() {
    return (
      <div ref={this.divRef} id="dragImage" className={`dragImage-${this.props.activeDragImage ? "active" : ""}`}>
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
          else if (dragContentKey == "original_filename") {
            return (
            <div key={"dragImageContentMap"}>
              <p>Image : {this.props.dragContent[dragContentKey]}</p>
            </div>
          )}
            else if (dragContentKey == "associated_instances_mapping") {
              return (
                <div key={"dragImageContentMap"}>
                  <p>Mix content : {`${this.props.dragContent[dragContentKey][0][0]} & ${this.props.dragContent[dragContentKey][1][0]}`}</p>
                </div>
              )
            }
        })}
      </div>
    )
  }
}

DragImage.propTypes = {
  dragContent: PropTypes.object.isRequired,
  activeDragImage: PropTypes.bool.isRequired
}

export default DragImage
