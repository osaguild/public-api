# puglid-qpi
public api for osaguild

## api lists
| api | description |
| :--- | :--- |
| taberogu api | api to get taberogu info by scraping |

## base url
| env | url |
| :--- | :--- |
| dev | https://api.dev.osaguild.com |
| prd | https://api.osaguild.com |

## api reference

### taberogu api
| method | endpoint |  request | response |
| :---- | :---- | :---- | :---- |
| getShop | /v1/taberogu  | ?name=xxx  | { "id": "1234", "url": "https://xxx", "star": "3.5" } |