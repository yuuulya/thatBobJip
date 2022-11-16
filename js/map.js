let centerLat = 37.54667362412562;
let centerLng = 126.94970599817853;
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(centerLat, centerLng), // 지도의 중심좌표 (공덕역)
    level: 3, // 지도의 확대 레벨
  };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도에 표시할 원을 생성
var circle = new kakao.maps.Circle({
  center: new kakao.maps.LatLng(centerLat, centerLng), // 원의 중심좌표햣 (공덕역)
  radius: 1000, // 미터 단위의 원의 반지름
  strokeWeight: 2, // 선의 두께
  strokeColor: "#75fa75", // 선의 색깔
  strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명
  strokeStyle: "dashed", // 선의 스타일 입니다
  fillColor: "#d0ffcf", // 채우기 색깔입니다
  fillOpacity: 0.5, // 채우기 불투명도 입니다
});

console.log("원표시");
// 지도에 원을 표시합니다
circle.setMap(map);

var geocoder = new kakao.maps.services.Geocoder(), // 좌표계 변환 객체를 생성합니다
  wtmX = 194986.978304208 + 70;
console.log(wtmX); // 변환할 WTM X 좌표 입니다
wtmY = 448633.912588529 + 300; // 변환할 WTM Y 좌표 입니다

// WTM 좌표를 WGS84 좌표계의 좌표로 변환합니다
geocoder.transCoord(wtmX, wtmY, transCoordCB, {
  input_coord: kakao.maps.services.Coords.WTM, // 변환을 위해 입력한 좌표계 입니다
  output_coord: kakao.maps.services.Coords.WGS84, // 변환 결과로 받을 좌표계 입니다
});

// 좌표 변환 결과를 받아서 처리할 콜백함수 입니다.
function transCoordCB(result, status) {
  // 정상적으로 검색이 완료됐으면
  if (status === kakao.maps.services.Status.OK) {
    // 마커를 변환된 위치에 표시합니다
    var marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(result[0].y, result[0].x), // 마커를 표시할 위치입니다
      map: map, // 마커를 표시할 지도객체입니다
    });
  }
}
