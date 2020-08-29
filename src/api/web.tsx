import axios, { AxiosResponse } from 'axios';

const urlbase = 'http://simplebbs.iterator-traits.com';
const timeOut = 3000;

/**
 * 进行一次⽆身份验证。
 * 
 * 结果对象为：
 * 
 * { message: 'Hello world' }
 * 
 * @date 2020-08-22
 * @returns {Promise<AxiosResponse<any>>} Promise
 */
export function hello_without(): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/hello',
        method: 'get',
        baseURL: urlbase,
        headers: {'Content-Type': 'application/json'},
        timeout: timeOut,
    }
    return axios.get(urlbase + config.url, config);
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
 * @returns {Promise<AxiosResponse<any>>} Promise
 */
export function hello(jwt: string): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/hello-user',
        method: 'get',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        timeout: timeOut,
    }
    return axios.get(urlbase + config.url, config);
}

/**
 * 进行登录行为。
 * 
 * 结果对象为：
 * 
    {
        'username': 'xxx',
        'nickname': 'xxx',
        'userId': 'xxx',
        'jwt': 'xxx'
    }

 * @date 2020-08-22
 * @param {string} username
 * @param {string} pwd
 * @returns {any}
 */
export function login(username: string, pwd: string): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/login',
        method: 'patch',
        baseURL: urlbase,
        headers: {'Content-Type': 'application/json'},
        timeout: timeOut,
        data: {
            username: username,
            password: pwd
        },
    }
    return axios.patch(urlbase + config.url, config.data, config);
}

/**
 * 进行登出行为。
 * 
 * 结果对象为：
 * 
 * { message: 'ok'}
 * 
 * @date 2020-08-22
 * @param {any} jwt:string
 * @returns {any}
 */
export function logout(jwt: string): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/logout',
        method: 'patch',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        timeout: timeOut,
        data: {},
    }
    return axios.patch(urlbase + config.url, config.data, config);
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
 * @param {any} jwt:string
 * @returns {any}
 */
export function user(jwt: string): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/user',
        method: 'get',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        timeout: timeOut,
    }
    return axios.get(urlbase + config.url, config);
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
 * @param {any} jwt:string
 * @param {any} queryParam 形式如下：
 * 
{
    'page': 1, 
    'size': 10, 
    'userId': 1,
    'orderByReply': true
}
 *
 * 且上述选项全部为可选。
 *
 * @returns {any}
 */
export function get_post(jwt: string, queryParam?: any): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/post',
        method: 'get',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        params: queryParam,
        timeout: timeOut,
    }
    return axios.get(urlbase + config.url, config);
}


/**
 * 发帖。
 * 
 * 结果对象为：
 * 
 * {"message": "ok", "postId": 19}
 * 
 * @date 2020-08-22
 * @param {any} jwt:string
 * @param {any} data 形式如下：
 * 
 * {"title": "标题", "content": "内容"}
 * 
 * @returns {any}
 */
export function create_post(jwt: string, data: any): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/post',
        method: 'post',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        data: data,
        timeout: timeOut,
    }
    return axios.post(urlbase + config.url, data, config);
}


/**
 * 编辑帖子。
 * 
 * 结果对象为：
 * 
 * {"message": "ok"}
 * 
 * @date 2020-08-22
 * @param {any} jwt:string
 * @param {number} postId 帖子id
 * @param {any} data 形式如下：
 * 
 * {"title": "标题", "content": "内容"}
 * 
 * @returns {any}
 */
export function modify_post(jwt: string, postId: number, data: any): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/post/' + postId,
        method: 'post',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        data: data,
        timeout: timeOut,
    }
    return axios.put(urlbase + config.url, data, config);
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
 * @param {any} jwt:string
 * @param {any} postId:number 帖子id
 * @returns {any}
 */
export function get_post_detail(jwt: string, postId: number): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/post/' + postId,
        method: 'get',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        timeout: timeOut,
    }
    return axios.get(urlbase + config.url, config);
}


/**
 * 回帖。
 * 
 * 结果对象为：
 *
 * { message: 'ok'}
 * 
 * @date 2020-08-22
 * @param {any} jwt:string
 * @param {any} postId:number 回复的帖子的id
 * @param {any} content:string 回复的内容
 * @param {any} replyId?:number 可选。若存在，则对帖子下的某个回复进行回复；否则，对主帖子进行回复。
 * @returns {any}
 */
export function reply_post(jwt: string, postId: number, content: string, replyId?: number): Promise<AxiosResponse<any>> {
    const data: any = {
        content: content
    }
    if (replyId !== undefined) {
        data.replyId = replyId;
    }
    const config: any = {
        url: '/api/v1/post/' + postId + '/reply',
        method: 'post',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        data: data,
        timeout: timeOut,
    }
    return axios.post(urlbase + config.url, config.data, config);
}

/**
 * 修改帖子下的回复。
 * 
 * 结果对象为：
 *
 * { message: 'ok'}
 * 
 * @date 2020-08-22
 * @param {any} jwt:string
 * @param {any} postId:number 回复的帖子的id
 * @param {any} content:string 新的回复的内容
 * @param {any} replyId:number 帖子中回复的id
 * @returns {any}
 */
export function modify_reply_post(jwt: string, postId: number, content: string, replyId: number): Promise<AxiosResponse<any>> {
    const config: any = {
        url: '/api/v1/post/' + postId + '/reply/' + replyId,
        method: 'put',
        baseURL: urlbase,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        data: {
            content: content
        },
        timeout: timeOut,
    }
    return axios.put(urlbase + config.url, config.data, config);
}