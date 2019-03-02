import React, { Component } from 'react'

class ContentMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chevron: ">"
    }
  }

  addNewTextContent = () => {this.props.addNewTextContent(this.props.id)}

  addNewMap = () => {this.props.addNewMap(this.props.id)}

  expandMenu = (event) => {
    const classList = Array.from(document.querySelector(".contentMenu").classList)
    if (classList.indexOf("expanded") == -1) {
      document.querySelector(".contentMenu").classList.add("expanded")
      this.setState({chevron: "<"})
    } else {
       document.querySelector(".contentMenu").classList.remove("expanded")
       this.setState({chevron: ">"})
    }
  }

  render() {
    return(
      <div className="contentMenu">
        <div className="buttons">
          <div className="blocAddition"><button className="btn btn-dark" onClick={this.addNewTextContent}>Add new text bloc</button></div>
          <div className="blocAddition"><button className="btn btn-dark" onClick={this.addNewMap}>Add new map</button></div>
        </div>
        <div className="expand" onClick={this.expandMenu}><span>{this.state.chevron}</span></div>
      </div>
    )
  }
}

export default ContentMenu
