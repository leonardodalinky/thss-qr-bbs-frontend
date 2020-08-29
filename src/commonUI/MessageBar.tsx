import React from 'react';
import { Theme, Snackbar } from '@material-ui/core';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Alert, { AlertProps } from '@material-ui/lab/Alert';

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  
});

interface IProps extends RouteComponentProps, AlertProps {
  classes?: any,
  open: boolean,
  autoHideDuration: number,
}
interface IState {

}

class MessageBar extends React.Component<IProps, IState> {
  render() {

    return (
    <Snackbar open={this.props.open} 
    autoHideDuration={this.props.autoHideDuration} 
    onClose={this.props.onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
        <Alert {...this.props}>
          {this.props.children}
        </Alert>
    </Snackbar>
    )
  }
}

export default withStyles(styles)(withRouter(MessageBar));