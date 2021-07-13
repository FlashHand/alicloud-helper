//测试获取日志
import SlsHelper, { SlsOptions } from './src/SlsHelper';
const yjzSlsOpt:SlsOptions ={
  AccessKeyID: 'LTAI5tSKjmrRfAkoeQGHaadD',
  AccessKeySecret: 'TuhFvflkVAeHgOP8lX1d0KzsZthgEf',
  logStore: 'store_prod_yjz',
  timeout: 60000,
  endpoint: 'cn-hangzhou.log.aliyuncs.com',
  project: 'terminal-log-prod',
}
const from = 1624761095;
const to = 1624865895;
const yjzSlsHelper = new SlsHelper(yjzSlsOpt);

(async function() {
  try {
    let res = await yjzSlsHelper.getLogs({
      query:'sql',
      from:from,
      to: to
    })
  }catch (e){
    console.log('测试', e.message);
  }

})();

