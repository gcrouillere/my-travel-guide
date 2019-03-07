import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import AudienceForm from './articleForm/audienceForm'
import TextContentForm from './articleForm/textContentForm'
import MapForm from './articleForm/mapForm'
import ContentMenu from './articleForm/contentMenu'
import DraggingImage from 'images/draggingImage.svg'
import $ from 'jquery'
import update from 'immutability-helper'
import 'react-quill/dist/quill.snow.css';

class ArticleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articleElements: [],
      draggedElementId: null,
      hoveredElement: null,
      draggedElementPosition: null,
      previousHoveredElementPosition: null,
      title: "",
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
    }).fail((data) => {
      console.log(data)
    })
  }

  addNewTextContent = (id) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/text_contents/`,
      dataType: "JSON",
      data: {text_content: {text: "", article_id: id}}
    }).done((data) => {
      const articleElements = update(this.state.articleElements, {$splice: [[0, 0, data]]}).sort((x, y) => x.position - y.position)
      this.setState({ articleElements: articleElements })
    }).fail((data) => {
      console.log(data)
    })
  }

  addNewMap = (id, mapCenter) => {
    document.querySelector(".mapInitialCenterOverlay").classList.remove("active")
    const zoom = (mapCenter.lat == 0 && mapCenter.lng == 0) ? 1 : 11
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/`,
      dataType: "JSON",
      data: {map: {lat: mapCenter.lat, lng: mapCenter.lng, zoom: zoom, article_id: id}}
    }).done((data) => {
      const articleElements = update(this.state.articleElements, {$push: [data]})
      this.setState({ articleElements: articleElements.sort((x, y) => x.position - y.position) })
    }).fail((data) => {
      console.log(data)
    })
  }

  onDragStart = (event, id, position) => {
    this.setState({
      initialPosition: position,
      draggedElementId: id,
      draggedElementPosition: position,
      previousHoveredElementPosition: position
    })

    let elem = document.createElement("div");
    elem.id = "drag-ghost";
    elem.textNode = "Dragging";
    elem.style.position = "absolute";
    elem.style.top = "-200px";
    elem.innerText = "ff"
    document.body.appendChild(elem);
    event.dataTransfer.setDragImage(elem, 0, 0);
   return false
  }

  onDragOver = (event, id, position) => {
    event.preventDefault();
  }

  onDragEnter = (event, id, position) => {
    event.preventDefault();
    if (position !== this.state.draggedElementPosition && position == this.state.previousHoveredElementPosition) {
      if (this.state.draggedElementPosition > position) {
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
    if (position == this.state.draggedElementPosition || position != this.state.previousHoveredElementPosition) {
      document.querySelectorAll(".dropZone-before, .dropZone-after").forEach(x => x.classList.remove("active"))
    }
  }

  onDrop = (event, id, position) => {
    document.querySelectorAll(".dropZone-before , .dropZone-after").forEach(x => x.classList.remove("active"))
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/element_position_update/`,
      dataType: "JSON",
      data: {article: this.state.id, positions: {
        init: {id: this.state.draggedElementId, position: this.state.initialPosition},
        target: {id: id, position: position}
      }}
    }).done((data) => {
      const sortedElements = data.text_contents.concat(data.maps).sort((x, y) => x.position - y.position)
      this.setState({articleElements: sortedElements})
      let ghost = document.getElementById("drag-ghost");
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost)
    })
  }

  render() {
    return (
      <div className="container article-container">

        <AudienceForm id={this.props.match.params.id} />

        <ContentMenu id={this.state.id} addNewTextContent={this.addNewTextContent} addNewMap={this.addNewMap}/>

        <header className="text-center">
          <input type="text" placeholder="Enter your article title" value={this.state.title} onChange={this.handleTitleChange}/>
        </header>

        <div className="articleContent">
          {this.state.articleElements.map(element => {
            if (element.class_name == "TextContent") {
              return <TextContentForm key={element.id} textContent={element}
                articleId={this.state.id} position={element.position} id={element.id}
                onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave} onDrop={this.onDrop} />
            }
            else if (element.class_name == "Map") {
              return <MapForm key={element.id} map={element}
              articleId={this.state.id} position={element.position} id={element.id}
              onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave} onDrop={this.onDrop} />
            }
          })}
        </div>

      </div>
    )
  }
}

export default ArticleForm
