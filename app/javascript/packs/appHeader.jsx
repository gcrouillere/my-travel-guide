import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class AppHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentLocation: this.props.location.pathname
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({currentLocation: newProps.location.pathname})
  }

  render () {
    return(
      <div>
        <nav className="navbar navbar-light bg-dark">
          <Link to="/" className="navbar-brand nav-link text-white">
            My Travel Guide
          </Link>
          {this.state.currentLocation.match(/^\/$|^\/articles$/) &&
            <Link to="/articles/new" className="nav-link text-white">
              Create article
            </Link>
          }
        </nav>
      </div>
    )
  }
}

AppHeader.propTypes = {
  location: PropTypes.object.isRequired
}

export default AppHeader
