import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import $ from 'jquery'
import update from 'immutability-helper'

import AudienceForm from './articleForm/audienceForm'
import TextContentForm from './articleForm/textContentForm'
import MapForm from './articleForm/mapForm'
import PhotoForm from './articleForm/photoForm'
import ContentMenu from './articleForm/contentMenu'
import DragImage from './articleForm/dragImage'
import ajaxHelpers from './../utils/ajaxHelpers'
import orderHelper from './../utils/articleContentHelper'
import { fetchArticle } from '../actions/index'

class ArticleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articleElements: [],
      title: "",
      titleValid: false,
      audienceForm: false,
      dropZone: "",
      draggedElementId: null,
      draggingElement: null,
      dragging: false,
      dropTarget: { possibleDrop: null, where: [] },
      forceContentMenuHidding: false,
      initialPosition: null,
      previousHoveredElementPosition: null,
      activeDragImage: false,
      dragContent: {},
      id: null,
      customizationOnGoing: { status: false, trigger: null },
      token: $('meta[name="csrf-token"]').attr('content')
    }

    this.MapFormRef = {}
    this.dragImageRef = React.createRef()
    this.contentMenuRef = React.createRef()
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const article = await ajaxHelpers.ajaxCall('GET', `/articles/${this.props.match.params.id}`, {}, this.state.token)
      this.props.fetchArticle(null, article)

      this.setState({
        title: article.title,
        titleValid: article.title.length > 10,
        id: article.id,
        articleElements: orderHelper.orderArticleElements(article)
      })
    } else {
      let data = { article: { title: "", audiencesSelection:[], user_id: this.props.currentUser.id }}
      const article = await ajaxHelpers.ajaxCall( 'POST', "/articles/", data, this.state.token)
      this.props.fetchArticle(null, article)

      this.setState({
        title: article.title,
        articleElements: [],
        id: article.id
      })
      this.props.history.push(`/articles/${article.id}/edit`)
    }
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value, titleValid: event.target.value.length > 10 })
  }

  saveTitleOnBlur = () => {
    ajaxHelpers.ajaxCall('PUT', `/articles/${this.state.id}`, {article: {title: this.state.title}}, this.state.token)
  }

  addNewTextContent = async (id, initPositionAtCreation = undefined) => {
    const textContent = {text_content: {text: "", article_id: id, position: this.state.articleElements.length}}

    await ajaxHelpers.ajaxCall('POST', "/text_contents", textContent, this.state.token)

    await this.updatePositionAfterCreation(initPositionAtCreation, id)
  }

  addNewMap = async (id, map, initPositionAtCreation) => {
    this.contentMenuRef.current.abandonMapCreation()

    const newMap = update(map, { $merge: {
      position: this.state.articleElements.length,
      article_id: id,
      zoom: map.lat == 0 && map.lng == 0 ? 1 : 11,
      height: 250,
      show_map_center_as_marker: true
    }})

    await ajaxHelpers.ajaxCall('POST', "/maps", { map: newMap }, this.state.token)
    this.updatePositionAfterCreation(initPositionAtCreation, id)
  }

  addNewPhotoBloc  = async (data, initPositionAtCreation) => {
    const photo = { photo: {
      public_id: data.public_id,
      version: data.version,
      signature: data.signature,
      original_width: data.width,
      original_height: data.height,
      bytes: data.bytes,
      format: data.format,
      resource_type: data.resource_type,
      url: data.url,
      original_filename: data.original_filename,
      article_id: this.state.id,
      position: this.state.articleElements.length
    }}

    await ajaxHelpers.ajaxCall('POST', "/photos", photo, this.state.token)
    this.updatePositionAfterCreation(initPositionAtCreation, this.state.id)
  }

  updatePositionAfterCreation = async (initPositionAtCreation, id) => {
    let finalPositionAtCreation = this.definePositionAtCreation(initPositionAtCreation)

    await this.updateElementPosition(id, -1, finalPositionAtCreation)
  }

  deleteElement = async (event, id, position, controller) => {
    await ajaxHelpers.ajaxCall('DELETE', `/${controller}/${id}`, {}, this.state.token)
    this.updateElementPosition(id, undefined, undefined)
  }

  onDragStart = async (event, id, position, articleContent) => {
    event.dataTransfer.setData("type", "positionUpdate")
    this.setState({
      initialPosition: position,
      previousHoveredElementPosition: position,
      activeDragImage: true,
      draggedElementId: id,
      dragContent: articleContent,
      dragging: true,
      draggingElement: position,
    })

    let dragImage = this.dragImageRef.current.getDragImageNode()
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    return false
  }

  onDragOver = (event, id, position) => {
    event.preventDefault();
  }

  onDragEnter = (event, id, position) => {
    event.preventDefault();
    this.setState({forceContentMenuHidding: true})

    if (position !== this.state.initialPosition && position == this.state.previousHoveredElementPosition) {
      if (this.state.initialPosition > position) {
        this.setState({ dropTarget: { possibleDrop: position, where: ["before"] }})
      } else {
        this.setState({ dropTarget: { possibleDrop: position, where: ["after"] }})
        if (position == 0 && this.state.initialPosition == -1) {
          this.setState({ dropTarget: { possibleDrop: position, where: ["before", "after"] }})
        }
      }
    } else {
      this.setState({ dropTarget: { possibleDrop: null, where: [] }, previousHoveredElementPosition: position })
    }

  }

  onDragLeave = (event, id, position) => {
    if (position == this.state.initialPosition || position != this.state.previousHoveredElementPosition) {
      this.setState({ dropTarget: { possibleDrop: null, where: [] }})
    }
  }

  onDrop = async (event, id, position) => {
    this.clearDraggingExtraClasses()
    this.setState({dragging: false, dragContent: {}})
    this.setDropzoneClass(event)

    if (event.dataTransfer.getData("type") == "positionUpdate") {
      await this.updateElementPosition(id, this.state.initialPosition, position)
    } else if (event.dataTransfer.getData("type") == "mapCreation") {
      this.contentMenuRef.current.initAddNewMap(position)
    } else if (event.dataTransfer.getData("type") == "textCreation") {
      await this.addNewTextContent(this.state.id, position)
    } else if (event.dataTransfer.getData("type") == "photoCreation") {
      this.contentMenuRef.current.initAddNewPhotoBloc(position)
    }
  }

  onDropOnContainer = () => {
    this.setState({dragging: false})
    this.clearDraggingExtraClasses()
  }

  addNewComponentOnDrag = (event, trigger) => {
    event.dataTransfer.setData("type", trigger)
    this.setState({initialPosition: -1, dragging: true})
  }

  preventDraggingOnOtherElements = (trigger) => {
    this.setState({customizationOnGoing: {status: !this.state.customizationOnGoing.status, trigger: trigger}})
  }

  updateArticleCompletion = (module) => {
    this.setState(module)
  }

  async updateElementPosition(id, initPosition, targetPosition) {
    let data = {
      article: this.state.id,
      positions: {
        init: {id: id, position: initPosition},
        target: {id: id, position: targetPosition}
    }}

    let newData = await ajaxHelpers.ajaxCall('POST', "/articles/element_position_update/", data, this.state.token)
    this.updateElementsState(newData)
  }

  updateElementsState = (data) => {
    const sortedElements = data.text_contents.concat(data.maps).concat(data.photos).sort((x, y) => x.position - y.position)
    this.setState({articleElements: sortedElements, activeDragImage: false, initialPosition: null, dropZone: ""})
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
      dropItemClasses.map(x => /before/.test(x)).reduce((x, acc) => acc && x) ?
      this.setState({dropZone: "before"}) :
      this.setState({dropZone: "after"})
    }
  }

  hideMapsCustomizations = () => {
    Object.keys(this.MapFormRef).map(mapFormId => { this.MapFormRef[mapFormId].hideMapCustomizations() })
  }

  clearDraggingExtraClasses() {
    this.setState({
      draggingElement: null,
      forceContentMenuHidding: false,
      dropTarget: { possibleDrop: null, where: [] }
    })
  }

  render() {

    return (
      <div className="container article-container" onDrop={this.onDropOnContainer} onDragOver={this.onDragOver}>

        <AudienceForm id={this.props.match.params.id} updateArticleCompletion={this.updateArticleCompletion}
        token={this.state.token} article={this.props.currentArticle}/>

        {this.state.audienceForm &&
          <header className={`maintTitle ${this.state.titleValid ? "complete" : "incomplete"}`}>
            <h2 className="sectionLabel">{this.state.titleValid ? "Article title" : "Write Your Article Title"}</h2>
            {!this.state.titleValid && <p className="mainTitleSub">(10 characters long minimum)</p>}
            <input type="text" placeholder="Type here your article title" value={this.state.title}
            onChange={this.handleTitleChange} onBlur={this.saveTitleOnBlur}/>
          </header>
        }

        {this.state.audienceForm && this.state.titleValid &&
          <ContentMenu id={this.state.id} addNewTextContent={this.addNewTextContent} addNewMap={this.addNewMap}
          addNewPhotoBloc={this.addNewPhotoBloc} addNewComponentOnDrag={this.addNewComponentOnDrag} ref={this.contentMenuRef}
          elementsCount={this.state.articleElements.length} forceContentMenuHidding={this.state.forceContentMenuHidding}/>
        }

        {this.state.audienceForm && this.state.titleValid &&
          <div className="articleContent" >
          <h2 className="sectionLabel">Article content</h2>
            {this.state.articleElements.map(element => {

              let dropTarget = element.position == this.state.dropTarget.possibleDrop ? this.state.dropTarget : null

              if (element.class_name == "TextContent") {
                return <TextContentForm key={`text${element.id}`} textContent={element}
                dragging={this.state.dragging} draggingElement={element.position == this.state.draggingElement}
                dropTarget={dropTarget}
                articleId={this.state.id} position={element.position} id={element.id} token={this.state.token}
                onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement}
                mapCustomizationOnGoing={this.state.customizationOnGoing} hideMapsCustomizations={this.hideMapsCustomizations}/>
              }
              else if (element.class_name == "Map") {
                return <MapForm key={`map${element.id}`} map={element} name={element.name}
                dragging={this.state.dragging} draggingElement={element.position == this.state.draggingElement}
                dropTarget={dropTarget}
                articleId={this.state.id} position={element.position} id={element.id} token={this.state.token}
                onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement}
                preventDraggingOnOtherElements={this.preventDraggingOnOtherElements}
                ref={(ref) => this.MapFormRef[element.id] = ref}/>
              }
              else if (element.class_name == "Photo") {
                return <PhotoForm key={`photo${element.id}`} photo={element}
                dragging={this.state.dragging} draggingElement={element.position == this.state.draggingElement}
                dropTarget={dropTarget}
                articleId={this.state.id} position={element.position} id={element.id} token={this.state.token}
                onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement}
                mapCustomizationOnGoing={this.state.customizationOnGoing} hideMapsCustomizations={this.hideMapsCustomizations}/>
              }
            })}
             <DragImage ref={this.dragImageRef} dragContent={this.state.dragContent} activeDragImage={this.state.activeDragImage}/>
          </div>
        }

      </div>
    )
  }
}

ArticleForm.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    currentArticle: state.currentArticle
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchArticle },
    dispatch
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticleForm))
