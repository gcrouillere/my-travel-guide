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
      draggedElementId: null,
      initialPosition: null,
      previousHoveredElementPosition: null,
      title: "",
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
    const title = event.target.value
    $.ajax({
      method: "PUT",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/${this.state.id}`,
      data: {article: {title: title}}
    }).done((data) => {
      this.setState({title: title})
    }).fail((data) => {console.log(data)})
  }

  addNewTextContent = (id, {initPosition = undefined} = {}) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/text_contents/`,
      dataType: "JSON",
      data: {text_content: {text: "", article_id: id, position: initPosition}}
    }).done((data) => {
      this.updateElementPosition(id, initPosition, initPosition)
    }).fail((data) => {console.log(data)})
  }

  addNewMap = (id, mapCenter, mapLocation, position) => {
    document.querySelector(".mapInitialCenterOverlay").classList.remove("active")
    const zoom = (mapCenter.lat == 0 && mapCenter.lng == 0) ? 1 : 11
    let newMap = {}
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/`,
      dataType: "JSON",
      data: {map: {lat: mapCenter.lat, lng: mapCenter.lng, zoom: zoom, name: mapLocation, position: position, article_id: id}}
    }).done((data) => {
      this.updateElementPosition(id, position, position)
    }).fail((data) => {console.log(data)})
  }

  deleteElement = (event, id, position, controller) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/element_position_update/`,
      dataType: "JSON",
      data: {article: this.state.id, positions: {
        init: {position: position},
        target: {position: -1}
      }}
    }).done((reponse) => {
      const articleElements = reponse.text_contents.concat(reponse.maps).sort((x, y) => x.position - y.position)
      $.ajax({
        method: 'DELETE',
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: `/${controller}/${id}`,
        dataType: "JSON"
      }).done((data) => {
        articleElements.splice(articleElements.length - 1, 1)
        this.setState({articleElements: articleElements})
      }).fail((data) => {console.log(data)})
    })
  }

  onDragStart = (event, id, position, articleContent) => {
    event.target.classList.add("draggingElement")
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
    if (event.dataTransfer.getData("type") == "positionUpdate") {
      this.updateElementPosition(id, this.state.initialPosition, position)
    } else if (event.dataTransfer.getData("type") == "mapCreation") {
      this.refs.contentMenu.initAutoComplete({initPosition: position})
    } else if (event.dataTransfer.getData("type") == "textCreation") {
      this.addNewTextContent(this.state.id, {initPosition: position})
    }
  }

  onDropOnContainer = () => {
    this.clearDraggingExtraClasses()
  }

  addNewTextOnDrag = () => {
    event.dataTransfer.setData("type", "textCreation")
  }

  addNewMapOnDrag = () => {
    event.dataTransfer.setData("type", "mapCreation")
  }

  updateElementPosition(id, initPosition, targetPosition) {
    console.log
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
      this.setState({articleElements: sortedElements, activeDragImage: false})
    }).fail((data) => {console.log(data)})
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

        <header className="text-center">
          <input type="text" placeholder="Enter your article title" value={this.state.title} onChange={this.handleTitleChange}/>
        </header>

        <div className="articleContent" >
          {this.state.articleElements.map(element => {
            if (element.class_name == "TextContent") {
              return <TextContentForm key={element.id} textContent={element}
                articleId={this.state.id} position={element.position} id={element.id}
                onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement} />
            }
            else if (element.class_name == "Map") {
              return <MapForm key={element.id} map={element} name={element.name}
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
