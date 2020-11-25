import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import _ from 'lodash';
import HeaderBar from "./lib/header-bar.js"

import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

import light from './themes/light';
import dark from './themes/dark';

import { Text, Box } from '@tlon/indigo-react';


export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false
    }
    this.updateTheme = this.updateTheme.bind(this);
  }

  updateTheme(updateTheme) {
    this.setState({ dark: updateTheme });
  }

  componentDidMount() {
    this.themeWatcher = window.matchMedia('(prefers-color-scheme: dark)');
    this.setState({ dark: this.themeWatcher.matches });
    this.themeWatcher.addListener(this.updateTheme);
  }

  render() {

    return (
      <BrowserRouter>
        <ThemeProvider theme={this.state.dark ? dark : light}>
        <Box display='flex' flexDirection='column' position='absolute' backgroundColor='white' height='100%' width='100%' px={[0,4]} pb={[0,4]}>
        <HeaderBar/>
        <Route exact path="/~canvas" render={ () => {
          return (
            <Box height='100%' p='4' display='flex' flexDirection='column' borderWidth={['none', '1px']} borderStyle="solid" borderColor="washedGray">
              <Text fontSize='1'>canvas</Text>
              <Text pt='3'>Bienvenido to your Landscape application.</Text>
              <Text pt='3'>To get started, edit <code>src/index.js</code> or <code>urbit/app/canvas.hoon</code> and <code>|commit %home</code> on your Urbit ship to see your changes.</Text>
              <a className="db f8 pt3" href="https://urbit.org/docs">-> Read the docs</a>
            </Box>
          )}}
        />
        </Box>
        </ThemeProvider>
      </BrowserRouter>
    )
  }
}

