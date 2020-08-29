import React from 'react';
import { render } from '@testing-library/react';
import { hello_without, login, logout, hello, user, get_post, create_post, modify_post, get_post_detail, reply_post, modify_reply_post } from './web';
import { AxiosResponse, AxiosError } from 'axios';
import { stringify } from 'querystring';
import SessionGlobal from '../session/global';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// 正规测试

const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjo1NCwiVXNlck5hbWUiOiIyMDE4MDEzMzY4IiwiZXhwIjoxNTk4MTE5NjcxfQ.MG-f3x0SCJvryiAPnk-SZ7qR7L1-2_7Arsxwrge0Ghc';
const userId = 54;

// test('web hello_without', () => {
//   console.log('test: hello_without');
//   return hello_without().then((res) => {
//       console.log(JSON.stringify(res.data));
//   });
// })

// test('web hello', () => {
//   console.log('test: hello');
//   return hello(jwt);
// })

// test('web login', () => {
//   console.log('test: login');
//   // return login('2018013368', '628255').then((res) => {
//   //   console.log(res.data);
//   // });
//   return login('2018013368', '628255');
// })

// test('web global login', () => {
//   console.log('test: login');
//   return SessionGlobal.getInstance().login('2018013368', '628255').then((res) => {
//     console.log(res[0], res[1]);
//   });
// })

// test('web logout', () => {
//   console.log('test: logout');
//   return logout(jwt);
// })

// test('web user', () => {
//   console.log('test: user');
//   return user(jwt);
// })

// test('web get_post', () => {
//   console.log('test: get_post');
//   return get_post(jwt);
// })

// test('web create_post', () => {
//   console.log('test: create_post');
//   return create_post(jwt, {title: 'api测试中', content:'naidesu'});
// })

// test('web modify_post', () => {
//   console.log('test: modify_post');
//   return modify_post(jwt, 19, {title: 'api单元测试中', content:'快猝死了，该睡觉了'});
// })

// test('web get_post_detail', () => {
//   console.log('test: get_post_detail');
//   return get_post_detail(jwt, 19);
// })

// test('web reply_post', () => {
//   console.log('test: reply_post');q
//   return reply_post(jwt, 19, '一次原生api回复测试', 1);
// })

// test('web modify_reply_post', () => {
//   console.log('test: modify_reply_post');
//   return modify_reply_post(jwt, 19, '修改回复', 25);
// })

