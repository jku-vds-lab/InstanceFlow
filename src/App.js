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
                  </div> : <div><CircularProgress/>
                    Loading Application</div>
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
