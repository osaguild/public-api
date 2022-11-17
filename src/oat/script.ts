import axios from "axios";

(async () => {
  // get env from command line
  const env = process.argv[2];
  let uri: string;
  if (env === "dev") {
    uri = "https://api.dev.osaguild.com";
  } else if (env === "prd") {
    uri = "https://api.osaguild.com";
  } else {
    throw new Error("env is invalid");
  }
  console.log(`[starting OAT... on ${env}]`);

  // test for /v1/taberogu
  console.log("start... /v1/taberogu");
  const res1 = await axios.get(`${uri}/v1/taberogu`, {
    params: {
      prefecture: "saitama",
      city: "saitama",
      shopName: "よし佳",
    },
  });
  if (res1.status === 200) {
    console.log("success!!");
  } else {
    throw new Error("/v1/taberogu/ranking is invalid");
  }

  // test for /v1/taberogu/ranking
  console.log("start... /v1/taberogu/ranking");
  const res2 = await axios.get(`${uri}/v1/taberogu/ranking`, {
    params: {
      prefecture: "saitama",
      city: "saitama",
    },
  });
  if (res2.status === 200) {
    console.log("success!!");
  } else {
    throw new Error("/v1/taberogu/ranking is invalid");
  }

  // test for /v1/hook
  console.log("start... /v1/hook");
  const res3 = await axios.post(`${uri}/v1/hook`, {
    action: "completed",
    workflow_run: {
      name: `scraping ${env}`,
      path: `.github/workflows/scraping-${env}.yaml`,
      status: "completed",
      conclusion: "success",
    },
  });
  if (res3.status === 200) {
    console.log("success!!");
  } else {
    throw new Error("/v1/hook is invalid");
  }

  // test for /v1/amazon/wish-list
  console.log("start... /v1/amazon/wish-list");
  const res4 = await axios.get(`${uri}/v1/amazon/wish-list`, {
    params: {
      id: "Y0W746THVC7X",
    },
  });
  if (res4.status === 200) {
    console.log("success!!");
  } else {
    throw new Error("/v1/amazon/wish-list is invalid");
  }

  console.log(`[complete OAT... on ${env}]`);
})();
