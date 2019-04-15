import React, {Component} from 'react';
import './App.css';
import MainPage from "./components/MainPage";
import {DataConsumer, DataProvider} from "./components/DataProvider";
import {BrowserRouter as Router, Route} from "react-router-dom";
import ChangersPage from "./components/Changers/ChangersPage";
import ReactTooltip from "react-tooltip";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import {createMuiTheme} from "@material-ui/core";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import Grid from "@material-ui/core/Grid/Grid";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
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

class App extends Component {
  render() {
    return (
      <div className="App">
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
                      <CircularProgress/>
                    </Grid>
                    <Grid item xs={12}>
                      Loading Application
                    </Grid>
                  </Grid>
                }
              </DataConsumer>
            </Router>
          </MuiThemeProvider>
        </DataProvider>
        <ReactTooltip effect="solid"/>
      </div>
    );
  }
}

export default App;
