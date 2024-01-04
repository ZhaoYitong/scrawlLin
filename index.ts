const axios = require('axios');
import momentTimeZone, { Moment } from 'moment-timezone'

const getCurrentBeijingTime = (): Moment => {
    // 获取当前系统时间
    const systemTime = momentTimeZone();
    // 转换为北京时区
    const beijingTime = systemTime.tz('Asia/Shanghai');
    return beijingTime
  }

const getAllTest = async () => {
    let data = JSON.stringify({
        "themeType": ""
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://124.70.10.184:35876/api/examination/template/paper/paperGroup',
        headers: {
            'Token': 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE3MDQzMzAzNDQsInN1YiI6IntcInVzZXJJZFwiOlwiZjQzMTFkYmNiM2JkY2YwYjE0ODBkZmFhMTU0NzI2ZTdcIn0iLCJleHAiOjE3MDQzNzM1NDR9.MbtRnrrDzkXnO35YStIcwAe24XoTQCfsRvfuSNsN_hk',
            'Content-Type': 'application/json',
            // 'Cookie': 'JSESSIONID=816a038b-efcd-48b5-ac71-b0cc75479038'
        },
        data: data
    };

    const re = await axios.request(config)

    return re.data
}

// getAllTest()

const getItemsByTestId = async (testId: string) => {
    const timestamp = getCurrentBeijingTime().valueOf()
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://124.70.10.184:35876/api/examination/template/paper/getPaperDetail?id=${testId}&client=web&timestamp=${timestamp}`,
        headers: { 
          'Token': 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE3MDQzMzAzNDQsInN1YiI6IntcInVzZXJJZFwiOlwiZjQzMTFkYmNiM2JkY2YwYjE0ODBkZmFhMTU0NzI2ZTdcIn0iLCJleHAiOjE3MDQzNzM1NDR9.MbtRnrrDzkXnO35YStIcwAe24XoTQCfsRvfuSNsN_hk', 
        //   'Cookie': 'JSESSIONID=816a038b-efcd-48b5-ac71-b0cc75479038'
        }
      };
      
      const re = await axios.request(config)
      return re.data
}

getItemsByTestId('0142c2b649ff42a2a73fc7548ce25c2b')