import React, {Component} from "react";
import {withData} from "../DataProvider";
import {
  LineUp,
  LineUpCategoricalColumnDesc,
  LineUpNumberColumnDesc,
  LineUpStringColumnDesc, Taggle
} from "lineupjsx";
import Button from "@material-ui/core/Button/Button";

class InstanceListLineUp extends Component {
  state = {
    selection: []
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.instances.length !== nextProps.instances.length ||
      this.props.epochs.length !== nextProps.epochs.length;
  }

  render() {
    const {instances, epochs} = this.props;
    const {classes, labels, activeInstances, deactivateAllInstances, activateInstances, setVisibleInstances, getLabel} = this.props.data;

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
      <Button color="default" variant="contained" onClick={() => {
        const data = this.taggle.adapter.data;
        const ranking = data.getRankings()[0];
        const visibleInstances = data.viewRawRows(ranking.getOrder()).map(row => row.v);
        console.log(visibleInstances);
        setVisibleInstances(new Set());
        activateInstances({visible: true}, ...visibleInstances);
      }}>Update Above View</Button>
      <Taggle data={data} ref={e => this.taggle = e} style={{height: '100vh'}}
        //selection={Array.from(activeInstances).map(id => data.find(instance => instance.id === id).index)}
              selection={this.state.selection}
              onSelectionChanged={indices => {
                this.setState({selection: indices});
                const instances = indices.map(index => data[index]);
                deactivateAllInstances();
                activateInstances({active: true, clicked: true, lines: true}, ...instances);
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