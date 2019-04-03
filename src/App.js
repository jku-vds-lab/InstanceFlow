import React, {Component} from 'react';
import './App.css';
import MainPage from "./components/MainPage";
import {DataConsumer, DataProvider} from "./components/DataProvider";
import {BrowserRouter as Router, Route} from "react-router-dom";
import ChangersPage from "./components/Changers/ChangersPage";
import ReactTooltip from "react-tooltip";

class App extends Component {
  render() {
    return (
      <div className="App">
        <DataProvider>
          <Router>
            <DataConsumer>
              {data =>
                data.raw_data ? <div>
                  <Route path="/" exact component={MainPage}/>
                  <Route path="/changers/" exact component={ChangersPage}/>
                </div> : <div>Loading Application</div>
              }
            </DataConsumer>
          </Router>
        </DataProvider>
        <ReactTooltip effect="solid"/>
      </div>
    );
  }
}

export default App;
