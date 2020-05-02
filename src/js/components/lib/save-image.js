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
      awaiting: false,
      saved: false
    }
    this.removeColorPalette = this.removeColorPalette.bind(this);
    this.removeMeshPalette = this.removeMeshPalette.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setState({
      results: this.props.chats,
    });
  }

  componentDidUpdate() {
    if (this.state.awaiting && this.props.saved) {
      this.setState({
        awaiting: false
      });
    }
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

  removeMeshPalette(event) {
    this.setState({
      removeMesh: !!event.target.checked
    });
  }

  onClickSave () {
    const { props, state } = this;
    this.setState({
      error: false,
      success: true,
      awaiting: true
    }, () => {
      let save = props.save(state.removeColor, state.removeMesh);
    });
  }

  render() {
    const { props, state } = this;
    console.log("saved", this.props.saved);

    let buttonOpened = (state.open)
      ? "gray2 bg-white bg-gray0-d b--gray2" : "green2 bg-white bg-gray0-d b--green2";

    let saveClasses= "f9 ba pa2 pointer bg-transparent mt2 b--green2 green2";

    let dropdownClass = (state.open)
      ? "absolute pa3 db z-2 bg-white bg-gray0-d white-d ba b--gray3 b--gray1-d"
      : "dn";

    let removeColorPaletteClass = state.removeColor
      ? "relative checked bg-green2 br3 h1 toggle v-mid z-0"
      : "relative bg-gray4 bg-gray1-d br3 h1 toggle v-mid z-0";

    let removeMeshClass = state.removeMesh
      ? "relative checked bg-green2 br3 h1 toggle v-mid z-0"
      : "relative bg-gray4 bg-gray1-d br3 h1 toggle v-mid z-0";

    return (
      <div className="ml3 dib">
        <div className={buttonOpened}
        onClick={() => this.toggleOpen()}
        ref={(el) => this.toggleButton = el}>
          <p className="pointer f9 ba pv3 ph4 ">Export as File</p>
        </div>
        <div className={dropdownClass}
          style={{ maxHeight: "24rem", width: 228, right: "0px" }}
          ref={(el) => { this.dropdown = el }}>
          { (props.hasMesh) ?
              (<div className="mv1">
                <input
                  type="checkbox"
                  style={{ WebkitAppearance: "none", width: 28 }}
                  className={removeMeshClass}
                  onChange={this.removeMeshPalette}
                />
                <span className="dib f9 white-d inter ml3">Remove Hexagonal Mesh</span>
                <p className="f9 gray2 pt1" style={{ paddingLeft: 40 }}>
                  Keeping the hexagonal mesh would increase the file size.
                </p>
              </div>
            ) : null
          }
          <div className="mv1">
            <input
              type="checkbox"
              style={{ WebkitAppearance: "none", width: 28 }}
              className={removeColorPaletteClass}
              onChange={this.removeColorPalette}
            />
            <span className="dib f9 white-d inter ml3">Remove Color Palette</span>
          </div>
          <button
            onClick={this.onClickSave.bind(this)}
            className={saveClasses}>
            Save
          </button>
          <Spinner awaiting={this.state.awaiting} classes="mt4" text="Saving image..." />
        </div>
      </div>

    );
  }
}
