const storage = localStorage.getItem('aniland-pos');
const receipts = document.getElementById("receipts");
const totalsSpan = document.getElementById("totals");
let totals = 0;
let index = 0;

// Arrays for chart data
let chartDates = [];
let chartAmounts = [];

if (storage != null) {

    const receiptsArray = JSON.parse(storage);
    const receiptGroups = groupReceiptsByDate(receiptsArray);

    for (const receiptGroup in receiptGroups) {
        receipts.innerHTML += returnHtmlReceiptGroup(receiptGroups, receiptGroup, index);
        index++;
    }

    totalsSpan.innerHTML = `${totals},-`;
}

// Creates object with array of receipts grouped by date
function groupReceiptsByDate(receiptArray) {
    let receiptGroups = {};

    receiptArray.forEach(receipt => {

        // Create index from day, month, year
        const date = new Date(receipt.date);

        // Month+1 for correct indexing 1=Jan, 2=Feb, ..
        const index = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

        if (receiptGroups[index]) {
            receiptGroups[index].push(receipt);
        } else {
            receiptGroups[index] = [receipt];
        }

    });

    return receiptGroups;
}

// Return HTML for one receipt group
// Collects data for chart
function returnHtmlReceiptGroup(receiptGroups, receiptGroup, index) {
    const { groupList, groupTotals } = returnHtmlReceiptGroupListAndGroupTotals(receiptGroups, receiptGroup);
    const date = formatDateToCzech(new Date(receiptGroup));
    collectDataForChart(date, groupTotals);

    const html =
        `<div class="card mb-2">
        <div class="card-header bg-primary text-light d-flex justify-content-between" data-bs-toggle="collapse" data-bs-target="#multiCollapse${index}" aria-expanded="false" aria-controls="multiCollapse${index}">
            <span>${date}</span><span class="text-light">${groupTotals},-</span>
        </div>
        <div class="collapse multi-collapse" id="multiCollapse${index}">
            ${groupList}
        </div>
    </div>`

    return html;
}

// Return HTML for list in group and totals
// Sum totals of receips in given group
function returnHtmlReceiptGroupListAndGroupTotals(receiptGroups, receiptGroup) {
    let groupList = `<ul class="list-group list-group-flush">`;
    let groupTotals = 0;

    receiptGroups[receiptGroup].forEach(receipt => {
        groupList += returnHtmlReceiptGroupListItem(receipt);
        groupTotals += receipt.amount;
    });
    groupList += `</ul>`;

    totals += groupTotals;

    return { groupList, groupTotals };
}

// Return HTML for one receipt
function returnHtmlReceiptGroupListItem(receipt) {
    const receiptDate = new Date(receipt.date);
    const receiptHours = addLeadingZeroesToTime(receiptDate.getHours());
    const receiptMinutes = addLeadingZeroesToTime(receiptDate.getMinutes());
    const html =
        `<li class="list-group-item"><span class="badge bg-secondary me-2">${receiptHours}:${receiptMinutes}</span>${receipt.amount},-</li>`;

    return html;
}

// Convert date to czech-specific format
function formatDateToCzech(date) {
    const months = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];

    const day = date.getDate();
    const year = date.getFullYear();

    return `${day}. ${monthName} ${year}`;
}

// If hours or minutes are less than 10, they miss leading zero, this function fixes it
function addLeadingZeroesToTime(time) {
    const singleDigitThreshold = 10;
    const timeWithLeadingZeros = time < singleDigitThreshold ? `0${time}` : time;
    return timeWithLeadingZeros;
}

// Collect data for chart.js
function collectDataForChart(date, amount) {
    chartDates.push(date);
    chartAmounts.push(amount);
}

// Delete all receipts saved in local storage
function deleteAllReceipts() {
    const storage = localStorage.getItem('aniland-pos');
    if (storage != null) {
        localStorage.removeItem('aniland-pos');
        location.reload();
    }
}