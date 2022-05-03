const axios = require('axios');
const cheerio = require('cheerio');

export async function get(event: any): Promise<any> {
  const area = "さいたま市";
  const name = event.queryStringParameters.name;
  //const name = "日高屋";
  const uri = `https://tabelog.com/saitama/A1101/rstLst/?vs=1&sa=${area}&sw=${name}`;
  const encodeUri = encodeURI(uri);
  const res = await axios.get(encodeUri);
  const $ = cheerio.load(res.data);
  let shops: string[] = [];
  $(".js-rst-cassette-wrap").each((index: Number, element: String) => {
    shops.push($(element).attr("data-detail-url"));
  });
  
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: shops[0],
  };
}