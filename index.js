import conditions from "./conditions.js";

console.log(conditions);

const apiKey = 'f7ed05c11a82442b9fa112603241408';

//Элементы на страничке
const header = document.querySelector('.header')
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard() {
    //Удаляем предыдущую карточку
    const prevCard = document.querySelector('.main');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
    //Отобразить карточку с ошибкой
    const html = `<div class="main">${errorMessage}</div>`
                
    //Отображаем карточку на страничке
    header.insertAdjacentHTML('afterend', html);
}

function showCard ({name,country,temp,condition, imgPath}) {
    //Разметка для карточки
    const html = `<main class="main">
        <div class="card">
            <div class="card-container">
                <div class="card-w">
                    <div class="left">
                        <h2 class="sity">${name} <span>${country}</span></h2>
                        <div class="value">${temp}</div>
                        <p class="comment">${condition}</p>
                    </div>
                    <img class="img" src="${imgPath}" alt="">
                </div>
            </div>
        </div>
    </main>`

    //Отображаем карточку на страничке
    header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
return data;
}

//Слушаем отправку формы
form.onsubmit = async function (e) {
    //Отменяем отправку формы
    e.preventDefault();

    //Берём значение из инпута, обрезаем пробелы
    let city = input.value.trim();
    
    //Получаем данные с сервера
    const data = await getWeather(city);
 
    if (data.error) {
        //Если есть ошибка - выводим её
    
        removeCard();
    
        showError(data.error.message);
        
    } else {
        //Если ошибки нет - выводим карточку
        
        removeCard();

        console.log(data.current.condition.code);

        const info = conditions.find((obj) => obj.code === data.current.condition.code);
        console.log(info);
        console.log(info.languages[23]['day_text']);
       
        const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/'
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName
        console.log('filePath', filePath + fileName)

        const weatherData = {
            name:data.location.name, 
            country:data.location.country,
            temp:data.current.temp_c,
            condition:data.current.is_day 
            ? info.languages[23]['day_text']
            : info.languages[23]['night_text'],
            imgPath,
        };
    
        showCard(weatherData);
    }
}