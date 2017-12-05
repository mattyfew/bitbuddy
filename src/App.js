import React, { Component } from 'react'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const children = React.cloneElement(this.props.children, {
            random: 'RANDOMPROPYOOO'
        })
        return (
            <div>
                <h1>App</h1>

                {children}
            </div>
        )
    }
}
