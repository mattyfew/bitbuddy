import React, { Component } from 'react'

export default class Welcome extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="main-wrapper" id="welcome-container" >
      			<h1>Welcome to BitBuddy!</h1>
      			{this.props.children}
      		</div>
        )
    }
}
