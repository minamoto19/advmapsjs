 $(document).ready(function() {
  var location_timeout = setTimeout("geoLoginFailed()", 60000);

  function findPosition() {
    if (navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(successCallback,errorCallback,{maximumAge:60000, timeout:60000, enableHighAccuracy:true});
    } else {
      geoLoginFailed(1);
      clearTimeout(location_timeout);
    }
  }

  function successCallback(position) {
    loclat = position.coords.latitude;
    loclng = position.coords.longitude;
    var coords = (loclat+","+loclng);
    clearTimeout(location_timeout);
    if (coords) {
      $.ajax({
        type: 'post',
        url: window.location.href,
        dataType: 'json',
        data: {
          setLocation: 1,
          position: coords
        },
        success: function (json) {
          if (json.status != "success") {
            alert("Something went wrong. Trying again");
            findPosition();
          }
        }
      });
    }
  }

  function errorCallback(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        clearTimeout(location_timeout);
        geoLoginFailed(2);
        break;
      case error.POSITION_UNAVAILABLE:
      console.log(error);
        clearTimeout(location_timeout);
        geoLoginFailed(3);
        break;
      case error.TIMEOUT:
        clearTimeout(location_timeout);
        geoLoginFailed(4);
        break;
      case error.UNKNOWN_ERROR:
        clearTimeout(location_timeout);
        geoLoginFailed(5);
        break;
    }
  }

  function geoLoginFailed(error) {
    switch(error) {
      case 1:
        alert("Your browser is not supported by SBProject app");
        break;
      case 2:
        alert("You have to share your location to enter SBProject app");
        break;
      case 3:
        alert("You cannot login to SBProject app from your current location");
        findPosition();
        break;
      case 4:
        alert("Please share your location in order to login to SBProject app");
        findPosition();
        break;
      case 5:
        alert("Something went wrong. Trying again");
        findPosition();
        break;
    }
  }

  findPosition();

});