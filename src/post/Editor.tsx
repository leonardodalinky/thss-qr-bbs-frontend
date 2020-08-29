import React, { ChangeEvent } from 'react'
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { Theme, Grid, Container, TextField, Paper, Typography, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import LiteEditor from "react-markdown-editor-lite";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SessionErrno, SessionContext } from '../session/SessionProvider';
import ReactMarkdown from 'react-markdown';
import "react-markdown-editor-lite/lib/index.css";
import Sticker from '../editor-plugins/sticker';
import LongPicture from '../md-plugins/LongPicture';
import Common from '../common/Common';
import MessageBar from '../commonUI/MessageBar';
import { isUndefined } from 'util';
// import {htmlParser} from 'react-markdown'

// const htmlParser = require('react-markdown/plugins/html-parser');
// const parseHtml = htmlParser({
//   isValidNode: function isValidNode(node: any) {
//     return node.type !== 'script' && node.type !== 'style' &&
//       node.type !== 'img';
//   }
// })

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
    paper_root: {
      padding: theme.spacing(2),
    },
    editor: {
      // color: '#000000',
      minHeight: '200px'
    },
    margin: {
      margin: theme.spacing(2),
    },
    title_bar: {
      minWidth: '200px'
    }
});
  
interface IProps extends RouteComponentProps {
  classes?: any,
  type: 'post' | 'reply',
  action: 'create' | 'add' | 'modify',
  defaultTitle?: string,
  defaultContent?: string,
  pid: number,
  uid: number,
  rid?: number,
  nickname: string,
  onCloseButton: any
}
interface IState {
  editorValue: string,
  title: string,
  isEmptyTitle: boolean,
  wrongBar: boolean
}

LiteEditor.use(Sticker);

class Editor extends React.Component<IProps, IState> {
  static contextType = SessionContext;

  constructor(props: IProps) {
    super(props);
    this.state = {
      editorValue: isUndefined(props.defaultContent)? '' : props.defaultContent,
      title: isUndefined(props.defaultTitle)? '' : props.defaultTitle,
      isEmptyTitle: false,
      wrongBar: false
    }
  }

  editorOnChange(data: {
      text: string;
      html: string;
    }, 
    event?: React.ChangeEvent<HTMLTextAreaElement> | undefined)
  : void | undefined {
    this.setState({editorValue: data.text});
  }

