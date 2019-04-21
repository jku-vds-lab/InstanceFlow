import React, {Component} from 'react';
import './App.css';
import MainPage from "./components/MainPage";
import {DataConsumer, DataProvider} from "./components/DataProvider";
import {BrowserRouter as Router, Route} from "react-router-dom";
import ChangersPage from "./components/Changers/ChangersPage";
import ReactTooltip from "react-tooltip";
import {createMuiTheme} from "@material-ui/core";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import Grid from "@material-ui/core/Grid/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiAppBar: {
      colorDefault: {
        backgroundColor: "white"
      }
    },
    MuiTableRow: {
      root: {
        height: "24px"
      },
      head: {
        height: "32px",
      }
    },
    MuiTableCell: {
      paddingDense: {
        padding: "0px 2px",
        paddingRight: "2px"
      }
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline/>
        <DataProvider>
          <MuiThemeProvider theme={theme}>
            <Router>
              <DataConsumer>
                {data =>
                  data.raw_data ? <div>
                    <Route path="/" exact component={MainPage}/>
                    <Route path="/changers/" exact component={ChangersPage}/>
                  </div> : <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{minHeight: '100vh'}}
                  >

                    <Grid item xs={12}>
                      {/*<CircularProgress/>*/}
                      <img src="/logo.gif" alt="Loading Icon" width="100px" height="100px"/>
                    </Grid>
                    <Grid item xs={12}>
                      Loading Application...
                    </Grid>
                  </Grid>
                }
              </DataConsumer>
            </Router>
          </MuiThemeProvider>
        </DataProvider>
        <ReactTooltip/>
      </div>
    );
  }
}

export default App;
