import axios, { AxiosRequestConfig } from 'axios';

const fullfilled = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  //这里要对请求进行签名，先处理get请求
  console.log('request:', config);

  return config;
};
const reject = (error) => {
  return Promise.reject(error);
};
export default {
  fullfilled,
  reject
};