  async submit() {
    const sessionValue = this.context;
    // console.log(this.state.editorValue.toString('markdown'));
    // return;
    if (this.props.action === 'create') {
      // 发新的主贴
      if (this.state.title === '') {
        // 空标题惩罚
        this.setState({isEmptyTitle: true});
        return;
      }
      const q: [number, any] | any[] = await sessionValue.create_post(
        {
          title: this.state.title,
          content: this.state.editorValue
        }
      );
      const ret_num: number = q[0];
      if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
        this.props.history.push('/login');
      } else if (ret_num !== SessionErrno.SUCCESS) {
        // 刷新帖子失败的反馈
        this.setState({wrongBar: true});
      } 
      else {
        window.location.reload();
      }
    } else if (this.props.action === 'add') {
      // 回复
      let q: [number, any] | any[] = [];
      if (this.props.type === 'post') {
        q = await sessionValue.reply_post(this.props.pid, this.state.editorValue);
      } else {
        q = await sessionValue.reply_post(this.props.pid, this.state.editorValue, this.props.rid);
      }
      const ret_num: number = q[0];
      if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
        this.props.history.push('/login');
      } else if (ret_num !== SessionErrno.SUCCESS) {
        // 刷新帖子失败的反馈
        this.setState({wrongBar: true});
      } 
      else {
        window.location.reload();
      }
    } else {
      // 修改
      if (this.props.type === 'post') {
        // 主贴修改
        if (this.state.title === '') {
          // 空标题惩罚
          this.setState({isEmptyTitle: true});
          return;
        }
        const q: [number, any] | any[] = await sessionValue.modify_post(
          this.props.pid,
          {
            title: this.state.title,
            content: this.state.editorValue
          }
        );
        const ret_num: number = q[0];
        if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
          this.props.history.push('/login');
        } else if (ret_num !== SessionErrno.SUCCESS) {
          // 刷新帖子失败的反馈
          this.setState({wrongBar: true});
        } 
        else {
          window.location.reload();
        }
      } else {
        // 回复修改
        const q: [number, any] | any[] = await sessionValue.modify_reply_post(
          this.props.pid,
          this.state.editorValue,
          this.props.rid
        );
        const ret_num: number = q[0];
        if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
          this.props.history.push('/login');
        } else if (ret_num !== SessionErrno.SUCCESS) {
          // 刷新帖子失败的反馈
          this.setState({wrongBar: true});
        } 
        else {
          window.location.reload();
        }
      }
    }
  }

  postType(type: 'post' | 'reply', action: 'create' | 'add' | 'modify') {
    let ret = '';
    switch(action) {
      case 'create':
        ret += '创建';
        break;
      case 'add':
        ret += '发表';
        break;
      case 'modify':
        ret += '修改';
        break;
      default:
        break;
    }
    switch(type) {
      case 'post':
        ret += '帖子';
        break;
      case 'reply':
        ret += '回复';
        break;
      default:
        break;
    }
    return ret;
  }

  editor() {
    return (
      <div>
        <LiteEditor
        value={this.state.editorValue}
        style={{
          height: "70vh"
        }}
        onChange={this.editorOnChange.bind(this)}
        renderHTML={text => 
          <ReactMarkdown 
          source={Common.stickerWrapper(text)} 
          renderers={{'image': LongPicture}}
          // escapeHtml={false}
          // astPlugins={[parseHtml]}
          />
        }
        />
      </div>
    )
  }


  render() {
    const { classes } = this.props;
    
    return (
      <React.Fragment>
        {/* 错误提示 */}
        <MessageBar 
        open={this.state.wrongBar} 
        autoHideDuration={5000} 
        variant="filled"
        severity='error'
        onClose={() => {this.setState({wrongBar: false})}}>未知错误</MessageBar>
        <Container maxWidth='lg'>
          <Paper elevation={3} className={classes.paper_root}>
            <Grid container spacing={2} alignItems="center" justify="center">
              <Grid item xs={12}>
                <TextField
                label="类型"
                defaultValue={this.postType(this.props.type, this.props.action)}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                label="被回复者"
                defaultValue={this.props.nickname}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                />
                <TextField
                label="贴子ID"
                defaultValue={this.props.pid}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                />
                {(() => {
                  if (this.props.rid !== undefined) {
                    return (
                      <TextField
                      label="回复ID"
                      defaultValue={this.props.rid}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      />
                    )
                  }
                })()}
              </Grid>
              {/* 非必须的标题输入栏 */}
              {(() => {
                if (this.props.action === 'create' || 
                  (this.props.action === 'modify' && this.props.type === 'post')) {
                    return (
                      <Grid item xs={12}>
                        <TextField
                        required
                        id="outlined-title"
                        label="标题"
                        defaultValue={this.props.defaultTitle}
                        variant="outlined"
                        onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                          this.setState({title: event.target.value});
                        }}
                        className={classes.title_bar}
                        />
                      </Grid>
                    );
                  }
              })()}
              <Grid item md={12} xs={12}>
                {this.editor()}
              </Grid>
              <Grid item>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                  <Button variant='contained' color='primary'
                  onClick={this.submit.bind(this)}
                  >
                    提交
                  </Button>
                  <Button variant='contained' color='primary'
                  onClick={() => { this.props.onCloseButton() }}
                  >
                    关闭
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        {/* 空标题警告 */}
        <Dialog onClose={() => {this.setState({isEmptyTitle: false})}} open={this.state.isEmptyTitle} fullWidth={true} maxWidth={'xs'}>
          <DialogTitle>
            警告-空标题
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              标题不得为空！
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => {this.setState({isEmptyTitle: false})}} color="primary">
              离开
            </Button>
          </DialogActions>
      </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(Editor));
