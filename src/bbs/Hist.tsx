import React from 'react';
import { Theme, Container, Typography, Button } from '@material-ui/core';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SessionErrno, SessionContext } from '../session/SessionProvider';
import Common from '../common/Common';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import MessageBar from '../commonUI/MessageBar';

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  
});

interface IProps extends RouteComponentProps {
  classes?: any
}
interface IState {
  hists: number[],
  wrongBar: boolean
}

class Hist extends React.Component<IProps, IState> {
  static contextType = SessionContext;

  constructor(props: IProps) {
    super(props);
    this.state = {
      hists: [],
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
        hists: Common.showRecord(),
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
        <Typography align='center' variant='h3' component='h2'>浏览记录</Typography>
        <div style={{  display: 'flex', flexGrow: 1, width: 'auto', padding:'auto', margin: 'auto'}}>
          <Button variant='outlined' color='primary'
          onClick={() => {localStorage.removeItem('rc'); window.location.reload();}}
          style={{margin: 'auto'}}
          >
            清空记录
          </Button>
        </div>
        <Divider />
        {/* <List>
          {
            this.state.hists.reverse().map((value: number, index: number, array: number[]) => {
              return (
                <ListItem key={'Hist' + index} button divider>
                  <Link to={'/bbs/' + value}>帖子: {value}</Link>
                </ListItem>
              )
            })
          }
        </List> */}
        <Timeline align="alternate">
          {
            this.state.hists.reverse().map((value: number, index: number, array: number[]) => {
              return (
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color={index % 2 === 0? 'primary' : 'secondary'} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Link to={'/bbs/' + value}>帖子: {value}</Link>
                  </TimelineContent>
                </TimelineItem>
              )
            })
          }
        </Timeline>
      </Container>

    );
  }
}

export default withStyles(styles)(withRouter(Hist));