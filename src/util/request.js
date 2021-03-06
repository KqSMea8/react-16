/**
 * request 网络请求工具
 * 提供诸如参数序列号, 缓存, 超时, 字符编码处理, 错误处理等常用功能,
 * 详情参考api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from '@alipay/bigfish/sdk/request';
import { message } from '@alipay/bigfish/antd';
// import history from '@alipay/bigfish/sdk/history';

// reference antd pro
const statusCodeMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const resultCodeMessage = {
  '021': '测试弹出一个错误消息',
  '022': '这是另一个错误',
};

/**
 * 异常处理程序
 * 示例约定的返回错误格式为 { resultCode: string, resultMsg: string, isBizError: boolean }, 实际情况需要根据项目调整
 * @param {*} error
 */
const errorHandler = error => {
  const { response = {}, data = {} } = error;
  if (data.isBizError) {
    // 业务错误, 继续抛出以便定制处理.
    throw error;
  }

  // 对于其他不需要特意关注的错误, 统一处理.
  if (response.status === 404) {
    // case: 根据状态跳转异常页
    // history.push('/exception/404');
  } else {
    // case: 根据返回消息中的resultCode弹出错误消息, 如果没有找到, 根据状态码弹, 还是没找到弹错误消息.
    const msg =
      resultCodeMessage[data.resultCode] || statusCodeMessage[response.status] || error.message;
    message.error(msg, 3);
  }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // prefix: '/api', // 默认prefix
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

export default request;
