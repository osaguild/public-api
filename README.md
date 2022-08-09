# public-api

public api for osaguild

## api lists

| api          | description                          |
| :----------- | :----------------------------------- |
| taberogu api | api to get taberogu info by scraping |

## base url

| env | url                          |
| :-- | :--------------------------- |
| dev | https://api.dev.osaguild.com |
| prd | https://api.osaguild.com     |

## api reference

### taberogu api

| service  | method     | endpoint             | request data                                                                                                                                                         | response data                                                                  | curl                                                                                                                                                                                                                                                              |
| :------- | :--------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| taberogu | getShop    | /v1/taberogu         | ?prefecture=xxx&city=xxx&shopName=xxx                                                                                                                                | { "id": "1234", "url": "https://xxx", "star": "3.5", "unique": true }          | curl 'https://api.dev.osaguild.com/v1/taberogu?prefecture=saitama&city=saitama&shopName=よし佳'                                                                                                                                                                   |
| taberogu | getRanking | /v1/taberogu/ranking | ?prefecture=xxx&city=xxx                                                                                                                                             | [{ "id": "1234", "url": "https://xxx", "star": "3.5", "ranking": true }, ... ] | curl 'https://api.dev.osaguild.com/v1/taberogu/ranking?prefecture=saitama&city=saitama'                                                                                                                                                                           |
| hook     | hook       | /v1/hook             | { "action": "completed", "workflow_run": { "name": "scraping dev", "path": ".github/workflows/scraping-dev.yaml", "status": "completed", "conclusion": "success" } } | "success"                                                                      | curl -X POST -H "Content-Type: application/json" -d '{ "action": "completed", "workflow_run": { "name": "scraping dev", "path": ".github/workflows/scraping-dev.yaml", "status": "completed", "conclusion": "success" } }' 'https://api.dev.osaguild.com/v1/hook' |
