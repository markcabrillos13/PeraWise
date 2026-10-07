const dateInput = document.getElementById("date");
const moneyInput = document.getElementById("money");

const foodInput = document.getElementById("food");
const fareInput = document.getElementById("fare");
const parentsInput = document.getElementById("parents");
const savingsInput = document.getElementById("savings");
const othersInput = document.getElementById("others");

const totalSpentDisplay = document.getElementById("totalSpent");
const remainingDisplay = document.getElementById("remaining");

const saveBtn = document.getElementById("saveBtn");
const historyContainer = document.getElementById("history");

const STORAGE_KEY = "dailyMoneyTracker";


/* GET TODAY */

function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* FORMAT MONEY */

function formatMoney(amount) {
    return "₱" + Number(amount || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


/* GET INPUT VALUE */

function getValue(input) {
    return Number(input.value) || 0;
}


/* CALCULATE */

function calculate() {
    const money = getValue(moneyInput);

    const food = getValue(foodInput);
    const fare = getValue(fareInput);
    const parents = getValue(parentsInput);
    const savings = getValue(savingsInput);
    const others = getValue(othersInput);

    const totalSpent =
        food +
        fare +
        parents +
        savings +
        others;

    const remaining = money - totalSpent;

    totalSpentDisplay.textContent =
        formatMoney(totalSpent) + " spent";

    remainingDisplay.textContent =
        formatMoney(remaining);
}


/* INPUT EVENTS */

const inputs = [
    moneyInput,
    foodInput,
    fareInput,
    parentsInput,
    savingsInput,
    othersInput
];

inputs.forEach(input => {
    input.addEventListener("input", calculate);
});


/* GET SAVED DAYS */

function getHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}


/* SAVE HISTORY */

function saveHistory(history) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
    );
}


/* FORMAT DATE */

function formatDate(dateString) {
    const parts = dateString.split("-");

    const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}


/* GET DAY NAME */

function getDayName(dateString) {
    const parts = dateString.split("-");

    const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    return date
        .toLocaleDateString("en-US", {
            weekday: "long"
        })
        .toLowerCase();
}


/* DISPLAY PREVIOUS DAYS */

function displayHistory() {
    const history = getHistory();

    historyContainer.innerHTML = "";

    if (history.length === 0) {
        historyContainer.innerHTML =
            '<p class="empty">No saved days yet.</p>';

        return;
    }

    history.sort((a, b) => {
        return b.date.localeCompare(a.date);
    });

    history.forEach(day => {
        const item = document.createElement("div");

        item.className =
            `day ${getDayName(day.date)}`;

        item.innerHTML = `
            <h3>${formatDate(day.date)}</h3>

            <div class="line">
                <span>Money</span>
                <b>${formatMoney(day.money)}</b>
            </div>

            <div class="line">
                <span>Spent</span>
                <b>${formatMoney(day.totalSpent)}</b>
            </div>

            <div class="line total">
                <span>Remaining</span>
                <b>${formatMoney(day.remaining)}</b>
            </div>
        `;

        historyContainer.appendChild(item);
    });
}


/* LOAD SELECTED DATE */

function loadSelectedDate() {
    const history = getHistory();

    const savedDay = history.find(
        day => day.date === dateInput.value
    );

    if (savedDay) {
        moneyInput.value = savedDay.money;
        foodInput.value = savedDay.food;
        fareInput.value = savedDay.fare;
        parentsInput.value = savedDay.parents;
        savingsInput.value = savedDay.savings;
        othersInput.value = savedDay.others;
    } else {
        moneyInput.value = 0;
        foodInput.value = 0;
        fareInput.value = 0;
        parentsInput.value = 0;
        savingsInput.value = 0;
        othersInput.value = 0;
    }

    calculate();
}


/* DATE CHANGE */

dateInput.addEventListener(
    "change",
    loadSelectedDate
);


/* SAVE DAY */

saveBtn.addEventListener("click", () => {

    const date = dateInput.value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    const money = getValue(moneyInput);

    const food = getValue(foodInput);
    const fare = getValue(fareInput);
    const parents = getValue(parentsInput);
    const savings = getValue(savingsInput);
    const others = getValue(othersInput);

    const totalSpent =
        food +
        fare +
        parents +
        savings +
        others;

    const remaining =
        money - totalSpent;

    const history = getHistory();

    const existingIndex =
        history.findIndex(
            day => day.date === date
        );

    const dayData = {
        date,
        money,
        food,
        fare,
        parents,
        savings,
        others,
        totalSpent,
        remaining
    };

    if (existingIndex !== -1) {

        // Update existing date
        history[existingIndex] = dayData;

    } else {

        // Add new date
        history.push(dayData);
    }

    saveHistory(history);

    displayHistory();

    alert("Saved!");
});


/* START APP */

dateInput.value = getToday();

loadSelectedDate();

displayHistory();