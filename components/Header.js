// Module imports
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'





// Component imports
import Component from './Component'
import Nav from './Nav'
import SqueakmasAlert from './SqueakmasAlert'





let showSqueakmas = false
let now = new Date
let hours = now.getUTCHours()
let date = now.getUTCDate()
let dateIsInRange = date >= 1 && date <= 12
let monthIsCorrect = now.getUTCMonth() === 11
let yearIsCorrect = now.getUTCFullYear() === 2017

if (dateIsInRange && monthIsCorrect && yearIsCorrect) {
  if ((date === 1 && hours > 12) || date > 1) {
    showSqueakmas = true
  }
}





class Header extends React.Component {
  render () {
    let {
      loggedIn,
      isServer,
      path,
    } = this.props

    let getHelpClasses = [
      'get-help',
    ]

    if (isServer) {
      getHelpClasses.push('hide')
    }

    if (!/(^\/i-need-fuel|\/$)/.test(path)) {
      getHelpClasses.push('show')
    }

    return (
      <div id="header-container">
        <input id="nav-control" type="checkbox" />

        <label title="Expand/Collapse Menu" htmlFor="nav-control" className="burger" id="burger">
          <i className="fa fa-bars fa-3x" aria-hidden="true"></i>
        </label>

        <header role="banner">

          <Link href="/">
            <a
              className="spin-3d"
              title="Home">
              <img
                alt="Fuel Rats logo"
                className="brand"
                src="/static/images/logo2.png" />
            </a>
          </Link>

          <Nav />

          <div className="join-actions">
            {!loggedIn && (
              <Link href="/register">
                <a className="button secondary">
                  Join Us
                </a>
              </Link>
            )}

            <div className={getHelpClasses.join(' ')}>
              <Link href="/i-need-fuel">
                <a className="button">
                  Get Help
                </a>
              </Link>
            </div>
          </div>
        </header>

        {showSqueakmas && <SqueakmasAlert />}
      </div>
    )
  }
}





const mapStateToProps = state => {
  let {
    loggedIn,
  } = state.authentication

  return {
    loggedIn,
  }
}





export default connect(mapStateToProps, null)(Header)
