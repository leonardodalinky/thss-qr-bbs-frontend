import React from 'react';
import { Theme, ListItem, Container, Typography, Divider } from '@material-ui/core';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SessionErrno, SessionContext } from '../session/SessionProvider';
import { List } from '@material-ui/core';
import Common from '../common/Common';
import { Link } from 'react-router-dom';
import MessageBar from '../commonUI/MessageBar';

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  
});

interface IProps extends RouteComponentProps {
  classes?: any
}
interface IState {
  favours: number[],
  wrongBar: boolean
}

class Favor extends React.Component<IProps, IState> {
  static contextType = SessionContext;

  constructor(props: IProps) {
    super(props);
    this.state = {
      favours: [],
      wrongBar: false
    }
  }

  async update() {
    const sessionValue = this.context;
    const ret: [number, any] | any[] = await sessionValue.hello();
    const ret_num: number = ret[0];
    if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
      this.props.history.push('/login');
    } else if (ret_num !== SessionErrno.SUCCESS) {
      // 刷新帖子失败的反馈
      this.setState({wrongBar: true});
    } 
    else {
      this.setState({
        favours: Common.showFavor(),
      })
    }
  }

  componentDidMount() {
    this.context.untilInited().then(this.update.bind(this)).catch(() => {this.props.history.push('/login')});;
  }

  render() {
    // const { classes } = this.props;

    return (
      <Container maxWidth='md'>
        <MessageBar 
        open={this.state.wrongBar} 
        autoHideDuration={5000} 
        variant="filled"
        severity='error'
        onClose={() => {this.setState({wrongBar: false})}}>未知错误</MessageBar>
        <Typography align='center' variant='h3' component='h2'>收藏夹</Typography>
        <Divider />
        <List>
          {
            this.state.favours.reverse().map((value: number, index: number, array: number[]) => {
              return (
                <ListItem key={'Favour' + index} button divider>
                  <Link to={'/bbs/' + value}>帖子: {value}</Link>
                </ListItem>
              )
            })
          }
        </List>
      </Container>

    );
  }
}

export default withStyles(styles)(withRouter(Favor));