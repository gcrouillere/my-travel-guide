import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import ajaxHelpers from '../../utils/ajaxHelpers'
import orderHelper from '../../utils/articleContentHelper'

class ValidationMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mobileMenuActive: false,
      articleValid: false
    }
  }

  static validations = {
    outputs: {
      textContentPresence: ["Text present", "At least one text box"],
      textContentNotEmpty: ["Text length OK", "Text at least 300 characters long"],
      mapPresence: ["Map present", "At least one map"],
      oneMarker: ["Markers present", "At least one marker on each map"],
      photoPresence: ["Photo present", "At least one photo"],
    },
    functions: {
      textContentPresence: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'TextContent')
      },
      textContentNotEmpty: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'TextContent') ?
          articleElements.filter(x => x.class_name === 'TextContent').some(x => x.text.length > 300) :
          false
      },
      mapPresence: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'Map')
      },
      oneMarker: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'Map') ?
          articleElements.filter(x => x.class_name === 'Map').every(x => x.markers ? x.markers.length > 0 : false) :
          false
      },
      photoPresence: (articleElements) => {
       return ValidationMenu.anyThing(articleElements, 'Photo')
      }
    }
  }

  static anyThing = (articleElements, thing) => {
    return articleElements.some(x => x.class_name === thing)
  }

  componentDidUpdate = async (prevProps) => {
    const newStatus = await this.checkArticleValidity()
    if (this.state.articleValid !== newStatus) this.updateArticleValidity()
  }

  componentDidMount = () => {
    this.updateArticleValidity()
  }

  updateArticleValidity = async () => {
    const article_valid = await this.checkArticleValidity()

    this.setState({ articleValid:  article_valid })
    ajaxHelpers.ajaxCall('PUT', `/articles/${this.props.id}`, { article: { article_valid: article_valid }}, this.props.token)
  }

  checkArticleValidity = async () => {
    return Object.keys(ValidationMenu.validations.outputs).every( fname =>
      ValidationMenu.validations.functions[fname](this.props.articleElements))
  }

  displayValidations = () => {
    return Object.keys(ValidationMenu.validations.outputs).map( fname =>
      ValidationMenu.validations.functions[fname](this.props.articleElements) ?
      <p key={fname} className="valid">{ ValidationMenu.validations.outputs[fname][0] }</p> :
      <p key={fname} className="not-valid">{ ValidationMenu.validations.outputs[fname][1] }</p>
    )
  }

  showMobileMenu = () => { this.setState({ mobileMenuActive: true }) }

  hideMobileMenu = () => { this.setState({ mobileMenuActive: false }) }

  render() {
    return(
      <div id="validationMenu" className="validationMenu">

      <div className="mobile-activation validation" style={{background: `${this.state.articleValid ? "#b8c7b5" : "#e3a496"}`}}
        onClick={this.showMobileMenu}>Check</div>

        <div className={`menuBody ${this.state.mobileMenuActive ? "active" : ""}`}>

          <div className="mobile-menu-header navbar navbar-light bg-dark">
            <div>Article status</div>
            <button onClick={this.hideMobileMenu} className="close mobile-close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="expand validation">
            <div className="chevron-closed">></div>
            <div className="chevron-open">&lt;</div>
            <div className="menu">
              <p>C</p>
              <p>H</p>
              <p>E</p>
              <p>C</p>
              <p>K</p>
            </div>
          </div>

          <div className="buttons">
            { this.displayValidations() }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentArticle: state.currentArticle
  }
}

export default connect(mapStateToProps)(ValidationMenu)
