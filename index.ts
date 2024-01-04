import axios from 'axios';
import https from 'https'
import momentTimeZone, { Moment } from 'moment-timezone'
import fs from 'fs'

const writeData = (path: string, data: any) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
}

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
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    url: 'https://124.70.10.184:35876/api/examination/template/paper/paperGroup',
    headers: {
      'Token': 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE3MDQzMzAzNDQsInN1YiI6IntcInVzZXJJZFwiOlwiZjQzMTFkYmNiM2JkY2YwYjE0ODBkZmFhMTU0NzI2ZTdcIn0iLCJleHAiOjE3MDQzNzM1NDR9.MbtRnrrDzkXnO35YStIcwAe24XoTQCfsRvfuSNsN_hk',
      'Content-Type': 'application/json'
    },
    data: data
  };

  const re = await axios.request(config)
  return re.data.data[0].paperDTOList
}

const getItemsByTestId = async (testId: string) => {
  const timestamp = getCurrentBeijingTime().valueOf()
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    url: `https://124.70.10.184:35876/api/examination/template/paper/getPaperDetail?id=${testId}&client=web&timestamp=${timestamp}`,
    headers: {
      'Token': 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE3MDQzMzAzNDQsInN1YiI6IntcInVzZXJJZFwiOlwiZjQzMTFkYmNiM2JkY2YwYjE0ODBkZmFhMTU0NzI2ZTdcIn0iLCJleHAiOjE3MDQzNzM1NDR9.MbtRnrrDzkXnO35YStIcwAe24XoTQCfsRvfuSNsN_hk',
    }
  };

  const re = await axios.request(config)
  return re.data.data
}

getAllTest().then((allTests) => {
  Promise.all(allTests.map(async (test: any) => {
    const items = await getItemsByTestId(test.id)
    return items
  })).then((resps) => {
    resps.forEach((resp) => {
      const re = {
        id: resp.id,
        name: resp.name,
        introduction: resp.introduction,
        questions: resp.questions.map((item: any) => {
          return {
            id: item.id,
            orderNo: item.orderNo,
            title: item.title,
            questionItem: item.questionItem.map((it: any) => {
              return {
                id: it.id,
                orderNum: it.orderNum,
                itemNum: it.itemNum,
                isCorrect: it.isCorrect,
                optionText: it.optionText,
              }
            }),
          }
        })
      }
      writeData(`./output/${resp.name}.json`, re)
    })
  })
})

// getItemsByTestId('0142c2b649ff42a2a73fc7548ce25c2b')