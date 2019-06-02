import React, {Component} from "react";
import {withData} from "../DataProvider";
import {
  LineUpCategoricalColumnDesc,
  LineUpNumberColumnDesc,
  LineUpStringColumnDesc, Taggle,
} from "lineupjsx";
import CategoricalArrayHeatmapCellRenderer from "./CategoricalArrayHeatmapCellRenderer";

class InstanceListLineUp extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  componentDidMount() {
    this.initializeTaggleEvents();
  }

  initializeTaggleEvents = () => {
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
  };

  render() {
    const {epochs, innerRef} = this.props;
    const {labels, deactivateAllInstances, activateInstances, getColor} = this.props.data;

    const labelCategories = labels.map((label, i) => {
      return {
        name: label,
        label: label,
        color: getColor(i)
      }
    });

    return <Taggle data={[]} renderers={{distribution: new CategoricalArrayHeatmapCellRenderer()}}
              ref={e => {
                this.taggle = e;
                innerRef(this.taggle);
              }}
              style={{height: '100vh'}}
              onSelectionChanged={indices => {
                const instances = indices.map(index => this.taggle.adapter.data.data[index]);
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
      </Taggle>;
  }
}

export default withData(InstanceListLineUp);