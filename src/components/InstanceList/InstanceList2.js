import React, {Component} from "react";
import "./InstanceList.css"
import {withFlowData} from "../InstanceFlow/FlowDataProvider";
import {withData} from "../DataProvider";
import MaterialTable from "material-table";
import InstanceDistributionChart from "./InstanceDistributionChart";
import Search from "@material-ui/icons/Search"
import SaveAlt from "@material-ui/icons/SaveAlt"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import ChevronRight from "@material-ui/icons/ChevronRight"
import FirstPage from "@material-ui/icons/FirstPage"
import LastPage from "@material-ui/icons/LastPage"
import Check from "@material-ui/icons/Check"
import FilterList from "@material-ui/icons/FilterList"
import Remove from "@material-ui/icons/Remove"
import Clear from "@material-ui/icons/Clear"

const cellStyle = () => ({
  padding: 4
});

class InstanceList2 extends Component {
  render() {
    const {instances, epochs} = this.props;
    const {sortMetric} = this.props.flowData;
    const {raw_data, clickedInstances, activeInstances, activateInstances, deactivateInstances, getColor, getLabel} = this.props.data;

    return <div className="instance-list">
      <MaterialTable
        icons={{
          ResetSearch: Clear,
          Check: Check,
          DetailPanel: ChevronRight,
          Export: SaveAlt,
          Filter: FilterList,
          FirstPage: FirstPage,
          LastPage: LastPage,
          NextPage: ChevronRight,
          PreviousPage: ChevronLeft,
          Search: Search,
          ThirdStateCheck: Remove,
        }}
        columns={[
          {
            title: 'ID', field: 'id', cellStyle
          },
          {
            title: 'Image', field: 'image', cellStyle,
            customSort: (i1, i2) => clickedInstances.has(i2.id) - clickedInstances.has(i1.id) || 0,
            render: instance => <img className={`box-img ${activeInstances.has(instance.id) ? "active" : ""}`}
                                     src={instance.image}
                                     data-id={instance.id}
                                     alt={`Instance ${instance.id}`}
                                     onMouseOver={e => {
                                       //if (!instance.clicked)
                                       //  activateInstances({lines: true}, instance)
                                     }}
                                     onMouseOut={e => {
                                       //if (!instance.clicked)
                                       //  deactivateInstances(false, instance);
                                     }}
                                     onClick={e => {
                                       if (!clickedInstances.has(instance.id)) {
                                         activateInstances({clicked: true, lines: true}, instance);
                                       } else {
                                         //activateInstances({clicked: false, lines: false}, instance);
                                         deactivateInstances(true, instance);
                                       }
                                     }}/>
          },
          {
            title: 'Actual', field: 'actual', cellStyle,
            lookup: raw_data.labels.reduce((map, label, i) => {
              map[i] = label;
              return map;
            }, {}),
            render: instance => <span style={{
              color: getColor(instance.actual)
            }}>{getLabel(instance.actual)}</span>
          },
          {
            title: 'Distribution', cellStyle,
            sorting: false,
            headerStyle: {width: '50%'},
            render: instance => <InstanceDistributionChart instance={instance} epochs={epochs}/>
          },
          {title: 'Variability', field: 'classesVisitedNum', cellStyle, type: 'numeric'},
          {title: 'Frequency', field: 'frequency', cellStyle, type: 'numeric'},
          {title: 'Score', field: 'score', cellStyle, type: 'numeric'},
        ]}
        data={instances
          .filter(instance => instance.displayInList)
          .concat()
          .sort((i1, i2) => clickedInstances.has(i2.id) - clickedInstances.has(i1.id) || 0)}
        onRowClick={((evt, instance) => {
          if (!clickedInstances.has(instance.id)) {
            activateInstances({clicked: true, lines: true}, instance);
          } else {
            deactivateInstances(true, instance);
          }
        })}
        options={{
          showTitle: false,
          sorting: true,
          emptyRowsWhenPaging: false,
          pageSize: 50,
          pageSizeOptions: [10, 25, 50, 100, 200, 1000],
          rowStyle: rowData => ({
            backgroundColor: (activeInstances.has(rowData.id)) ? "rgba(0, 0, 0, 0.04)" : "",
          }),
          headerStyle: ({
            padding: 4
          })
        }}
      />
    </div>;
  }
}

export default withFlowData(withData(InstanceList2));