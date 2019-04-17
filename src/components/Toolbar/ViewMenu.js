import React from "react";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Link as RouterLink, withRouter} from 'react-router-dom'

class ViewMenu extends React.Component {
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
    const { location: { pathname } } = this.props;
    const {anchorEl} = this.state;

    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'file-menu' : undefined}
          aria-haspopup="true"
          color="inherit"
          onClick={this.handleClick}
        >
          View
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
          <MenuItem selected={pathname === "/"} component={RouterLink} to="/">InstanceFlow</MenuItem>
          <MenuItem selected={pathname === "/changers"} component={RouterLink} to="/changers">ClassFlow</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withRouter(ViewMenu);
