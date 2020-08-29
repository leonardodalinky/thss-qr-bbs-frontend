import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import ReplyCard, { Reply } from './ReplyCard';
import { SessionErrno, SessionContext } from '../session/SessionProvider';
import PostCard, { Post } from './PostCard';
import { Divider, Theme, withStyles, Container, Fab, Button, Box } from '@material-ui/core';
import { Styles } from '@material-ui/core/styles/withStyles';
import ReplyIcon from '@material-ui/icons/Reply';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import Common from '../common/Common';
import Editor from './Editor';
import Pagination from '@material-ui/lab/Pagination';
import MessageBar from '../commonUI/MessageBar';

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  divider: {
    margin: theme.spacing(2),
  },
  fab: {
    position: 'fixed',
    bottom: '10vh',
    left: '5vw'
  },
  input_root: {
    width: '150px',
  },
  box_compo: {
    margin: '5px',
    minWidth: '100px'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

interface IProps extends RouteComponentProps {
  classes?: any,
  postId: number,
}
interface IState {
  mainPost: Post,         // 主贴信息
  replys: Reply[],        // 回复
  onlyFirst: boolean,     // 只看楼主
  replyToShow: Reply[],
  page: number,
  isReplying: boolean,
  isModifying: boolean,
  wrongBar: boolean
}

class DetailPost extends React.Component<IProps, IState> {
  static contextType = SessionContext;
  static REPLY_PER_PAGE = 10;

  constructor(props: IProps) {
    super(props);

    const defaultMainPost: Post = new Post({
      id: props.postId,           // 帖子id
      userId: 0,
      nickname:'',
      title: '',       // 帖子标题
      content: '',     // 帖子内容
      lastRepliedUserId: 0,    // 最后一个回复帖子的userId
      lastRepliedNickname:'', // 最后一个回复帖子的用户绰号
      lastRepliedTime: '',     // 最后一个回复帖子的时间
      created: '',     // 主贴创建时间
      updated: '',     // 主贴更新时间
    });

    this.state = {
      mainPost: defaultMainPost,
      replys: [],
      onlyFirst: false,
      replyToShow: [],
      page: 1,
      isReplying: false,
      isModifying: false,
      wrongBar: false
    };
  }

  async update() {
    const sessionValue = this.context;
    const post_detail: [number, any] | any[] = await sessionValue.get_post_detail(this.props.postId);
    const ret_num: number = post_detail[0];
    const ret_obj: any = post_detail[1];
    if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
      this.props.history.push('/login');
    } else if (ret_num !== SessionErrno.SUCCESS) {
      // 刷新帖子失败的反馈
      this.setState({wrongBar: true});
    } 
    else {
      const new_replys: Reply[] = [];
      for (let i = 0;i < ret_obj['reply'].length; ++i) {
        new_replys.push(new Reply(ret_obj['reply'][i]));
      }
      const new_mainPost = new Post({
        id:       ret_obj['id'],           // 帖子id
        userId:   ret_obj['userId'],
        nickname: ret_obj['nickname'],
        title:    ret_obj['title'],       // 帖子标题
        content:  ret_obj['content'],     // 帖子内容
        lastRepliedTime: ret_obj['lastRepliedTime'],     // 最后一个回复帖子的时间
        lastRepliedUserId: 'Null',
        lastRepliedNickname: 'Null',
        created:  ret_obj['created'],     // 主贴创建时间
        updated:  ret_obj['updated'],     // 主贴更新时间
      })
      this.setState({
        mainPost: new_mainPost,
        replys: new_replys,
      }, this.showRootReplyCards.bind(this));
    }

    return;
  }

  showRootReplyCards() {
    const replys_f: Reply[] = [];
    const replys = this.state.replys;
    for (let i = 0;i < replys.length;++i) {
      if (!this.state.onlyFirst) {
        if (replys[i].replyId === 0) {
          replys_f.push(replys[i]);
        }
      } else {
        // 只看楼主
        if (replys[i].replyId === 0 && replys[i].userId === this.state.mainPost.userId) {
          replys_f.push(replys[i]);
        }
      }
    }
    console.log(replys_f.length);
    // 更新展现的reply
    this.setState({replyToShow: replys_f});
  }

  /**
   * 传给PostCard的额外按钮
   * @date 2020-08-27
   * @returns {any}
   */
  extraActionButton() {
    return (
      <React.Fragment>
        <Button 
        size="small" 
        color="primary" 
        startIcon={<ReplyIcon />}
        onClick={() => {
          // 此处调出回复窗口
          this.setState({ isReplying: true, isModifying: false });
        }}
        >
          回复
        </Button>
        {(() => {
          if (this.state.onlyFirst) {
            return (
              <Button 
              size="small" 
              color="primary" 
              startIcon={<VisibilityOffIcon />}
              onClick={() => {
                this.setState({onlyFirst: false}, this.showRootReplyCards.bind(this));
              }}
              >
                取消只看楼主
              </Button>
            )
          } else {
            return (
              <Button 
              size="small" 
              color="primary" 
              startIcon={<VisibilityIcon />}
              onClick={() => {
                this.setState({onlyFirst: true}, this.showRootReplyCards.bind(this));
              }}
              >
                只看楼主
              </Button>
            )
          }
        })()}
        {(() => {
          if (this.state.mainPost.userId === this.context.userId) {
            return (
              <Button 
              size="small" 
              color="primary" 
              startIcon={<EditIcon />}
              onClick={() => {
                this.setState({isModifying: true, isReplying: false}, this.showRootReplyCards.bind(this));
              }}
              >
                编辑帖子
              </Button>
            )
          }
        })()}
      </React.Fragment>
    )
  }

  componentDidMount() {
    this.context.untilInited().then(this.update.bind(this)).catch(() => {this.props.history.push('/login')});
    Common.record(this.props.postId);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <MessageBar 
        open={this.state.wrongBar} 
        autoHideDuration={5000} 
        variant="filled"
        severity='error'
        onClose={() => {this.setState({wrongBar: false})}}>未知错误</MessageBar>
        <Container maxWidth='lg'>
          <PostCard post={this.state.mainPost}>
            {this.extraActionButton()}
          </PostCard>
          {/* 主贴回复区 */}
          {(() => {
            if (this.state.isReplying) {
              return (
                <Container maxWidth='lg'>
                  <Editor 
                  type='post'
                  action='add'
                  nickname={this.state.mainPost.nickname}
                  pid={this.state.mainPost.id}
                  uid={this.state.mainPost.userId}
                  onCloseButton={() => { this.setState({isReplying: false, isModifying: false}); }}
                  />
                </Container>
              )
            } else if (this.state.isModifying) {
              return (
                <Container maxWidth='lg'>
                  <Editor 
                  type='post'
                  action='modify'
                  nickname={this.state.mainPost.nickname}
                  pid={this.state.mainPost.id}
                  uid={this.state.mainPost.userId}
                  defaultTitle={this.state.mainPost.title}
                  defaultContent={this.state.mainPost.content}
                  onCloseButton={() => { this.setState({isReplying: false, isModifying: false}); }}
                  />
                </Container>
              )
            }
          })()}
          <Divider className={classes.divider}/>
          {/* 渲染应该展现的回复 */}
          {
            (() => {
              const start = (this.state.page - 1) * DetailPost.REPLY_PER_PAGE;
              const end = Math.min(this.state.page * DetailPost.REPLY_PER_PAGE, this.state.replyToShow.length);
              return this.state.replyToShow.slice(start, end)
                .map((value: Reply, index: number, array: Reply[]) => {
                  return <ReplyCard level={0} replys={this.state.replys} rid={value.id} key={value.id}/>;
              })
            })()
          }
        </Container>
        <Container maxWidth='md'>
          <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap='wrap'
          m={2}
          >
            <Pagination 
            count={Math.ceil(this.state.replyToShow.length / DetailPost.REPLY_PER_PAGE)} 
            showFirstButton 
            showLastButton 
            onChange={(event: React.ChangeEvent<unknown>, page: number) => {
              this.setState({page})
            }} 
            page={this.state.page}
            variant="text" 
            color="primary"
            />
          </Box>
        </Container>
        <Fab color="primary" aria-label="back" className={classes.fab} 
        onClick={() => { 
            this.props.history.push('/bbs', {page: localStorage.getItem('page_local'), size: localStorage.getItem('size_local')}); 
          }}
        >
          <ArrowBackIcon />
        </Fab>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(DetailPost));