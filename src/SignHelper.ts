import * as moment from 'dayjs';
import * as crypto from 'crypto';
import { AxiosRequestConfig } from 'axios';
import { sign } from 'crypto';
export interface SignOptions {
  VERB?: string;
  xLogDate?: string;
  xLogApiversion: string;
  xLogSignaturemethod?: string;
  logstorename: string;
  QUERY_STRING: string;
}

class SignHelper {
  AccessKeyID: string;
  AccessKeySecret: string;
  // fullfilled = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  //   //这里要对请求进行签名，先处理get请求
  //   return config;
  // };
  // reject = (error) => {
  //   console.log('reject', error);
  //   return Promise.reject(error);
  // };

  constructor(AccessKeyID: string, AccessKeySecret: string) {
    this.AccessKeyID = AccessKeyID;
    this.AccessKeySecret = AccessKeySecret;
  }

  //Authorization = "LOG" + AccessKeyId + ":" + Signature
  /**
   * 创建请求签名头部
   * @param {SignOptions} signOptions
   */
  createGetLogsHeaders(signOptions: SignOptions):Object {
    const headers = {};
    //配置HTTP请求的方法名称。
    const VERB = signOptions.VERB;
    const logstorename = signOptions.logstorename;
    const QUERY_STRING = signOptions.QUERY_STRING;
    //配置HTTP请求中的标准时间戳头（遵循RFC 1123格式，使用GMT标准时间）。
    const xLogDate = moment().toDate().toUTCString();
    //配置CanonicalizedLOGHeaders

    const CanonicalizedLOGHeaders = `x-log-apiversion:0.6.0\nx-log-signaturemethod:hmac-sha1`;
    console.log('CanonicalizedLOGHeaders', CanonicalizedLOGHeaders);
    const CanonicalizedResource = `/logstores/${logstorename}?${QUERY_STRING}`;
    console.log('CanonicalizedResource', CanonicalizedResource);
    const signStr = `${VERB}\n\n\n${xLogDate}\n${CanonicalizedLOGHeaders}\n${CanonicalizedResource}`;
    console.log('signStr',signStr);
    const hmacSha1 = crypto.createHmac('sha1', this.AccessKeySecret);
    hmacSha1.update(signStr);
    const signature = hmacSha1.digest('base64');
    const xLogHeaders = {
      'x-log-apiversion': '0.6.0',
      'x-log-signaturemethod': 'hmac-sha1',
      'Date': xLogDate,
      'Authorization': `LOG ${this.AccessKeyID}:${signature}`
    };
    return xLogHeaders;
  }

}

export default SignHelper;
