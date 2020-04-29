import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import { TemplateSelector } from "/lib/template-selector";


export class NewScreen extends Component {
  constructor(props) {
    super(props);
    const templates = {
      'mesh': 'Hexagon Mesh',
      'draw': 'Free-hand Canvas',
      'europe': 'Western Europe',
      'africa': 'Africa',
      'us-counties': 'U.S. Counties',
      'us-states': 'U.S. States'
    };
    this.state = {
      open: false,
      placeholder: 'Choose a template (default: Hexagon Mesh)',
      template: "mesh",
      searchTerm: "",
      results: Object.entries(templates),
      templates: templates
    }

    this.canvasNameChange = this.canvasNameChange.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.search = this.search.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
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

  canvasNameChange(event) {
    const asciiSafe = event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    this.setState({
      canvasName: event.target.value
      // idName: asciiSafe + '-' + Math.floor(Math.random()*10000), // uniqueness
    });
  }

  search(evt) {
    // this.setState({searchTerm: evt.target.value});
    let term = evt.target.value.toLowerCase();

    // if (term.length < 3) {
    //   return this.setState({results: []})
    // }

    let templateMatches = [];
    templateMatches = Object.entries(this.state.templates).filter(e => {
      return (e[0].includes(term) ||
              e[0].split('-').includes(term) ||
              e[1].toLowerCase().includes(term));
    });
    this.setState({results: templateMatches});
  }

  selectTemplate(template) {
    console.log(template);
    this.setState({
      placeholder: this.state.templates[template],
      template: template,
      open: false
    });
  }

  onClickCreate() {
    const { props, state } = this;
    if (!(state.canvasName)) return;
    this.setState({
      error: false,
      success: true,
      awaiting: true
    }, () => {
      props.api.canvas.create(
        state.canvasName,
        state.template,
        '~' + ship
      ).then(() => {
        this.setState({
          awaiting: false
        });
        // store.setState(prevState => ({
        //   canvasList: {
        //     ...prevState.canvasList,
        //     [state.canvasName]: {
        //       "data": {},
        //       "metadata": {
        //         "name": state.canvasName,
        //         "type": "mesh",
        //         "location": '~' + ship
        //       }
        //     }
        //   }
        // }));
        props.history.push(`/~canvas/item/${state.canvasName}`);
      })
    });
  }

  render() {
    const { props, state } = this;

    let buttonOpened = (state.open)
      ? "bg-gray5 bg-gray1-d white-d" : "hover-bg-gray5 hover-bg-gray1-d white-d";

    let allowCreate = "f9 ba pa2 pointer bg-transparent " +
    (state.canvasName ? "b--green2 green2" : "b--gray4 gray4 b--gray2-d gray2-d")

    let dropdownClass = (state.open)
      ? "absolute db z-2 bg-white bg-gray0-d white-d ba b--gray3 b--gray1-d"
      : "dn";

    const templateList = state.results.map((each, i) => {
      return (
        <li key={each[0]}
            className="tl list white-d f9 pv2 ph3 pointer hover-bg-gray4 hover-bg-gray1-d inter"
            onClick={() => this.selectTemplate(each[0])}>
          <span className="mix-blend-diff white">{each[1]}</span>
        </li>)
    });

    let displayNameErrElem = (<span />);
    if (this.state.displayNameError) {
      displayNameErrElem = (
        <span className="f9 inter red2 ml3 mt1 db">
          Canvas must have a title.
        </span>
        );
    }

    return (
      <div className="h-100 w-100 mw6 pa3 pt4 overflow-x-hidden bg-gray0-d white-d flex flex-column">
        <div className="w-100 dn-m dn-l dn-xl inter pt1 pb6 f8">
          <Link to="/~canvas/">{"⟵ All Groups"}</Link>
        </div>
        <div className="w-100 mb4 pr6 pr0-l pr0-xl">

          <h2 className="f8 pt6">Create Canvas</h2>

          <h2 className="f8">Name</h2>
          <textarea
            className={
              "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
              "focus-b--black focus-b--white-d"
            }
            rows={1}
            placeholder="My awesome canvas"
            style={{
              resize: "none",
              height: 48,
              paddingTop: 14
            }}
            onChange={this.canvasNameChange}
          />
          {displayNameErrElem}

          <h2 className="f8">Template</h2>
          <div className="w-100 pb4">
            <textarea
              className={
                "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                "focus-b--black focus-b--white-d"
              }
              rows={1}
              placeholder={this.state.placeholder}
              style={{
                resize: "none",
                height: 48,
                paddingTop: 14
              }}
              onChange={this.search}
              onClick={() => this.toggleOpen()}
              ref={(el) => this.toggleButton = el}
            />
          </div>
          <div className={dropdownClass}
              style={{ maxHeight: "24rem", width: 285 }}
              ref={(el) => { this.dropdown = el }}>
            {templateList}
          </div>

          <button
            onClick={this.onClickCreate.bind(this)}
            className={allowCreate}>
            Create Canvas
          </button>
          <Link to="/~canvas">
            <button className="f9 ml3 ba pa2 b--black pointer bg-transparent b--white-d white-d">Cancel</button>
          </Link>
        </div>
      </div>
    );
  }
}
