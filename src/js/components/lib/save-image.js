import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import { Spinner } from './icons/icon-spinner';


export class SaveImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      removeColor: false,
      removeMesh: false,
      awaiting: false
    }
    this.removeColorPalette = this.removeColorPalette.bind(this);
    this.removeMesh = this.removeMesh.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setState({ results: this.props.chats });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggleOpen() {
    this.setState({open: !this.state.open});
  }

  handleClickOutside(evt) {
    if ((this.dropdown && !this.dropdown.contains(evt.target))
    && (this.toggleButton && !this.toggleButton.contains(evt.target))) {
      this.setState({ open: false });
    }
  }

  removeColorPalette(event) {
    this.setState({
      removeColor: !!event.target.checked
    });
  }

  removeMesh(event) {
    this.setState({
      removeMesh: !!event.target.checked
    });
  }

  onClickSave () {
    this.setState({
      error: false,
      success: true,
      awaiting: true
    }, () => {
      let save = props.save(this.state.chat);
      save.then(() => {
        this.setState({awaiting: false});
      })
    });
  }

  render() {
    const { props, state } = this;

    let buttonOpened = (state.open)
      ? "gray22 bg-gray0-d b--gray2" : "green2 bg-gray0-d b--green2";

    let saveClasses= "f9 ba pa2 pointer bg-transparent mt2 b--green2 green2";

    let dropdownClass = (state.open)
      ? "absolute pa3 db z-2 bg-white bg-gray0-d white-d ba b--gray3 b--gray1-d"
      : "dn";

    let removeColorPaletteClasses = state.removeColor
      ? "relative checked bg-green2 br3 h1 toggle v-mid z-0"
      : "relative bg-gray4 bg-gray1-d br3 h1 toggle v-mid z-0";

    let removeMeshClasses = state.removeMesh
      ? "relative checked bg-green2 br3 h1 toggle v-mid z-0"
      : "relative bg-gray4 bg-gray1-d br3 h1 toggle v-mid z-0";

    let removeMesh = <div />;
    if (props.hasMesh) {
      removeMesh = (<div className="mv1">
        <input
          type="checkbox"
          style={{ WebkitAppearance: "none", width: 28 }}
          className={removeMeshClasses}
          onChange={this.removeMeshPalette}
        />
        <span className="dib f9 white-d inter ml3">Hexagonal Mesh</span>
        <p className="f9 gray2 pt1" style={{ paddingLeft: 40 }}>
          The final image won't have the hexagonal mesh
        </p>
      </div>);
    }

    return (
      <div className="ml1 dib">
        <div className={buttonOpened}
        onClick={() => this.toggleOpen()}
        ref={(el) => this.toggleButton = el}>
          <p className="pointer f9 ba pv3 ph4 ">Save as File</p>
        </div>
        <div className={dropdownClass}
          style={{ maxHeight: "24rem", width: 210, right: "0px" }}
          ref={(el) => { this.dropdown = el }}>
          <div className="mv1">
            <input
              type="checkbox"
              style={{ WebkitAppearance: "none", width: 28 }}
              className={removeColorPaletteClasses}
              onChange={this.removeColorPalette}
            />
            <span className="dib f9 white-d inter ml3">Color Palette</span>
            <p className="f9 gray2 pt1" style={{ paddingLeft: 40 }}>
              The final image won't have the color palette
            </p>
          </div>
          { removeMesh }
          <button
            onClick={this.onClickSave.bind(this)}
            className={saveClasses}>
            Save Image as File
          </button>
          <Spinner awaiting={this.state.awaiting} classes="mt4" text="Saving image..." />
        </div>
      </div>

    );
  }
}
