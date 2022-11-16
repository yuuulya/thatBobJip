////공공데이터
const API_KEY = "######";
const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/LOCALDATA_072404/1/10/`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    //주소
    console.log(data.LOCALDATA_072404.row[0].RDNWHLADDR);
  })
  .catch((error) => console.log(error));
