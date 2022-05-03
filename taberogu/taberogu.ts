const axios = require('axios');

export async function get(event: any): Promise<any> {
  let zipcode = '9071801';
  const res = await axios.get(`https://api.zipaddress.net/?zipcode=${zipcode}`);
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: res.data.data.pref,
  };
}