// Calculator variables
const calculatorDisplay = document.getElementById("calculatorDisplay");
const itemMultiplierLabel = document.getElementById("itemMultiplierLabel");
let calculatorAmount = 0;
let itemMultiplier = 1;

// Cart variables
const cart = document.getElementById("cart");
let cartItems = [];

// Summary variables
const totalAmountLabel = document.getElementById("totalAmountLabel");
let totalAmount = 0;
const receivedAmountInput = document.getElementById("receivedAmountInput");
let receivedAmount = 0;
const returnAmountLabel = document.getElementById("returnAmountLabel");
const returnAmountLabelParent = returnAmountLabel.parentElement;
let returnAmount = 0;

// OnKeyUp recalculate return amount
receivedAmountInput.addEventListener("keyup", () => {
    calcReturnAmount();
});

/*
** Calculator functions
*/

// Sets calculator display to amount
function setCalculatorDisplay(amount) {
    calculatorDisplay.value = amount;
}

// Resets calculator amount
function resetCalculatorAmount() {
    calculatorAmount = 0;
    setCalculatorDisplay(calculatorAmount);
    vibrate(200);
}

// Upades calculator amount 
function updateCalculatorAmount(amount) {
    calculatorAmount == 0 ? calculatorAmount = Number(amount) : calculatorAmount = Number(`${calculatorAmount}${amount}`);
    setCalculatorDisplay(calculatorAmount);
}

// Increment item multiplier
function incrementItemMultiplier() {
    itemMultiplier += 1;
    itemMultiplierLabel.innerHTML = itemMultiplier;
    vibrate(200);
}

// Decrement item multiplier
function decrementItemMultiplier() {
    itemMultiplier > 1 ? itemMultiplier -= 1 : itemMultiplier = itemMultiplier;
    itemMultiplierLabel.innerHTML = itemMultiplier;
    vibrate(200);
}

// Reset item multiplier
function resetItemMultiplier() {
    itemMultiplier = 1;
    itemMultiplierLabel.innerHTML = itemMultiplier;
}

/*
** Cart functions
*/

// Add item to cart
function addItemToCart() {
    if (calculatorAmount) {
        for (let i = 0; i < itemMultiplier; i++) {
            cartItems.push(calculatorAmount);
            addToTheTotalAmount(calculatorAmount);
        }

        makeDOMButtonArray(cartItems);
        resetItemMultiplier();
        resetCalculatorAmount();
    }
}

// Remove item from cart
function removeItemFromCart(index) {
    if (index >= 0) {
        const deleteCount = 1;
        deletedItem = cartItems.splice(index, deleteCount);
        removeFromTheTotalAmount(deletedItem);
        makeDOMButtonArray(cartItems);
        vibrate(200);
    }
}

// Delete all items from cart
function deleteCart() {
    cartItems.splice(0);
    makeDOMButtonArray(cartItems);
}

// Creates deletable cart button array
function makeDOMButtonArray(cartItems) {
    cart.innerHTML = '';
    for (var i = 0; i < cartItems.length; i++) {
        cart.innerHTML +=
            `<div class="col-3 p-1 d-flex"><button class="btn btn-warning flex-grow-1 py-2 px-1 fw-normal d-flex justify-content-around align-items-center" value=${cartItems[i]} onclick="removeItemFromCart(${i})">${cartItems[i]},-<img src="assets/img/cross_icon.svg" width=16 height=16 alt="Cross icon" class="img-fluid"></button></div>`;
    }
}

/*
** Summary functions
*/

// Add amount to totals
function addToTheTotalAmount(amount) {
    totalAmount += amount;
    totalAmountLabel.innerHTML = totalAmount;
    calcReturnAmount();
}

// Remove amount from totals
function removeFromTheTotalAmount(amount) {
    totalAmount -= amount;
    totalAmountLabel.innerHTML = totalAmount;
    calcReturnAmount();
}

// Reset totals
function resetTotalAmount() {
    totalAmount = 0;
    totalAmountLabel.innerHTML = totalAmount;
}

// Reset amount of money received from customer
function resetReceivedAmount() {
    receivedAmount = 0;
    receivedAmountInput.value = '';
}

// Reset amount of money to return to customer
function resetReturnAmount() {
    returnAmount = 0;
    returnAmountLabel.innerHTML = returnAmount;
}

// Save receipt to local storage and clear checkout
function saveReceipt() {
    if (totalAmount > 0) {
        const storage = localStorage.getItem('aniland-pos');
        const now = new Date().toISOString();
        const item = {
            date: now,
            amount: totalAmount,
        }

        let json = [];
        if (storage != null) {
            json = JSON.parse(storage);
        }
        json.push(item);
        localStorage.setItem('aniland-pos', JSON.stringify(json));
    }
    clearCheckout();
}

// Completely clear checkout
function clearCheckout() {
    resetTotalAmount();
    resetReceivedAmount();
    resetReturnAmount();
    resetCalculatorAmount();
    resetItemMultiplier();
    toggleReturnAmountLabelParentClassList();
    deleteCart();
    vibrate(500);
}

// Calculate money to return to customer
function calcReturnAmount() {
    receivedAmount = receivedAmountInput.value;
    returnAmount = receivedAmount - totalAmount;
    returnAmountLabel.innerHTML = returnAmount;
    toggleReturnAmountLabelParentClassList();
}

// Change bg color of return amount parent
function toggleReturnAmountLabelParentClassList() {
    const returnAmountLabelParentClassList = ["bg-dark", "bg-success", "bg-danger"];
    returnAmountLabelParent.classList.remove(...returnAmountLabelParentClassList);

    if (totalAmount < receivedAmount) {
        returnAmountLabelParent.classList.add("bg-success");
    } else if (totalAmount == receivedAmount) {
        returnAmountLabelParent.classList.add("bg-dark");
    } else {
        returnAmountLabelParent.classList.add("bg-danger");
    }
}

/*
** Others
*/

// Vibrations for Android
function vibrate(msecs) {
    if (navigator.vibrate) {
        navigator.vibrate(msecs);
    }
}