import React, {Component} from "react";
import {withData} from "../DataProvider";
import InstanceListLineUp from "./InstanceListLineUp";

class InstanceListLineUpWrapper extends Component {
  data = [];

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.data.raw_data.name !== nextProps.data.raw_data.name ||
      ((this.props.instances.length > 0 && nextProps.instances.length > 0)
      && (JSON.stringify(this.props.instances[0]) !== JSON.stringify(nextProps.instances[0]))) ||
      this.props.epochs.length !== nextProps.epochs.length ||
      this.props.data.clickedInstances !== nextProps.data.clickedInstances;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.taggle) {
      const {clickedInstances} = this.props.data;

      if (clickedInstances !== prevProps.data.clickedInstances) {
        this.taggle.adapter.data.setSelection(
          this.data
            .filter(instance => clickedInstances.has(instance.id))
            .map(instance => instance.taggleIndex));
      } else {
        this.updateData();
      }
    }
  }

  componentDidMount() {
    this.updateData();
  }

  updateData() {
    const {instances, epochs, allEpochs} = this.props;
    const {classes, getLabel, from, to} = this.props.data;
    this.data = instances
    //.filter(instance => instance.displayInList)
      .map((instance, i) => ({
        ...instance,
        taggleIndex: i,
        label: getLabel(instance.actual),
        distribution: allEpochs.map(epoch => {
          // 0 if correct
          // 1 if other
          // 2 if incorrect (wrong and within selected classes)
          const prediction = epoch.classifications[instance.index].predicted;
          if (instance.actual === prediction) return "Correct";
          if (classes.includes(prediction)) return "Incorrect";
          return "Other";
        }),
        distribution2: allEpochs.map(epoch => {
          return getLabel(epoch.classifications[instance.index].predicted);
        }),
        visitedLabels: Array.from(instance.classesVisited).map(i => getLabel(i)),
        variability: instance.classesVisited.size,
      }));
    this.taggleWrapper.updateData(this.data, from, to);
  }

  render() {
    const {instances, epochs, allEpochs} = this.props;
    const {raw_data} = this.props.data;

    return <div style={{fontSize: "10pt"}}>
      <InstanceListLineUp key={raw_data.name}
                          instances={instances}
                          epochs={epochs}
                          allEpochs={allEpochs}
                          ref={(e) => this.taggleWrapper = e}
                          innerRef={(e) => this.taggle = e}/>
    </div>;
  }
}

export default withData(InstanceListLineUpWrapper);