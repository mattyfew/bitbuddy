import React, { Component } from 'react'
import { HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom'

import Login from './Login'
import Registration from './Registration'
import Particles from 'react-particles-js';


export default class Welcome extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="main-wrapper" id="welcome-container" >
                <Particles
                  params={ particles }

                  style={{
                    width: '100%',
                    position: 'absolute',
                    zIndex: -1
                  }}
                />

                <div id="welcome-grid">
                    <div className="welcome-container welcome-container-left">
                        <h1>Bitbuddy</h1>
                        <h2>Where Blockchain Enthusiasts Connect</h2>
                    </div>
                    <div className="welcome-container welcome-container-right">
                        <HashRouter>
                            <div className="forms">
                                <Switch>
                                    <Route exact path="/" component={Registration} />
                                    <Route path="/login" component={Login} />
                                    <Redirect path="*" to="/" />
                                </Switch>
                            </div>
                        </HashRouter>
                    </div>
                </div>
      		</div>
        )
    }
}

const particles = {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#977CF6"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#977CF6"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#977CF6",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}
