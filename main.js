let weightEl = document.querySelector('#weight');
let result = document.querySelector('#result');
let remainAlcohol = document.querySelector('#remain-alcohol');
let remainVodka = document.querySelector('#remain-vodka');
let hiddenResults = document.querySelectorAll('.hide-result');
let getResults = document.querySelector('#get-results');
let changeParameters = document.querySelector('#change-parameters');

let dataContainer =  document.querySelector('.data-container');
let resultContainer =  document.querySelector('.result-container');

let alcoholLevelEl2 = document.querySelector('#alcohol-level2');
let remainAlcohol2 = document.querySelector('#remain-alcohol2');

let addButton = document.querySelector('#add-drink');
let otherDrinks = document.querySelector('#other-drinks');

let buttonLink = document.querySelector('#button-link');

let newDrinks = [];

let countNewDrinks = 1;

let totalDrank = 0;

let maxDose;

let allowToDrink;

function copyToClipboard() {
    navigator.clipboard.writeText('https://stasevdok.github.io/buhlometr/');
    let oldInnerHtml = buttonLink.innerHTML;
    buttonLink.innerHTML = 'Ссылка скопирована';
    setTimeout(function() {
        buttonLink.innerHTML = oldInnerHtml;
      }, 1000);
};

function changeButtonText() {
    if (window.innerWidth < 500) {
        buttonLink.innerHTML = 'Ссылка<img class="button-icon" src="i/link.svg">';
    } else {
        buttonLink.innerHTML = 'Ссылка на калькулятор<img class="button-icon" src="i/link.svg">';
    };
};

changeButtonText();

function hideDataContainer() {
    if (window.innerWidth < 960) {
        resultContainer.classList.add('hide-container');
    };
};

hideDataContainer();

window.addEventListener('resize', function() {
    changeButtonText();
});

changeParameters.addEventListener('click', function() {
    resultContainer.classList.add('hide-container');
    dataContainer.classList.remove('hide-container');
})

function createNewDrink() {
    let newDrink = document.createElement('div');
    let numberAndDrink = document.createElement('div');
    let drinkNumber = document.createElement('div');
    let drinkAmountEl = document.createElement('input');
    let alcoholLevelEl = document.createElement('input');

    newDrink.setAttribute('class', 'new-drink');
    numberAndDrink.setAttribute('class', 'number-and-drink');
    drinkNumber.setAttribute('class', 'drink-number');
    drinkAmountEl.setAttribute('class', 'input-style drink-amount focus-outline');
    alcoholLevelEl.setAttribute('class', 'input-style alcohol-level focus-outline');
    drinkAmountEl.setAttribute('placeholder', 'Объём напитка в мл.');
    alcoholLevelEl.setAttribute('placeholder', 'Крепость напитка (%)');

    numberAndDrink.append(drinkNumber);
    numberAndDrink.append(drinkAmountEl);
    
    newDrink.append(numberAndDrink);
    newDrink.append(alcoholLevelEl);

    otherDrinks.append(newDrink);

    let oldLine = document.querySelector('#other-drinks-line');
    oldLine.remove();
    let newLine = document.createElement('div');
    newLine.setAttribute('id', 'other-drinks-line');
    otherDrinks.append(newLine);

    countNewDrinks = parseInt(document.querySelectorAll('.new-drink').length);
    drinkNumber.textContent = `#${countNewDrinks}`;

    [weightEl, drinkAmountEl, alcoholLevelEl].forEach(function(element) {
        element.addEventListener('input', function() {
            let value = element.value;
            value = value.replace(/,/g, '.');
            value = value.replace(/[^\d.]/g, '');
            element.value = value;
            element.classList.remove('error');
        });
    });

    getResults.addEventListener('click', function() {
        hiddenResults.forEach(function(element) {
            if (parseFloat(weightEl.value) >= 1 && parseFloat(drinkAmountEl.value) >= 0 && parseFloat(alcoholLevelEl.value) >= 0) {
                element.classList.remove('hide-result');
                dataContainer.classList.add('hide-container');
                resultContainer.classList.remove('hide-container');
            };
        });
        if (parseFloat(weightEl.value) >= 1) {
            weightEl.classList.remove('error');
        } else {
            weightEl.classList.add('error');
        };
        if (parseFloat(drinkAmountEl.value) >= 0) {
            drinkAmountEl.classList.remove('error');
        } else {
            drinkAmountEl.classList.add('error');
        };
        if (parseFloat(alcoholLevelEl.value) >= 0) {
            alcoholLevelEl.classList.remove('error');
        } else {
            alcoholLevelEl.classList.add('error');
        };

        calculateMaxDose();
    
        this.amount = parseFloat(drinkAmountEl.value);
        this.level = parseFloat(alcoholLevelEl.value);

        if (isNaN(this.amount)) {
            this.amount = 0;
        };
        if (isNaN(this.level)) {
            this.level = 0;
        };

        let newDrinkInArray = {
            amount: this.amount,
            level: this.level,
        };

        newDrinks.push(newDrinkInArray);

        let newDrinks2 = newDrinks.slice(-countNewDrinks);
        newDrinks = newDrinks2;

        for (let i = 0; i <= newDrinks.length - 1; i++) {
            const drankResult = newDrinks[i].amount * newDrinks[i].level / 100;
            totalDrank += drankResult;
            allowToDrink = maxDose - totalDrank;
            let remainAlcoholValue = Math.floor(allowToDrink);
            let remainVodkaValue = Math.floor(allowToDrink*100/40);
            let remainChampagneValue = Math.floor(allowToDrink*100/12.5);
            remainAlcohol.innerHTML = `До смертельной дозы ещё ${remainAlcoholValue} мл.`;
            remainVodka.innerHTML = `Это ${remainVodkaValue} мл. водки (40%) или ${remainChampagneValue} мл. шампанского (12.5%)`;
        }
        totalDrank = 0;

        alcoholStatus(); 
    });
};

function alcoholStatus() {
    if (allowToDrink > 0) {
        result.textContent = 'Еще можно пить!';
    } else if (allowToDrink <= 0) {
        result.textContent = 'Вероятно, что вы уже мертвы!';
    } else {
        result.textContent = 'Введите корректные данные!';
    };
};

function calculateMaxDose() {
    maxDose = parseFloat(weightEl.value)*8;
}

addButton.addEventListener('click', function () {
    createNewDrink();
});

function testRemain() {
    let alcoholLevel = parseFloat(alcoholLevelEl2.value);
    let calculateAlcohol2 = Math.floor(allowToDrink*100/alcoholLevel);
    remainAlcohol2.innerHTML = `Можно еще выпить <span class="important-number">${calculateAlcohol2}</span> мл. такого напитка`;
    if (isNaN(calculateAlcohol2)) {
        remainAlcohol2.textContent = 'Введите значение крепости напитка';
    } else if (calculateAlcohol2 === Infinity) {
        remainAlcohol2.textContent = 'Введите значение крепости напитка';
    };
};

alcoholLevelEl2.addEventListener('input', function() {
    let value = alcoholLevelEl2.value;
    value = value.replace(/,/g, '.');
    value = value.replace(/[^\d.]/g, '');
    alcoholLevelEl2.value = value;
    alcoholLevelEl2.classList.remove('error');
    testRemain();
});

createNewDrink();




