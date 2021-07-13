import axios, { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from 'axios';
import signMw from './networking/middlewares/signMw';
import SignHelper, { SignOptions } from './SignHelper';
import * as qs from 'qs';
import * as moment from 'dayjs';

export interface SlsOptions {
  AccessKeyID: string;
  AccessKeySecret: string;
  logStore: string;
  timeout: number;
  endpoint: string;
  project: string;
}

/**
 * [开始时间from,结束时间to)
 */
export interface LogParams {
  type?: string;
  from: number;
  to: number;
}

export interface LogOptions {
  headers?: any
}

function asciiSortAsc(a, b) {
  return a < b ? -1 : 1;
}

class SlsHelper {
  client: AxiosInstance;
  slsOptions: SlsOptions;
  signHelper: SignHelper;

  constructor(slsOptions: SlsOptions) {
    this.slsOptions = slsOptions;
    this.signHelper = new SignHelper(slsOptions.AccessKeyID, slsOptions.AccessKeySecret);
    const config: AxiosRequestConfig = {
      timeout: slsOptions.timeout || 120000,
      baseURL: `https://${slsOptions.project}.${slsOptions.endpoint}`
    };
    this.client = axios.create(config);
    //设置签名中间件
    this.client.interceptors.request.use(signMw.fullfilled,signMw.reject);
  }

  async getLogs(params: LogParams, option?: LogOptions): Promise<any> {
    try {
      const headers = option?.headers || {};
      let finalParams: LogParams = {
        type: 'log',
        from: params.from,
        to: params.to
      };
      const config = {
        params: finalParams,
        paramsSerializer: params => {
          return qs.stringify(params, { sort: asciiSortAsc });
        },
        headers
      };
      let reqMoment = moment();
      let reqDateUTCStr = reqMoment.toDate().toUTCString();
      let signOptions: SignOptions = {
        VERB: 'GET',
        xLogDate: reqDateUTCStr,
        xLogApiversion: '0.6.0',
        xLogSignaturemethod: 'hmac-sha1',
        logstorename: this.slsOptions.logStore,
        QUERY_STRING: qs.stringify(finalParams, { sort: asciiSortAsc })
      };

      let signHeaders = this.signHelper.createGetLogsHeaders(signOptions);
      config.headers = Object.assign(config.headers, signHeaders);
      console.log(config.headers);
      let res = await this.client.get(`/logstores/${this.slsOptions.logStore}`, config);
      console.log(res);
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export default SlsHelper;
