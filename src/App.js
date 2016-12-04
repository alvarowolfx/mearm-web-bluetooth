import React, { Component } from 'react';
import './App.css';

import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Slider from 'material-ui/Slider';
import Card from 'material-ui/Card';

import GitHubForkRibbon from 'react-github-fork-ribbon';

import MeArm from './MeArm';

class App extends Component {
  meArm: null;

  constructor(props){
    super(props);

    this.meArm = new MeArm();
    this.state = {
      connected: false,
      supportsWebBluetooth: !!navigator.bluetooth,
      arm: {
        base: 90,
        shoulder: 90,
        elbow: 90,
        gripper: true
      }
    }
  }

  searchDevice(){
    console.log('Search devices');
    this.meArm.connect()
      .then( connected => {
        this.setState({ connected });
      })
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.arm !== prevState.arm){
      if(!this.state.connected) return;

      try{
        this.meArm.updateArm(this.state.arm);
      }catch(e){
        this.meArm.updateArm(this.state.arm);
      }
    }
  }

  handleChange(value, input){
    //console.log(input, value);
    this.setState({
      arm: {
        ...this.state.arm,
        [input]: value
      }
    });
  }

  renderControls(){
    let inputs = {
      elbow: {
        label: 'Elbow - Up/Down',
        axis: 'y'
      },
      base: {
        label: 'Base - Left/Right',
        axis: 'x'
      },
      shoulder: {
        label: 'Shoulder - Forward/Backward',
        axis: 'y'
      }
    };
    let gripper = this.state.arm.gripper;
    return (
      <div>
          {Object.keys(inputs).map( key => {
            return (
              <div key={key} >
                <label>
                  {inputs[key].label}({this.state.arm[key]})
                  <Slider max={160} min={10} step={1}
                    value={this.state.arm[key]}
                    style={{flex: 1}}
                    onChange={ (event,value) => this.handleChange(value, key)}/>
                </label>
                <br/>
              </div>
            );
          })}
          <RaisedButton onClick={ () => this.handleChange(!gripper, 'gripper')}
              secondary={gripper} primary={!gripper}
              label={gripper ? 'Close grip' : 'Open grip'}
              fullWidth/>
        </div>
    );
  }

  renderNotSupported(){
    return (
      <h4>
        This browser don't support web-bluetooth api :(
      </h4>
    );
  }

  render() {
    let { connected, supportsWebBluetooth } = this.state;

    return (
      <div className="app">
        <AppBar title="MeArm Web Bluetooth Experiment"
          showMenuIconButton={false}/>
        <GitHubForkRibbon href="//github.com/alvarowolfx/mearm-web-bluetooth"
          target="_blank" position="right" color="black">
          Fork me on Github
        </GitHubForkRibbon>
        <Card className="content">
          {!supportsWebBluetooth && this.renderNotSupported()}
          {connected && this.renderControls()}
          {!connected && supportsWebBluetooth &&
            <RaisedButton onClick={ () => this.searchDevice()}
              label="Search MeArm" primary/>}
        </Card>
      </div>
    );
  }
}

export default App;
