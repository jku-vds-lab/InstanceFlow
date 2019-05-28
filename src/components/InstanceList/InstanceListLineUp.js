import React, {Component} from "react";
import {withData} from "../DataProvider";
import {
  LineUpCategoricalColumnDesc,
  LineUpNumberColumnDesc,
  LineUpStringColumnDesc, Taggle,
} from "lineupjsx";
import CategoricalArrayHeatmapCellRenderer from "./CategoricalArrayHeatmapCellRenderer";

class InstanceListLineUp extends Component {
  state = {
    selection: []
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.instances.length !== nextProps.instances.length ||
      this.props.epochs.length !== nextProps.epochs.length;
  }

  componentDidMount() {
    if (this.taggle) {
      const {activateInstances, setVisibleInstances} = this.props.data;
      // This callback serves as indicator that a filter has changed (TODO: Better callback possible?)
      this.taggle.adapter.data.on("orderChanged", () => {
        const data = this.taggle.adapter.data;
        const ranking = data.getRankings()[0];
        const visibleInstances = data.view(ranking.getOrder());
        setVisibleInstances(new Set());
        activateInstances({visible: true}, ...visibleInstances);
      });
    }
  }

  render() {
    const {instances, epochs} = this.props;
    const {classes, labels, deactivateAllInstances, activateInstances, getLabel, getColor} = this.props.data;

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
        }), distribution2: epochs.map(epoch => {
          return getLabel(epoch.classifications[instance.index].predicted);
        })
      }));

    const labelCategories = labels.map((label, i) => {
      return {
        name: label,
        label: label,
        color: getColor(i)
      }
    });

    return <div style={{fontSize: "10pt"}}>
      <Taggle data={data}
              renderers={{distribution: new CategoricalArrayHeatmapCellRenderer()}}
              ref={e => this.taggle = e}
              style={{height: '100vh'}}
        //selection={Array.from(activeInstances).map(id => data.find(instance => instance.id === id).index)}
              selection={this.state.selection}
              onSelectionChanged={indices => {
                this.setState({selection: indices});
                const instances = indices.map(index => data[index]);
                deactivateAllInstances();
                activateInstances({active: true, clicked: true, lines: true}, ...instances);
              }}>
        <LineUpStringColumnDesc column="id" label="ID" width={100}/>
        <LineUpStringColumnDesc column="image" renderer="image" groupRenderer="image" summaryRenderer="image"
                                pattern="${escapedValue}" width={50}/>
        <LineUpCategoricalColumnDesc column="label" categories={labelCategories}/>
        <LineUpNumberColumnDesc column="distribution" label="Trinary Distribution" asArray={epochs.length}
                                domain={[0, 2]}
                                width={250}/>
        <LineUpCategoricalColumnDesc column="distribution2" label="Prediction Distribution" renderer="distribution"
                                     asArray={epochs.length} categories={labelCategories}
                                     width={250} color="red"/>
        <LineUpNumberColumnDesc column="classesVisitedNum" domain={[0, 1]} label="Variability"/>
        <LineUpNumberColumnDesc column="frequency" domain={[0, 1]} label="Frequency"/>
        <LineUpNumberColumnDesc column="score" domain={[0, 1]} label="Score"/>
      </Taggle>
    </div>;
  }
}

export default withData(InstanceListLineUp);