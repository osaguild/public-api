exports.main = async function (event: any) {
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "success"
  };
}