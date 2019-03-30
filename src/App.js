import React, {Component} from 'react';
import './App.css';
import MainPage from "./components/MainPage";
import {DataProvider} from "./components/DataProvider";

class App extends Component {
  render() {
    return (
      <div className="App">
        <DataProvider>
          <MainPage name="TEST"/>
        </DataProvider>
      </div>
    );
  }
}

export default App;
