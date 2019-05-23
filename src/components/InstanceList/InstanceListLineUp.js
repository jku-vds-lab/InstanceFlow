import React, {Component} from "react";
import "./InstanceList.css"
import {withFlowData} from "../InstanceFlow/FlowDataProvider";
import {withData} from "../DataProvider";
import {
  LineUpCategoricalColumnDesc,
  LineUpNumberColumnDesc,
  LineUpStringColumnDesc, Taggle
} from "lineupjsx";

class InstanceListLineUp extends Component {
  state = {
    selection: []
  };

  render() {
    const {instances, epochs} = this.props;
    const {raw_data, classes, labels, activeInstances, deactivateAllInstances, activateInstances, clickedInstances, getLabel} = this.props.data;

    const data = instances
      .filter(instance => instance.displayInList)
      .map(instance => ({
        ...instance, label: getLabel(instance.actual), distribution: epochs.map(epoch => {
          // 0 if correct
          // 1 if other
          // 2 if incorrect (wrong and within selected classes)
          const prediction = epoch.classifications[instance.index].predicted;
          if (instance.actual === prediction) return 0;
          if (classes.includes(prediction)) return 2;
          return 1;
        })
      }));

    return <div>
      <Taggle data={data} style={{height: '100vh'}}
              selection={this.state.selection}
              onSelectionChanged={indices => {
                this.setState({selection: indices});
                const instances = indices.map(index => data[index]);
                deactivateAllInstances();
                activateInstances({}, ...instances);
              }}>
        <LineUpStringColumnDesc column="id" label="ID" width={100}/>
        <LineUpStringColumnDesc column="image" renderer="image" pattern="${escapedValue}" width={50}/>
        <LineUpCategoricalColumnDesc column="label" categories={labels}/>
        <LineUpNumberColumnDesc column="distribution" label="Distribution" asArray={epochs.length} domain={[0, 2]}
                                width={300}/>
        <LineUpNumberColumnDesc column="classesVisitedNum" domain={[0, 1]} label="Variability"/>
        <LineUpNumberColumnDesc column="frequency" domain={[0, 1]} label="Frequency"/>
        <LineUpNumberColumnDesc column="score" domain={[0, 1]} label="Score"/>
      </Taggle>
    </div>;
  }
}

export default withData(InstanceListLineUp);