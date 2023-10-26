let weightEl = document.querySelector('#weight');
let result = document.querySelector('#result');
let remainAlcohol = document.querySelector('#remain-alcohol');
let remainVodka = document.querySelector('#remain-vodka');
let remainChampagne = document.querySelector('#remain-champagne');
let hiddenResults = document.querySelectorAll('.hide-result');
let getResults = document.querySelector('#get-results');

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

function createNewDrink() {
    let newDrink = document.createElement('div');
    let drinkNumber = document.createElement('div');
    let drinkAmountEl = document.createElement('input');
    let alcoholLevelEl = document.createElement('input');

    newDrink.setAttribute('class', 'new-drink');
    drinkNumber.setAttribute('class', 'drink-number');
    drinkAmountEl.setAttribute('class', 'drink-amount focus-outline');
    alcoholLevelEl.setAttribute('class', 'alcohol-level focus-outline');
    drinkAmountEl.setAttribute('placeholder', 'Объём напитка (мл.)');
    alcoholLevelEl.setAttribute('placeholder', 'Крепость напитка (%)');

    newDrink.append(drinkNumber);
    newDrink.append(drinkAmountEl);
    newDrink.append(alcoholLevelEl);

    otherDrinks.append(newDrink);

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
            remainAlcohol.textContent = Math.floor(allowToDrink);
            remainVodka.textContent = Math.floor(allowToDrink*100/40);
            remainChampagne.textContent = Math.floor(allowToDrink*100/12.5);
        }
        totalDrank = 0;

        alcoholStatus(); 
        testRemain();
    });
};

function alcoholStatus() {
    if (allowToDrink > 0) {
        result.textContent = 'Еще можно пить!';
    } else if (allowToDrink <= 0) {
        result.textContent = 'Вероятно, что ты уже сдох!';
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


