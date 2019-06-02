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
      const {labels, activateInstances, setVisibleInstances, setClasses, setColors} = this.props.data;

      const labelColumn = this.taggle.adapter.data.find((d) => d.desc.type === 'categorical' && d.desc.column === "label");
      if (labelColumn) {
        setColors([...Array.from(labelColumn.lookup, ([key, value]) => value.color), "lightgray"]);
        labelColumn.setFilter({
          filterMissing: true,
          filter: ["Cat", "Dog"]
        });
      }
      const scoreColumn = this.taggle.adapter.data.find((d) => d.desc.type === 'number' && d.desc.column === "score");
      if (scoreColumn) {
        scoreColumn.setFilter({
          filterMissing: false,
          max: Infinity,
          min: 0.01
        });
      }

      // This callback serves as indicator that a filter has changed (TODO: Better callback possible?)
      this.taggle.adapter.data.on("orderChanged", () => {
        if (labelColumn) {
          const filteredLabels = labelColumn.getFilter().filter;
          const filteredLabelIndices = filteredLabels.map(label => labels.indexOf(label)).filter(index => index >= 0).sort();
          setClasses(filteredLabelIndices);
        }

        // Update visibility of instances
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
    const {labels, deactivateAllInstances, activateInstances} = this.props.data;

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
      <LineUpCategoricalColumnDesc column="label" categories={labels}/>
      <LineUpNumberColumnDesc column="distribution" label="Trinary Distribution" asArray={epochs.length}
                              domain={[0, 2]}
                              width={250}/>
      <LineUpCategoricalColumnDesc column="distribution2" label="Prediction Distribution" renderer="distribution"
                                   asArray={epochs.length} categories={labels}
                                   width={250} color="red"/>
      <LineUpNumberColumnDesc column="classesVisitedNum" domain={[0, 1]} label="Variability"/>
      <LineUpNumberColumnDesc column="frequency" domain={[0, 1]} label="Frequency"/>
      <LineUpNumberColumnDesc column="score" domain={[0, 1]} label="Score"/>
    </Taggle>;
  }
}

export default withData(InstanceListLineUp);