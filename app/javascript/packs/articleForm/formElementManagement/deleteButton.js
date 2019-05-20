import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import deleteLogo from './../../../../assets/images/delete-white.svg'

class DeleteButton extends Component {

  deleteElement = (event) => {this.props.deleteElement(event)}

  render() {

    return (
      <div onClick={this.deleteElement} className="contentDelete">
        <img src={deleteLogo}/>
      </div>
    )
  }
}

DeleteButton.propTypes = {
  deleteElement: PropTypes.func.isRequired
}

export default DeleteButton
