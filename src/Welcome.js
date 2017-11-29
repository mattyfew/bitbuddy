import React, { Component } from 'react'

export default class Welcome extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
      			<h1>Welcome to this site!</h1>
      			{this.props.children}
      		</div>
        )
    }
}
