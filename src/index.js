const fs = require('fs');
const crypto = require('crypto');
const qs = require('querystring');
const { add, sub, format } = require("date-fns");

// Private key for signing (in PEM format)
const privateKey = process.env.FOFA_PRIVATE_KEY;
const apiKey = process.env.FOFA_API_KEY;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const sign = (params = {}) => {
  let msg = ''
  Object.keys(params).sort().map(i => {
    msg += `${i}${params[i]}`
  })

  const s = crypto.createSign('RSA-SHA256');
  s.update(msg);
  return s.sign(privateKey, 'base64');
}

const query = async(params = {}) => {
  params.sign = sign(params)
  params['app_id'] = apiKey

  const q = qs.stringify(params)
  return fetch("https://api.fofa.info/v1/search?"+q, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "authorization": "eyJhbGciOiJIUzUxMiIsImtpZCI6Ik5XWTVZakF4TVRkalltSTJNRFZsWXpRM05EWXdaakF3TURVMlkyWTNZemd3TUdRd1pUTmpZUT09IiwidHlwIjoiSldUIn0.eyJpZCI6Mzk4MjE4LCJtaWQiOjEwMDIyODkwNSwidXNlcm5hbWUiOiJldHVmYXFrMSIsImV4cCI6MTcxNDcxNjE1MX0.v-J2q3cA7OLDFnNMzbW1HOaMH1zyP7bn16h2ezT8ZqeeVOFXDn11A7NtkGVHUJHvy0K6kxU9oNUVtYyj-64h_A",
      "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "cookie": "_ga=GA1.1.1633413185.1714385768; Hm_lvt_4275507ba9b9ea6b942c7a3f7c66da90=1714385771; __fcd=DoSg86KtmscG90PfGFZMnkJh; Hm_lpvt_4275507ba9b9ea6b942c7a3f7c66da90=1714448200; _ga_9GWBD260K9=GS1.1.1714448197.3.1.1714448200.0.0.0; acw_tc=276aede417144552654548096e7d834e338d1a927e69865c86d2033862937e; _ga_CX7MDY134G=GS1.1.1714455219.3.1.1714456968.0.0.0",
      "Referer": "https://en.fofa.info/",
      "Referrer-Policy": "origin"
    },
    "body": null,
    "method": "GET"
  }).then(r => r.json())
}

const queryAll = async (q = 'server=="cloudflare" && port=="443" && country=="JP"', duration = 10) => {
  const size = 50
  const page = 1

  const res = new Set()
  let end = add(new Date(), {days: 2})
  for (let i = 0; i < duration; i++) {
    end = sub(end, {days: 1})
    const start = sub(end, {days: 1})
    const qq = `${q} && after="${format(start, 'yyyy-MM-dd')}" && before="${format(end, 'yyyy-MM-dd')}"`
    const data = await query({qbase64: Buffer.from(q).toString('base64'), full: true, page, size, ts: new Date().getTime()})
    if (data.code !== 0) {
      console.log("error: ", qq, data)
      continue
    }
    console.log("success ", start, end)
    data?.data?.assets?.map(r => res.add(r.ip))
    await sleep(1000)
  }
  return [...res.values()]
}

queryAll().then(data => fs.writeFileSync('jp.txt', data.join('\n'), {
  encoding: 'utf-8'
}))
