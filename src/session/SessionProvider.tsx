import React from "react"
import Cookies from "js-cookie";
import { login, logout, user, get_post, create_post, modify_post, get_post_detail, reply_post, modify_reply_post, hello_without, hello } from "../api/web";
import { isNull, isUndefined } from "util";
import { AxiosResponse } from "axios";

// custom error number
export class SessionErrno {
  static SUCCESS = 0;
  static ERR_NOT_LOGIN = -1;
  static ERR_NETWORK = -2;
  static ERR_UNKNOWN = -1024;
}

// 传给下部组件的API接口
export interface ISessionContext extends IState {
  untilInited(): Promise<void>,
  hello_without(): Promise<any[] | [number, string | any]>,
  hello(): Promise<any[] | [number, string | any]>,
  login(username: string, pwd: string, isWriteToLocal: boolean): Promise<any[] | [number, string | any]>,
  isLogin_local(): boolean,
  logout(): [number, string | any],
  user(): Promise<any[] | [number, string | any]>,
  get_post(queryParam?:{
    page?: number,
    size?: number,
    userId?: number,
    orderByReply?: boolean
  }) : Promise<any[] | [number, string | any]>,
  create_post(data: {
    title: string,
    content: string
  }): Promise<any[] | [number, string | any]>,
  modify_post(postId: number, data: {
    title: string,
    content: string
  }): Promise<any[] | [number, string | any]>,
  get_post_detail(postId: number): Promise<any[] | [number, string | any]>,
  reply_post(postId: number, content: string, replyId?: number): Promise<any[] | [number, string | any]>,
  modify_reply_post(postId: number, content: string, replyId: number): Promise<any[] | [number, string | any]>,

}

// 初始化
const SessionContext = React.createContext<ISessionContext>({
  username: '',
  password: '',
  nickname: '',
  userId: 0,
  jwt: '',
  isLogin: false,
  isInit: false,
  untilInited: () => {return new Promise<void>(() => {});},
  hello_without: () => {return new Promise<any[] | [number, string | any]>(()=>{});},
  hello: () => {return new Promise<any[] | [number, string | any]>(()=>{});},
  login: (username: string, pwd: string, isWriteToLocal: boolean) => {return new Promise<any[] | [number, string | any]>(()=>{});},
  isLogin_local: () => {return false},
  logout: () => {return [0, 0];},
  user: () => {return new Promise<any[] | [number, string | any]>(()=>{});},
  get_post: () => {return new Promise<any[] | [number, string | any]>(()=>{});},
  create_post: (data: {
    title: string,
    content: string
  }) => {return new Promise<any[] | [number, string | any]>(()=>{});},
  modify_post: (postId: number, data: {
    title: string,
    content: string
  }) => {return new Promise<any[] | [number, string | any]>(()=>{});},
  get_post_detail: (postId: number) => {return new Promise<any[] | [number, string | any]>(()=>{});},
  reply_post: (postId: number, content: string, replyId?: number) => {return new Promise<any[] | [number, string | any]>(()=>{});},
  modify_reply_post: (postId: number, content: string, replyId: number) => {return new Promise<any[] | [number, string | any]>(()=>{});}
});
const { Provider, Consumer } = SessionContext;

interface IProps {
}
interface IState {
  username: string,
  password: string,
  nickname: string,
  userId: number,
  jwt: string,
  isLogin: boolean,
  isInit: boolean
}

class SessionProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      nickname: '',
      userId: 0,
      jwt: '',
      isLogin: false,
      isInit: false,
    }
    this.untilInited = this.untilInited.bind(this);
    this.hello_without = this.hello_without.bind(this);
    this.hello = this.hello.bind(this);
    this.login = this.login.bind(this);
    this.isLogin_local = this.isLogin_local.bind(this);
    this.logout = this.logout.bind(this);
    this.user = this.user.bind(this);
    this.get_post = this.get_post.bind(this);
    this.create_post = this.create_post.bind(this);
    this.modify_post = this.modify_post.bind(this);
    this.get_post_detail = this.get_post_detail.bind(this);
    this.reply_post = this.reply_post.bind(this);
    this.modify_reply_post = this.modify_reply_post.bind(this);
  }

  // Session api: Start
  /**
   * 进行一次⽆身份验证。
   * 
   * 结果对象为：
   * 
   * { message: 'Hello world' }
   * 
   * @date 2020-08-22
   * @returns {any} Promise
   */
  async hello_without(): Promise<any[] | [number, string | any]> {
    // let ret = await hello_without();
    // if (ret.status !== 200) {
    //   return [SessionErrno.ERR_NETWORK, 'Hello without jwt failed.'];
    // } else {
    //   return [SessionErrno.SUCCESS, ret.data];
    // }
    return hello_without().then((res) => {
      return [SessionErrno.SUCCESS, res.data];
    }).catch((err) => {
      return [SessionErrno.ERR_NETWORK, 'Hello without jwt failed.'];
    });
  }
  /**
   * 进行一次有身份验证。
   * 
   * 结果对象为：
   * 
   * { message: 'Hello world, USERNAME'}
   * 
   * USERNAME是登录者的学号
   * 
   * @date 2020-08-22
   * @param {string} jwt js web token
   * @returns {any} Promise
   */
  async hello(): Promise<any[] | [number, string | any]> {
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return hello(this.state.jwt).then((res) => {
      return [SessionErrno.SUCCESS, res.data];
    }).catch((err) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Hello with jwt failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Hello with jwt failed.'];
      }
    });
  }
  /**
   * 进行登录。若成功，则更新全局缓存同步。
   * @date 2020-08-22
   * @param {any} username:string
   * @param {any} pwd:string
   * @returns {any}
   */
  async login(username: string, pwd: string, isWriteToLocal: boolean): Promise<any[] | [number, string | any]> {
    return login(username, pwd).then((res) => {
      const p = res.data;
      const nowState = {
        username: p['username'],
        nickname: p['nickname'],
        userId: p['userId'],
        jwt: p['jwt'],
        isLogin: true
      };
      this.setState(nowState)
      if (isWriteToLocal) {
        SessionProvider._setJwtToCookie(p['jwt'], 1);
      } else {
        SessionProvider._setJwtToCookie(p['jwt'], -1);
      }
      this._saveLoginLocal(nowState);
      
      return [SessionErrno.SUCCESS, 'Login succeed.'];
    }).catch((err) => {
      // return [SessionErrno.ERR_NOT_LOGIN, 'Error Occurs!'];
      return [SessionErrno.ERR_NOT_LOGIN, err];
    });
  }
  // login_session(): [number, string | any] {
  //   const jwt_cookie = Cookies.get('jwt');
  //   const jwt_store = localStorage.getItem('jwt');
  //   if (isUndefined(jwt_cookie) || isNull(jwt_store) || jwt_store !== jwt_cookie) {
  //     return [SessionErrno.ERR_NOT_LOGIN, 'Login from session failed.'];
  //   } else {
  //     return this._restoreLoginSession();
  //   }
  // }
  /**
   * 用本地长久数据登录。若成功，更新全局缓存数据。
   * @date 2020-08-22
   * @returns {any}
   */
  login_local(): [number, string | any] {
    const jwt_cookie = Cookies.get('jwt');
    const jwt_store = localStorage.getItem('jwt');
    if (isUndefined(jwt_cookie) || isNull(jwt_store) || jwt_store !== jwt_cookie) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Login locally failed.'];
    } else {
      return this._restoreLoginLocal();
    }
  }

  isLogin_local(): boolean {
    const jwt_cookie = Cookies.get('jwt');
    const jwt_store = localStorage.getItem('jwt');
    if (isUndefined(jwt_cookie) || isNull(jwt_store) || jwt_store !== jwt_cookie) {
      return false
    } else {
      const username = localStorage.getItem('username');
      const userId = localStorage.getItem('userId');
      const jwt = localStorage.getItem('jwt');
      const nickname = localStorage.getItem('nickname');
      if (isNull(username) || isNull(userId) || isNull(jwt) || isNull(nickname)) {
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * 登出账号。必定成功。
   * @date 2020-08-22
   * @returns {any}
   */
  logout(): [number, string | any] {
    if (!this.state.isLogin) {
      return [SessionErrno.SUCCESS, 'Already log out.'];
    }
    logout(this.state.jwt);
    Cookies.remove('jwt');
    this._clearLoginState();
    this.setState({isLogin: false});
    return [SessionErrno.SUCCESS, 'Logout succeed.'];
  }
  /**
   * 获取当前登录账号个⼈信息。
   * 
   * 结果对象为:
   * 
  {
    "id": 1,
    "username": "201801****",
    "nickname": "清⼩软",
    "created": "2020-08-14T23:15:49+08:00"
  }
   * 
   * @date 2020-08-22
   * @returns {any}
   */
  async user(): Promise<any[] | [number, string | any]> {
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return user(this.state.jwt).then((res) => {
      const p = res.data;
      return [SessionErrno.SUCCESS, p];
    }).catch((err) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Get user failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Get user failed.'];
      }
    });
  }
  /**
   * 获取帖⼦列表(更新时间降序)
   * 
   * 结果对象为：
   * 
  {
    'page': 1,
    'size': 10,
    'total': 1,
    'posts': [
      {
        "id": 1,
        "userId": 1,
        "nickname": "清⼩软",
        "title": "hello, world", # 帖⼦标题
        "content": "welcome to simplebbs", # 帖⼦内容，为富⽂本
        "lastRepliedUserId": 15,
        "lastRepliedNickname": "隋唯一",
        "lastRepliedTime": "2020-08-22T22:02:25+08:00",
        "created": "2020-08-14T00:00:00+08:00",
        "updated": "2020-08-14T00:00:00+08:00"
      }
    ]
  }
   * 
   * @date 2020-08-22
   * @param {any} queryParam 
   * @returns {any}
   */
  async get_post(queryParam?:{
    page?: number,
    size?: number,
    userId?: number,
    orderByReply?: boolean
  }) : Promise<any[] | [number, string | any]>{
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return get_post(this.state.jwt, queryParam).then((res) => {
      const p = res.data;
      return [SessionErrno.SUCCESS, p];
    }).catch((err: AxiosResponse<any>) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Get post failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Get post failed.'];
      }
      
    });
  }
  /**
   * 发帖。
   * 
   * 结果对象为：
   * 
   * {"message": "ok", "postId": 19}
   * 
   * @date 2020-08-22
   * @param {any} data
   * @returns {any}
   */
  async create_post(data: {
    title: string,
    content: string
  }): Promise<any[] | [number, string | any]> {
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return create_post(this.state.jwt, data).then((res) => {
      const p = res.data;
      return [SessionErrno.SUCCESS, p];
    }).catch((err) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Create post failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Create post failed.'];
      }
    });
  }
  /**
   * 编辑帖子。
   * 
   * 结果对象为：
   * 
   * {"message": "ok"}
   * 
   * @date 2020-08-22
   * @param {number} postId 帖子id
   * @param {any} data 
   * @returns {any}
   */
  async modify_post(postId: number, data: {
    title: string,
    content: string
  }): Promise<any[] | [number, string | any]> {
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return modify_post(this.state.jwt, postId, data).then((res) => {
      return [SessionErrno.SUCCESS, res.data];
    }).catch((err) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Modify post failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Modify post failed.'];
      }
    });
  }
  /**
   * 获取帖⼦详情与回帖列表。
   * 
   * 结果对象为：
  {
    "id": 1,
    "userId": 1,
    "nickname": "清⼩软",
    "title": "hello, world", # 帖⼦标题
    "content": "welcome to simplebbs", # 帖⼦内容
    "created": "2020-08-14T00:00:00+08:00",
    "updated": "2020-08-14T00:00:00+08:00",
    "lastRepliedTime": "2020-08-22T02:59:52+08:00",
    "reply": [ # 回帖列表，创建时间升序
      {
        "id": 1,
        "userId": 1,
        "nickname": "清⼩软",
        "postId": 1,
        "replyId": 0, # 回复主帖
        "content": "Hello, EveryOne!",
        "created": "2020-08-15T11:31:41+08:00",
        "updated": "2020-08-15T11:31:41+08:00"
      }
    ]
  }
   * 
   * @date 2020-08-22
   * @param {any} postId:number 帖子id
   * @returns {any}
   */
  async get_post_detail(postId: number): Promise<any[] | [number, string | any]> {
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return get_post_detail(this.state.jwt, postId).then((res) => {
      const p = res.data;
      return [SessionErrno.SUCCESS, p];
    }).catch((err) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Get post detail failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Get post detail failed.'];
      }
    });
  }
  /**
   * 回帖。
   * 
   * 结果对象为：
   *
   * { message: 'ok'}
   * 
   * @date 2020-08-22
   * @param {any} postId:number 回复的帖子的id
   * @param {any} content:string 回复的内容
   * @param {any} replyId?:number 可选。若存在，则对帖子下的某个回复进行回复；否则，对主帖子进行回复。
   * @returns {any}
   */
  async reply_post(postId: number, content: string, replyId?: number): Promise<any[] | [number, string | any]> {
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return reply_post(this.state.jwt, postId, content, replyId).then((res) => {
      return [SessionErrno.SUCCESS, res.data];
    }).catch((err) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Reply post failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Reply post failed.'];
      }
    });
  }
  /**
   * 修改帖子下的回复。
   * 
   * 结果对象为：
   *
   * { message: 'ok'}
   * 
   * @date 2020-08-22
   * @param {any} postId:number 回复的帖子的id
   * @param {any} content:string 新的回复的内容
   * @param {any} replyId:number 帖子中回复的id
   * @returns {any}
   */
  async modify_reply_post(postId: number, content: string, replyId: number): Promise<any[] | [number, string | any]> {
    if (!this.state.isLogin) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Not login yet.'];
    }
    return modify_reply_post(this.state.jwt, postId, content, replyId).then((res) => {
      const p = res.data;
      return [SessionErrno.SUCCESS, p];
    }).catch((err) => {
      if (err.status === 401) {
        return [SessionErrno.ERR_NOT_LOGIN, 'Modify post reply failed.'];
      } else {
        return [SessionErrno.ERR_UNKNOWN, 'Modify post reply failed.'];
      }
    });
  }
  static _getJwtFromCookie(): string | undefined {
    return Cookies.get('jwt');
  }
  static _setJwtToCookie(jwt: string, days: number): string | undefined {
    return Cookies.set('jwt', jwt, { expires: days });
  }
  _saveLoginLocal(nowState: any): void {
    localStorage.setItem('username', nowState.username);
    localStorage.setItem('userId', nowState.userId.toString());
    localStorage.setItem('nickname', nowState.nickname);
    localStorage.setItem('jwt', nowState.jwt);
  }
  _restoreLoginLocal(): [number, string] {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const jwt = localStorage.getItem('jwt');
    const nickname = localStorage.getItem('nickname');
    if (isNull(username) || isNull(userId) || isNull(jwt) || isNull(nickname)) {
      return [SessionErrno.ERR_NOT_LOGIN, 'Login locally failed.'];
    } else {
      const nowState = {
        username: username,
        userId: parseInt(userId),
        nickname: nickname,
        jwt: jwt,
        isLogin: true
      }
      this.setState(nowState);
      return [SessionErrno.SUCCESS, 'Login locally succeed.'];
    }
  }

  // Session api: End

  _clearLoginState(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('jwt');
    localStorage.removeItem('nickname');
  }

  async untilInited(): Promise<void> {
    while (!this.state.isInit) { await new Promise((resolve) => setTimeout(resolve, 50));}
    return;
  }

  componentDidMount() {
    this.login_local();
    this.setState({
      isInit: true
    })
  }

  render() {
    return (
      <Provider value={{
        ...this.state,
        untilInited: this.untilInited,
        hello_without: this.hello_without,
        hello: this.hello,
        login: this.login,
        isLogin_local: this.isLogin_local,
        logout: this.logout,
        user: this.user,
        get_post: this.get_post,
        create_post: this.create_post,
        modify_post: this.modify_post,
        get_post_detail: this.get_post_detail,
        reply_post: this.reply_post,
        modify_reply_post: this.modify_reply_post
      }}>{this.props.children}</Provider>
    )
  }
}

export { SessionProvider, Consumer as SessionConsumer, SessionContext}