import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import AudienceForm from './articleForm/audienceForm'
import TextContentForm from './articleForm/textContentForm'
import MapForm from './articleForm/mapForm'
import ContentMenu from './articleForm/contentMenu'
import DragImage from './articleForm/dragImage'
import $ from 'jquery'
import update from 'immutability-helper'
import 'react-quill/dist/quill.snow.css';

class ArticleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articleElements: [],
      title: "",
      dropZone: "",
      draggedElementId: null,
      initialPosition: null,
      previousHoveredElementPosition: null,
      activeDragImage: false,
      dragContent: {},
      id: null
    }
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      $.ajax({
        method: 'GET',
        url: `/articles/${this.props.match.params.id}`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({title: data.title, id: data.id,
        articleElements: data.text_contents.concat(data.maps).sort((x, y) => x.position - y.position)});
      })
    } else {
      $.ajax({
        method: 'POST',
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: `/articles`,
        dataType: "JSON",
        data: {article: {title: "", audiencesSelection:[]}}
      }).done((data) => {
        this.setState({title: data.title, articleElements: [], id: data.id});
        this.props.history.push(`/articles/${data.id}/edit`)
      });
    }
  }

  handleTitleChange = (event) => {
    this.setState({title: event.target.value})
  }

  saveTitleOnBlur = () => {
     $.ajax({
      method: "PUT",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/${this.state.id}`,
      data: {article: {title: this.state.title}}
    }).done((data) => {console.log(data)})
     .fail((data) => {console.log(data)})
  }

  addNewTextContent = (id, {initPositionAtCreation = undefined} = {}) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/text_contents/`,
      dataType: "JSON",
      data: {text_content: {text: "", article_id: id, position: this.state.articleElements.length}}
    }).done((data) => {
      let finalPositionAtCreation = this.definePositionAtCreation(initPositionAtCreation)
      this.updateElementPosition(id, -1, finalPositionAtCreation)
    }).fail((data) => {console.log(data)})
  }

  addNewMap = (id, mapCenter, mapLocation, initPositionAtCreation) => {
    document.querySelector(".mapInitialCenterOverlay").classList.remove("active")
    const zoom = (mapCenter.lat == 0 && mapCenter.lng == 0) ? 1 : 11
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/`,
      dataType: "JSON",
      data: {map: {lat: mapCenter.lat, lng: mapCenter.lng, zoom: zoom, name: mapLocation,
        position: this.state.articleElements.length, height: 150, article_id: id}}
    }).done((data) => {
      let finalPositionAtCreation = this.definePositionAtCreation(initPositionAtCreation)
      this.updateElementPosition(id, -1, finalPositionAtCreation)
    }).fail((data) => {console.log(data)})
  }

  deleteElement = (event, id, position, controller) => {
    $.ajax({
      method: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/${controller}/${id}`,
      dataType: "JSON"
    }).done((data) => {
      this.updateElementPosition(id, undefined, undefined)
    }).fail((data) => {console.log(data)})
  }

  onDragStart = (event, id, position, articleContent) => {
    document.getElementById(`content-${position}`).classList.add("draggingElement")
    document.querySelectorAll(".textContentInput, .mapInput").forEach(x => x.classList.add("dragging"))
    event.dataTransfer.setData("type", "positionUpdate")
    this.setState({
      initialPosition: position,
      draggedElementId: id,
      previousHoveredElementPosition: position,
      activeDragImage: true,
      dragContent: articleContent
    })

    let dragImage = document.getElementById("dragImage")
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    return false
  }

  onDragOver = (event, id, position) => {
    event.preventDefault();
  }

  onDragEnter = (event, id, position) => {
    event.preventDefault();
    if (position !== this.state.initialPosition && position == this.state.previousHoveredElementPosition) {
      if (this.state.initialPosition > position) {
        document.querySelector(`#content-${position} .dropZone-before`).classList.add("active")
      } else {
        document.querySelector(`#content-${position} .dropZone-after`).classList.add("active")
        if (position == 0 && this.state.initialPosition == -1) {
          document.querySelector(`#content-${position} .dropZone-before`).classList.add("active")
        }
      }
    } else {
      document.querySelectorAll(".dropZone-before, .dropZone-after").forEach(x => x.classList.remove("active"))
      this.setState({previousHoveredElementPosition: position})
    }
  }

  onDragLeave = (event, id, position) => {
    if (position == this.state.initialPosition || position != this.state.previousHoveredElementPosition) {
      document.querySelectorAll(".dropZone-before, .dropZone-after").forEach(x => x.classList.remove("active"))
    }
  }

  onDrop = (event, id, position) => {
    this.clearDraggingExtraClasses()
    this.setDropzoneClass(event)
    if (event.dataTransfer.getData("type") == "positionUpdate") {
      this.updateElementPosition(id, this.state.initialPosition, position)
    } else if (event.dataTransfer.getData("type") == "mapCreation") {
      this.refs.contentMenu.initAutoComplete({initPositionAtCreation: position})
    } else if (event.dataTransfer.getData("type") == "textCreation") {
      this.addNewTextContent(this.state.id, {initPositionAtCreation: position})
    }
  }

  onDropOnContainer = () => {
    this.clearDraggingExtraClasses()
  }

  addNewTextOnDrag = () => {
    event.dataTransfer.setData("type", "textCreation")
    this.setState({initialPosition: -1})
  }

  addNewMapOnDrag = () => {
    event.dataTransfer.setData("type", "mapCreation")
    this.setState({initialPosition: -1})
  }

  updateElementPosition(id, initPosition, targetPosition) {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/element_position_update/`,
      dataType: "JSON",
      data: {article: this.state.id, positions: {
        init: {id: id, position: initPosition},
        target: {id: id, position: targetPosition}
      }}
    }).done((data) => {
      const sortedElements = data.text_contents.concat(data.maps).sort((x, y) => x.position - y.position)
      this.setState({articleElements: sortedElements, activeDragImage: false, initialPosition: null, dropZone: ""})
    }).fail((data) => {console.log(data)})
  }

  definePositionAtCreation(position) {
    if (position == 0 && this.state.initialPosition == -1 && this.state.dropZone == "before") {
     position = 0
    } else if (position >= 0) {
      position += 1
    } else {
      position = this.state.articleElements.length
    }
    return position
  }

  setDropzoneClass(event) {
    let dropItemClasses = Array.from(event.target.classList)
    if (dropItemClasses.length == 0) {
      this.setState({dropZone: "after"})
    } else {
      dropItemClasses.map(x => /before/.test(x)).reduce((x, acc) => acc && x) ? this.setState({dropZone: "before"}) : this.setState({dropZone: "after"})
    }
  }

  clearDraggingExtraClasses() {
    document.querySelectorAll(".dropZone-before , .dropZone-after").forEach(x => x.classList.remove("active"))
    document.querySelectorAll(".textContentInput, .mapInput").forEach(x => x.classList.remove("dragging"))
    document.querySelectorAll(".draggingElement").forEach(x => x.classList.remove("draggingElement"))
  }

  render() {
    return (
      <div className="container article-container" onDrop={this.onDropOnContainer} onDragOver={this.onDragOver}>

        <AudienceForm id={this.props.match.params.id} />

        <ContentMenu id={this.state.id} addNewTextContent={this.addNewTextContent} addNewMap={this.addNewMap}
        addNewTextOnDrag={this.addNewTextOnDrag} addNewMapOnDrag={this.addNewMapOnDrag} ref="contentMenu"
        elementsCount={this.state.articleElements.length}/>

        <header>
          <h2 className="sectionLabel">Main title</h2>
          <input type="text" placeholder="Enter your article title" value={this.state.title} onChange={this.handleTitleChange}
          onBlur={this.saveTitleOnBlur}/>
        </header>

        <div className="articleContent" >
        <h2 className="sectionLabel">Article content</h2>
          {this.state.articleElements.map(element => {
            if (element.class_name == "TextContent") {
              return <TextContentForm key={`text${element.id}`} textContent={element}
                articleId={this.state.id} position={element.position} id={element.id}
                onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement} />
            }
            else if (element.class_name == "Map") {
              return <MapForm key={`map${element.id}`} map={element} name={element.name}
              articleId={this.state.id} position={element.position} id={element.id}
              onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement} />
            }
          })}
          <DragImage dragContent={this.state.dragContent} activeDragImage={this.state.activeDragImage}/>
        </div>

      </div>
    )
  }
}

export default ArticleForm
