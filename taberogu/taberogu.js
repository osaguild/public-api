exports.main = async function (event) {
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "success"
  };
}