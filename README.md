# public-api
public api for osaguild

## api lists
| api          | description                          |
| :----------- | :----------------------------------- |
| taberogu api | api to get taberogu info by scraping |

## base url
| env  | url                          |
| :--- | :--------------------------- |
| dev  | https://api.dev.osaguild.com |
| prd  | https://api.osaguild.com     |

## api reference

### taberogu api
| method     | endpoint             | request                               | response                                                                       |
| :--------- | :------------------- | :------------------------------------ | :----------------------------------------------------------------------------- |
| getShop    | /v1/taberogu         | ?prefecture=xxx&city=xxx&shopName=xxx | { "id": "1234", "url": "https://xxx", "star": "3.5", "unique": true }          |
| getRanking | /v1/taberogu/ranking | ?prefecture=xxx&city=xxx              | [{ "id": "1234", "url": "https://xxx", "star": "3.5", "ranking": true }, ... ] |