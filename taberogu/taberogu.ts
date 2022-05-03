const axios = require('axios');
const cheerio = require('cheerio');

export async function get(event: any): Promise<any> {
  const area = "さいたま市";
  const name = event.queryStringParameters.name;

  const uri = `https://tabelog.com/saitama/A1101/rstLst/?vs=1&sa=${area}&sw=${name}`;
  const encodeUri = encodeURI(uri);
  const res = await axios.get(encodeUri);
  const $ = cheerio.load(res.data);
  let shopIds: string[] = [];
  let shopUrls: string[] = [];
  $(".js-rst-cassette-wrap").each((index: Number, element: String) => {
    shopIds.push($(element).attr("data-rst-id"));
    shopUrls.push($(element).attr("data-detail-url"));
  });
  const body = { "id": shopIds[0], "url": shopUrls[0] };
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body),
  };
}