'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBlanace = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${acc.balance} $`;
};

const calcSummaryBalance = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + Math.abs(curr), 0);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${incomes}$`;
  labelSumOut.textContent = `${outcomes}$`;
  labelSumInterest.textContent = `${interest}$`;
};

const CreateuserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};

CreateuserName(accounts);

let currentAccount;

const UpdateUI = function () {
  //Unhide the page
  containerApp.style.opacity = 100;
  // Display Movments
  displayMovements(currentAccount);
  //Disply the Balance
  calcDisplayBlanace(currentAccount);
  //Display Summary Balance
  calcSummaryBalance(currentAccount);
};

btnLogin.addEventListener('click', function (e) {
  //Prevent default
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Welcome Message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    // Blanks the username and password
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    UpdateUI(currentAccount);
  }
});

// Transfer the Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recievAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    recievAccount &&
    currentAccount.balance >= amount &&
    recievAccount.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    recievAccount.movements.push(amount);
  }

  UpdateUI(currentAccount);
});

btnClose.addEventListener('click', function (e) {
  //Prevent default
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  }
});

// Apply loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    UpdateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Creating runtime array

const z = Array.from({ length: 100 }, () => Math.round(Math.random(1) * 100));
console.log(z);

const y = Array.from(accounts);
console.log(y);

labelBalance.addEventListener('click', function () {
  const movmentsUi = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent
  );
  console.log(movmentsUi);
});
// console.log(accounts);
// const movements = [200, -200, 340, -300, -20, 505, 400, -460];

// const max = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );
// console.log(max);

// // Challenge 2

// const calcAverageHumanAge = function (arr) {
//   const humanAge = arr.map(function (age) {
//     if (age <= 2) return 2 * age;
//     else if (age > 2) return 16 + age * 4;
//   });

//   console.log(`Human age ${humanAge}`);
//   const dogAge = humanAge.filter(function (dAge) {
//     if (dAge >= 18) return dAge;
//   });

//   console.log(`Human age ${dogAge}`);
//   let avgAge =
//     dogAge.reduce(function (acc, cur) {
//       return acc + cur;
//     }, 0) / dogAge.length;

//   return avgAge;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

// const arr1 = [5, 2, 4, 1, 15, 8, 3];

// const avg = arr1
//   .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//   .filter(humanage => humanage >= 18)
//   .reduce((accu, curr, i, arr) => accu + curr / arr.length, 0);

// console.log(avg);
// const balance = movements.reduce((accu, curr) => {
//   console.log(accu);
//   return accu + curr;
// }, 0);
// console.log(balance);
// const eurTousd = 1.1;
// const movements = [200, -200, 340, -300, -20, 50, 400, -460];

// const converted = movements.map(curr => curr * eurTousd);
// console.log(converted);
// const jdogdata = [3, 5, 2, 12, 7];
// const kdogdata = [4, 1, 15, 8, 3];

// const chkdog = function (arr1, arr2) {
//   const jdata = arr1.slice(1, -2);
//   console.log(jdata);
//   const main = jdata.concat(arr2);
//   main.forEach(function (value, index) {
//     const age = value > 3 ? 'adult' : 'puppy';
//     console.log(`Dog number ${index + 1} is ${age}`);
//   });
// };

// chkdog(jdogdata, kdogdata);

//challenge number 4
// TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => (dog.recommendedFood = dog.weight ** 0.75 * 28));

console.log(dogs);

dogs.forEach(dog => {
  if (dog.owners.find(value => 'Sarah' === value)) {
    if (dog.curfood > dog.recommendedFood) {
      console.log('Eating okay');
    } else {
      console.log('Eating too Much');
    }
  }
});

const dogSarah = dogs.find(values => values.owners.includes('Sarah'));
console.log(
  `Sarah's Dog eating ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'Much' : 'Less'
  }`
);

console.log(dogs);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

console.log(`${ownersEatTooMuch.join(' And ')}'sdog  Eat too Much`);
console.log(`${ownersEatTooLittle.join(' And ')}'sdog  Eat too Less`);

console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOkay));

console.log(dogs.filter(checkEatingOkay));

const SortedDogs = dogs.slice().sort((a, b) => a.curFood - b.recommendedFood);
console.log(dogs);
console.log(SortedDogs);
