import React from 'react';
import { Theme, ListItem, ListItemText, Container, Typography } from '@material-ui/core';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SessionErrno, SessionContext } from '../session/SessionProvider';
import { List } from '@material-ui/core';
import MessageBar from '../commonUI/MessageBar';

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  
});

interface IProps extends RouteComponentProps {
  classes?: any
}
interface IState {
  id: number,
  username: string,
  nickname: string,
  created: string,
  wrongBar: boolean
}

class Profile extends React.Component<IProps, IState> {
  static contextType = SessionContext;

  constructor(props: IProps) {
    super(props);
    this.state = {
      id: 0,
      username: '',
      nickname: '',
      created: '',
      wrongBar: false
    }
  }

  async update() {
    const sessionValue = this.context;
    const ret: [number, any] | any[] = await sessionValue.user();
    const ret_num: number = ret[0];
    const ret_obj: any = ret[1];
    if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
      this.props.history.push('/login');
    } else if (ret_num !== SessionErrno.SUCCESS) {
      // 刷新帖子失败的反馈
      this.setState({wrongBar: true});
    } 
    else {
      this.setState({
        id: ret_obj['id'],
        username: ret_obj['username'],
        nickname: ret_obj['nickname'],
        created: ret_obj['created']
      })
    }
  }

  componentDidMount() {
    this.context.untilInited().then(this.update.bind(this)).catch(() => {this.props.history.push('/login')});;
  }

  render() {
    return (
      <Container maxWidth='md'>
        <MessageBar 
        open={this.state.wrongBar} 
        autoHideDuration={5000} 
        variant="filled"
        severity='error'
        onClose={() => {this.setState({wrongBar: false})}}>未知错误</MessageBar>
        <List>
          <ListItem key={'User ID'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
                {'User ID: ' + this.state.id}
                </Typography>
            </ListItemText>
          </ListItem>
          <ListItem key={'UserName'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
              {'UserName: ' + this.state.username}
                </Typography>
            </ListItemText>
          </ListItem>
          <ListItem key={'NickName'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
              {'NickName: ' + this.state.nickname}
                </Typography>
            </ListItemText>
          </ListItem>
          <ListItem key={'Created'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
              {'Created: ' + this.state.created}
                </Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Container>

    );
  }
}

export default withStyles(styles)(withRouter(Profile));