const searchButton=document.querySelector(".search-button");
const locatnButton=document.querySelector(".location-button");
const cityInput=document.querySelector(".city-input");
const API_KEY="b5af9e93940f753241f13e9cde3eb97a";
const weatherCardDiv=document.querySelector(".weather-cards");
const currWeaCardDiv=document.querySelector(".current-weather");
const createWeatherCard=(cityName,weatherItem,index)=>{
    if(index===0){//HTML for main card
        return `<div class="details">
                    <h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>temperature:${(weatherItem.main.temp-273.15).toFixed(2)}'c</h4>
                    <h4>wind:${weatherItem.wind.speed}m/s</h4>
                    <h4>humidity:${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon"/>
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`
    }
    else{//HTML for forecast cards
    return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon"/>
                <h4>temp:${(weatherItem.main.temp-273.15).toFixed(2)}'c</h4>
                <h4>wind:${weatherItem.wind.speed}m/s</h4>
                <h4>humidity:${weatherItem.main.humidity}%</h4>
            </li>`;
    }
}
const getWeatherDetails=(cityName,lat,lon)=>{
    const WEATHER_API_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
        console.log(data);
        //filter forecast days for only getting unique days
        const uniqueForecastDays=[]
        const fiveDaysForecast=data.list.filter(forecast=>{
            const forecastDate=new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        })
        //clearing previous cards
        cityInput.value="";
        weatherCardDiv.innerHTML="";
        currWeaCardDiv.innerHTML="";
        //adding new cards
        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem,index) => {
            if(index===0){
                currWeaCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));      
            }
            else{
                weatherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
            }
        });
        
    }).catch(()=>{
        alert("an error occured while fetching weather details");
    })
}
const getCityCoordinates=()=>{
    const cityName=cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
//getting co ordinates of entered city
    fetch(GEOCODING_API_URL).then(res=>res.json()).then(data=>{
        if (!data.length) return alert(`no co ordinate found for${cityName}`)
        const{name,lat,lon}=data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(()=>{
        alert("an error occured while fetching coordinates");
    })
}
const getUserCoordinates=()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
            const{latitude,longitude}=position.coords;
            const REVERSE_GEOCODING_URL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res=>res.json()).then(data=>{
                console.log(data);
                const {name}=data[0];
                getWeatherDetails(name,latitude,longitude);                
            }).catch(()=>{
                alert("an error occured while fetching city");
            })
        },
        error=>{
            if(error.code===error.PERMISSION_DENIED){
                alert("geolocation request denied please reset location permission to grant acces again");
            }
        }
    )
}
searchButton.addEventListener("click",getCityCoordinates);
locatnButton.addEventListener("click",getUserCoordinates)