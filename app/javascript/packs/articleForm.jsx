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
import DoubleContentForm from './articleForm/doubleContentForm'
import ContentMenu from './articleForm/contentMenu'
import ValidationMenu from './articleForm/validationMenu'
import DragImage from './articleForm/dragImage'
import ajaxHelpers from './../utils/ajaxHelpers'
import orderHelper from './../utils/articleContentHelper'
import { fetchArticle } from '../actions/index'

export class ArticleForm extends Component {
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
    const textContent = { text_content: { text: "", article_id: id, position: this.state.articleElements.length } }

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

  // TODO
  addNewMixedContent = async (selectedContents, initPositionAtCreation) => {
    const doubleContentData = { double_content: { article_id: this.state.id, position: this.state.articleElements.length }}
    const doubleContent = await ajaxHelpers.ajaxCall('POST', "/double_contents", doubleContentData, this.state.token)

    Object.keys(selectedContents).forEach(box => {
      const controller = `${selectedContents[box].text.toLowerCase()}`
      let data = { [controller]: selectedContents[box].content }
      console.log(data)
      const newdata = update(data, { [controller]: { double_content_id: { $set: doubleContent.id }, position: { $set:  box.split("")[3] - 1 }}})
      console.log(newdata)
      ajaxHelpers.ajaxCall('POST', `/${controller}s`, newdata, this.state.token)
    })

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

  moveUp = async (id, position) => {
    await this.updateElementPosition(id, position, position - 1)
  }

  moveDown = async (id, position) => {
    await this.updateElementPosition(id, position, position + 1)
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
    const sortedElements = data.text_contents
      .concat(data.maps)
      .concat(data.photos)
      .concat(data.double_contents)
      .sort((x, y) => x.position - y.position)

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
      <div className="container article-container-form" onDrop={this.onDropOnContainer} onDragOver={this.onDragOver}>

        <AudienceForm id={this.props.match.params.id} updateArticleCompletion={this.updateArticleCompletion}
            token={this.state.token} article={this.props.currentArticle}/>

        <div className="row">
          <div className="col">
            {this.state.audienceForm &&
              <header className={`maintTitle ${this.state.titleValid ? "complete" : "incomplete"}`}>
                <h2 className="sectionLabel">{this.state.titleValid ? "Article title" : "Write Your Article Title"}</h2>
                {!this.state.titleValid && <p className="mainTitleSub">(10 characters long minimum)</p>}
                <input type="text" placeholder="Type here your article title" value={this.state.title}
                onChange={this.handleTitleChange} onBlur={this.saveTitleOnBlur}/>
              </header>
            }
          </div>
        </div>

        {this.state.audienceForm && this.state.titleValid &&
          <div className="menus">
            <ContentMenu id={this.state.id} addNewTextContent={this.addNewTextContent} addNewMap={this.addNewMap}
            addNewPhotoBloc={this.addNewPhotoBloc} addNewComponentOnDrag={this.addNewComponentOnDrag} ref={this.contentMenuRef}
            addNewMixedContent={this.addNewMixedContent}
            elementsCount={this.state.articleElements.length} forceContentMenuHidding={this.state.forceContentMenuHidding}/>
            <ValidationMenu articleElements={this.state.articleElements} token={this.state.token} id={this.state.id}/>
          </div>
        }

        {this.state.audienceForm && this.state.titleValid &&
          <div className="articleContent" >
            <div className="row">
              <div className="col">
                <h2 className="sectionLabel">Article content</h2>
              </div>
            </div>
            {this.state.articleElements.map(element => {

              let dropTarget = element.position == this.state.dropTarget.possibleDrop ? this.state.dropTarget : null

              if (element.class_name == "TextContent") {
                return (
                <div className="row" key={`text${element.id}`}>
                  <div className="col" key={`text${element.id}`}>
                    <TextContentForm key={`text${element.id}`} textContent={element}
                    dragging={this.state.dragging} draggingElement={element.position == this.state.draggingElement}
                    dropTarget={dropTarget} draggable={true}
                    articleId={this.state.id} position={element.position} id={element.id} token={this.state.token}
                    onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement}
                    mapCustomizationOnGoing={this.state.customizationOnGoing} hideMapsCustomizations={this.hideMapsCustomizations}
                    moveUp={this.moveUp} moveDown={this.moveDown}/>
                  </div>
                </div>
                )
              }
              else if (element.class_name == "Map") {
                return (
                <div className="row" key={`map${element.id}`}>
                  <div className="col" key={`map${element.id}`}>
                    <MapForm key={`map${element.id}`} map={element} name={element.name}
                    dragging={this.state.dragging} draggingElement={element.position == this.state.draggingElement}
                    dropTarget={dropTarget} draggable={true}
                    articleId={this.state.id} position={element.position} id={element.id} token={this.state.token}
                    onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement}
                    preventDraggingOnOtherElements={this.preventDraggingOnOtherElements}
                    moveUp={this.moveUp} moveDown={this.moveDown}
                    ref={(ref) => this.MapFormRef[element.id] = ref}/>
                  </div>
                </div>
                )
              }
              else if (element.class_name == "Photo") {
                return (
                <div className="row" key={`photo${element.id}`}>
                  <div className="col" key={`photo${element.id}`}>
                    <PhotoForm key={`photo${element.id}`} photo={element}
                    dragging={this.state.dragging} draggingElement={element.position == this.state.draggingElement}
                    dropTarget={dropTarget} draggable={true}
                    articleId={this.state.id} position={element.position} id={element.id} token={this.state.token}
                    onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement}
                    mapCustomizationOnGoing={this.state.customizationOnGoing} hideMapsCustomizations={this.hideMapsCustomizations}
                    moveUp={this.moveUp} moveDown={this.moveDown}/>
                  </div>
                </div>
                )
              }

              else if (element.class_name == "DoubleContent") {
                return (
                <div className="row" key={`double-content${element.id}`}>
                  <div className="col" key={`double-content${element.id}`}>
                    <DoubleContentForm key={`double-content${element.id}`} doubleContent={element}
                    dragging={this.state.dragging} draggingElement={element.position == this.state.draggingElement}
                    dropTarget={dropTarget} draggable={true}
                    articleId={this.state.id} position={element.position} id={element.id} token={this.state.token}
                    onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={this.deleteElement}
                    mapCustomizationOnGoing={this.state.customizationOnGoing} hideMapsCustomizations={this.hideMapsCustomizations}
                    moveUp={this.moveUp} moveDown={this.moveDown}
                    ref={(ref) => { if (element.maps) this.MapFormRef[element.maps[0]] = ref }}/>
                  </div>
                </div>
                )
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
