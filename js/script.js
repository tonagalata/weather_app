
const $proxy = "http://cors-anywhere.herokuapp.com/"

function titleCase(str) {
  str = str.toLowerCase();
  str = str.split(' ');
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

let $lat, $long, $city, $country, $zipcode, $date, $dateTime;

$('form').on('submit', (event) => {
  event.preventDefault();
  if(!$('#five-day dd') && !$('#main-weather dd') && !$('#main-weather img') && !$('#city dd')){return}else{
    for(let i = 0; i < 10; i++){
      $('#five-day dd').remove(i);
      $('#main-weather dd').remove(i);
      $('#main-weather img').remove(i);
      $('#city dd').remove(i);
    }
  }
  $city = $('input[type = "text"]').val();
  
  const $api = `https://api.openweathermap.org/data/2.5/weather?q=${$city}&mode=xml&units=imperial&appid=31966edad4cc438cff8333e9f83e5ec1`
  const $forcast = `https://api.openweathermap.org/data/2.5/forecast?q=${$city}&mode=xml&units=imperial&appid=31966edad4cc438cff8333e9f83e5ec1`
  
  // navigator.geolocation.getCurrentPosition( (position) => {
  //   lat = position.coords.latitude;
  //   long = position.coords.longitude;
  //   console.log(position)
  //   });


  const $promise = $.ajax({url: $api})
  const $promise2 = $.ajax({url: $forcast})
  
  $promise.then(
    (data) => {
      let parser = new DOMParser();
      let $xmlDoc = parser.parseFromString(data,"text/xml");
      let $xmlTemp = data.getElementsByTagName("temperature")[0].attributes[0].value;
      let $icon = data.getElementsByTagName("weather")[0].attributes[2].value;
      let $xmlCheck = data.getElementsByTagName("weather")[0].attributes[2].value;
      console.log(data)
      console.log($xmlTemp)
      
      console.log($icon)

      let $timeOfDay = $icon.substring(2,4) == 'n' ? "Nighttime": "Daytime";
      $date = new Date().toLocaleDateString('en-us')
      $dateTime = new Date().toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'})
      
      // console.log($timeOfDay);
      const $imgUrl = `http://openweathermap.org/img/wn/${$icon}@2x.png`
      $('#main-weather').append('<dd><img src=' + $imgUrl+ '></dd>')
      $('#main-weather').append('<dd>' + $timeOfDay + '</dd>')
      $('#date').html('Time & Date: ' + $date + "\n " + $dateTime),
      $('#temp').html(Math.ceil($xmlTemp) + '° F'),
      $('#main-weather').append('<dd>'+titleCase(data.weather[0].description)+'</dd>')
      // console.log(data);
      // console.log(titleCase(data.weather[0].description));
  },
    (error) => {
      console.log('bad request: ', error);
  }
    ); 

    $promise2.then(
      (data) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data,"text/xml");
        let xmlCheck = data.getElementsByTagName("forecast")[0];
        
        let $dayTemp, $dyCondition, $dyDate, $dyTime, $time, $cityName, $dySymbol;
        console.log(data)
        console.log(xmlCheck.getElementsByTagName("symbol")[1].attributes[2].value)
        console.log(xmlCheck.getElementsByTagName("time")[8].attributes[1].value.toLocaleString('en-us', {year: '2-digit', month: '2-digit', day: '2-digit'}));
        $cityName = data.getElementsByTagName("name")[0].innerHTML;
        console.log($cityName)
        $('#city').append('<dd>'+ $cityName + '</dd>')
        for(let i = 0; i <= 5; i++){
          let $icon = xmlCheck.getElementsByTagName("symbol")[i*8].attributes[2].value;
          const $imgUrl = `http://openweathermap.org/img/wn/${$icon}.png`
          $time = xmlCheck.getElementsByTagName("time")[i*8].attributes[1].value;
          $dyTime = new Date($time).toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'});
          $dyDate = new Date($time).toLocaleString('en-us', {year: '2-digit', month: '2-digit', day: '2-digit'});
          $dyCondition = xmlCheck.getElementsByTagName("symbol")[i*8].attributes[1].value;
          $dayTemp = xmlCheck.getElementsByTagName("temperature")[i*8].attributes[1].value;
          // $('#five-day').append('<dd>'+ titleCase($dyCondition) + "\n" + Math.ceil($dayTemp) + '° F' +'</dd>')
          $('#five-day').append('<dd>'+ $dyDate + "<img src=" + $imgUrl + ">" + "\n" + Math.ceil($dayTemp) + '° F' +'</dd>')
        }

    },
      (error) => {
        console.log('bad request: ', error);
    }
      ); 


});
  