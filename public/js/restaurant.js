let centerLat = 37.54667362412562;
let centerLng = 126.94970599817853;

////공공데이터
const API_KEY = "#####";
const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/LOCALDATA_072404/`;
let zoneList = [];
const mapo = "마포구";
let zoneAlive;
let zoneName;
let zoneLat;
let zoneLng;
let zoneGu;

for (let i = 1; i < 480000; i += 1) {
  fetch(url + i + "/" + (i += 998))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //주소
      let rows = data.LOCALDATA_072404.row;
      for (let i = 0; i < data.LOCALDATA_072404.row.length; i++) {
        let test = rows[i].DTLSTATENM;
        let testArea = rows[i].RDNWHLADDR;

        //폐업 여부 필터링
        if (testArea.includes(mapo) && test != "폐업") {
          //tru
          // && 3조건
          // 따로따로ㄴ
          // 1. 마포구
          // 2. 폐업
          // 배열에 저장해놨다가 .. 시간복잡도 빠르게
          //
          zoneAlive = rows[i].DTLSTATENM;
          zoneName = rows[i].BPLCNM;
          zoneLat = rows[i].X;
          zoneLng = rows[i].Y;
          zoneGu = rows[i].RDNWHLADDR;

          zoneLocation = {
            zoneAlive: zoneAlive,
            zoneName: zoneName,
            zoneLat: zoneLat,
            zoneLng: zoneLng,
            zoneGu: zoneGu,
          };
          zoneList.push(zoneLocation);
        }
      }
      console.log(zoneList);
      for (let i = 0; i < zoneList.length; i++) {
        trans(Number(zoneList[i].zoneLat), Number(zoneList[i].zoneLng));
      }
      //함수
    })
    // .then (//함수 )
    .catch((error) => console.log(error));
}

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(centerLat, centerLng), // 지도의 중심좌표 (공덕역)
    level: 8, // 지도의 확대 레벨
  };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성
var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도에 표시할 원을 생성
var circle = new kakao.maps.Circle({
  center: new kakao.maps.LatLng(centerLat, centerLng), // 원의 중심좌표(공덕역)
  radius: 1000, // 미터 단위의 원의 반지름
  strokeWeight: 2, // 선의 두께
  strokeColor: "#75fa75", // 선의 색깔
  strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명
  strokeStyle: "dashed", // 선의 스타일 입니다
  fillColor: "#d0ffcf", // 채우기 색깔입니다
  fillOpacity: 0.3, // 채우기 불투명도 입니다
});

// 지도에 원을 표시
circle.setMap(map);

/**
 *
 * 좌표계 변환
 */

function trans(lat, lng) {
  var geocoder = new kakao.maps.services.Geocoder(), // 좌표계 변환 객체를 생성합니다
    wtmX = lat + 70;
  wtmY = lng + 300;

  geocoder.transCoord(wtmX, wtmY, transCoordCB, {
    input_coord: kakao.maps.services.Coords.WTM, // 변환을 위해 입력한 좌표계 입니다
    output_coord: kakao.maps.services.Coords.WGS84, // 변환 결과로 받을 좌표계 입니다
  });
}

// 좌표 변환 결과를 받아서 처리할 콜백함수 입니다.
function transCoordCB(result, status) {
  // 정상적으로 검색이 완료됐으면
  if (status === kakao.maps.services.Status.OK) {
    /////길이 구하기

    var linePath = [
      new kakao.maps.LatLng(centerLat, centerLng),
      new kakao.maps.LatLng(result[0].y, result[0].x),
    ];

    var polyline = new kakao.maps.Polyline({
      // 선을 구성하는 좌표배열 입니다
      path: linePath,
    });

    if (polyline.getLength() <= 1000) {
      // 마커를 변환된 위치에 표시합니다
      var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(result[0].y, result[0].x), // 마커를 표시할 위치입니다
        map: map, // 마커를 표시할 지도객체입니다
      });
    }
  }
}

/**
 *
 * 마커 표시
 */

// 마커가 표시될 위치
var markerPosition = new kakao.maps.LatLng(centerLat, centerLng);

// 마커 생성
var marker = new kakao.maps.Marker({
  position: markerPosition,
});

// 마커가 지도 위에 표시되도록 설정
marker.setMap(map);
