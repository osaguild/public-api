const axios = require('axios');
const cheerio = require('cheerio');

export async function getShop(event: any): Promise<any> {
  // create request
  const area = "さいたま市";
  const name = event.queryStringParameters.name;
  const uri = `https://tabelog.com/saitama/A1101/rstLst/?vs=1&sa=${area}&sw=${name}`;
  const encodedUri = encodeURI(uri);

  // get dom
  const res = await axios.get(encodedUri);
  
  // search dom
  const $ = cheerio.load(res.data);
  const shopIds: string[] = [];
  const shopUrls: string[] = [];
  const shopStars: Number[] = [];
  $(".js-rst-cassette-wrap").each((index: Number, element: String) => {
    shopIds.push($(element).attr("data-rst-id"));
    shopUrls.push($(element).attr("data-detail-url"));
  });
  $(".list-rst__rating-val").each((index: Number, element: String) => {
    shopStars.push($(element).text());
  });

  // create response body
  const body = { 
    id: shopIds[0],
    url: shopUrls[0],
    star: shopStars[0],
  };

  // return http response
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body),
  };
}