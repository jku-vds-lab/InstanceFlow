import React from "react";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FileOpenMenuItem from "./FileOpenMenuItem";
import ExportInstancesMenuItem from "./ExportInstancesMenuItem";
import ImportInstancesMenuItem from "./ImportInstancesMenuItem";

class FileMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  render() {
    const {anchorEl} = this.state;

    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'file-menu' : undefined}
          aria-haspopup="true"
          color="inherit"
          onClick={this.handleClick}
        >
          File
        </Button>
        <Menu
          id="file-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          getContentAnchorEl={null}
        >
          <FileOpenMenuItem onDataLoaded={this.handleClose}/>
          <MenuItem disabled={true} onClick={this.handleClose}>Save Configuration</MenuItem>
          <ExportInstancesMenuItem onClick={this.handleClose}/>
          <ImportInstancesMenuItem onDataLoaded={this.handleClose}/>
        </Menu>
      </div>
    );
  }
}

export default FileMenu;
