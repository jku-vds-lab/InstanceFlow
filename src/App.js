import React, {Component} from 'react';
import './App.css';
import MainPage from "./components/MainPage";
import {DataProvider} from "./components/DataProvider";
import ReactTooltip from "react-tooltip";

class App extends Component {
  render() {
    return (
      <div className="App">
        <DataProvider>
          <MainPage />
        </DataProvider>
      </div>
    );
  }
}

export default App;
