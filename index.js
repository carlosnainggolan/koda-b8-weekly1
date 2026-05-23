import { createInterface } from 'readline';
import process from 'process';
import {
  foodCategory,
  listMainCourse,
  listSideDish,
  listDrink,
  categoryQuestion,
  mainCourseQuestion,
  sideDishQuestion,
  drinkQuestion
} from './config/menu.js';
import { rupiahFormatter } from './utils/formatCurrency.js';
import { displayCart } from './utils/display.js'; 

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=========================================");
console.log("  AHLAN WA SAHLAN SELAMAT DATANG DI EMADOS");
console.log("=========================================\n");

export let cart = [];

const askQuestion = (questionText) => {
  return new Promise((resolve) => {
    rl.question(questionText, (answer) => {
      resolve(answer);
    });
  });
};

const selectCategory = async () => {
  const displayCategoryList = () => {
    console.log("--- PILIH KATEGORI MENU ---");
    for (let i = 0; i < foodCategory.length; i++) {
      const categoryName = foodCategory[i].category;
      const idCategory = foodCategory[i].id;
      console.log(`${idCategory}. ${categoryName}`);
    }
  };

  displayCategoryList();

  const answer = await askQuestion(categoryQuestion);
  const categoryChoice = parseInt(answer);
  console.clear();

  if (isNaN(categoryChoice)) {
    console.log("Input harus berupa angka!\n");
    selectCategory();
  } else if (categoryChoice < 1 || categoryChoice > 3) {
    console.log("Tidak ada pilihan tersebut!\n");
    selectCategory();
  } else if (categoryChoice === 1) {
    mainCourse();
  } else if (categoryChoice === 2) {
    sideDish();
  } else if (categoryChoice === 3) {
    drink();
  }
};

const mainCourse = async () => {
  console.log("--- MENU MAIN COURSE ---");
  for (let i = 0; i < listMainCourse.length; i++) {
    const idMainCourse = listMainCourse[i].id;
    const mainCourseName = listMainCourse[i].name;
    const mainCoursePrice = rupiahFormatter.format(listMainCourse[i].price);
    console.log(`${idMainCourse}. ${mainCourseName} : ${mainCoursePrice}`);
  }

  const answerMainCourse = await askQuestion(mainCourseQuestion);
  const mainCourseChoice = parseInt(answerMainCourse);
  console.clear();
  processMenuSelection(mainCourseChoice, listMainCourse, mainCourse);
};

const sideDish = async () => {
  console.log("--- MENU SIDE DISH ---");
  for (let i = 0; i < listSideDish.length; i++) {
    const idSideDish = listSideDish[i].id;
    const sideDishName = listSideDish[i].name;
    const sideDishPrice = rupiahFormatter.format(listSideDish[i].price);
    console.log(`${idSideDish}. ${sideDishName} : ${sideDishPrice}`);
  }

  const answerSideDish = await askQuestion(sideDishQuestion);
  const sideDishChoice = parseInt(answerSideDish);
  console.clear();
  processMenuSelection(sideDishChoice, listSideDish, sideDish);
};

const drink = async () => { 
  console.log("--- MENU DRINK ---");
  for (let i = 0; i < listDrink.length; i++) {
    const idDrink = listDrink[i].id;
    const drinkName = listDrink[i].name;
    const drinkPrice = rupiahFormatter.format(listDrink[i].price);
    console.log(`${idDrink}. ${drinkName} : ${drinkPrice}`);
  }

  const answerDrink = await askQuestion(drinkQuestion);
  const drinkChoice = parseInt(answerDrink);
  console.clear();
  processMenuSelection(drinkChoice, listDrink, drink);
};

const processMenuSelection = (userChoice, listMenu, retryMenuFunction) => {
  const selectedMenu = listMenu.find(item => item.id === userChoice);

  if (selectedMenu) {
    cart = [...cart, {
      id: selectedMenu.id,
      name: selectedMenu.name,
      price: selectedMenu.price
    }];
    console.log(`\n✓ Berhasil menambahkan [${selectedMenu.name}] ke keranjang.`);
    displayCart(cart);
    askMoreOrder();
  } else {
    console.log("\n Menu tidak valid / tidak ditemukan. Silakan pilih kembali.\n");
    retryMenuFunction();
  }
};



const askMoreOrder = () => {
  rl.question("Apakah ada pesanan lain? (y/n): ", (input) => {
    const answer = input.toLowerCase().trim();
    console.clear();

    const answerActions = {
      'y': () => {
        selectCategory();
      },
      'n': () => {
        completeCheckout();
      }
    };

    const action = answerActions[answer] ?? (() => {
      console.log(" Pilihan tidak valid. Ketik 'y' untuk ya atau 'n' untuk tidak.\n");
      askMoreOrder();
    });

    action();
  });
};

const completeCheckout = () => {
  if (cart.length === 0) {
    console.log("Keranjang belanja kosong. Terima kasih!");
    rl.close();
    return;
  }

  console.log("=====================================");
  console.log("          NOTA PEMBAYARAN            ");
  console.log("=====================================");

  cart.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name.padEnd(20)} : ${rupiahFormatter.format(item.price)}`);
  });

  console.log("-------------------------------------");

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  console.log(`TOTAL ITEM  : ${cart.length}`);
  console.log(`TOTAL BAYAR : ${rupiahFormatter.format(totalPrice)}`);
  console.log("=====================================\n");

  processPayment(totalPrice);
};

const processPayment = (totalPrice) => {
  rl.question("Masukkan jumlah uang tunai yang dibayarkan: Rp. ", (cashInput) => {
    const cashGiven = parseInt(cashInput.replace(/\D/g, ''));

    console.clear();

    if (isNaN(cashGiven)) {
      console.log(" Input uang tidak valid. Silakan masukkan angka saja.\n");
      return processPayment(totalPrice);
    }

    if (cashGiven < totalPrice) {
      const amountShortage = totalPrice - cashGiven;
      console.log(` Uang yang Anda masukkan kurang sebesar: ${rupiahFormatter.format(amountShortage)}`);
      console.log(`Total tagihan yang harus dibayar: ${rupiahFormatter.format(totalPrice)}\n`);
      return processPayment(totalPrice);
    }

    const changeAmount = cashGiven - totalPrice;

    console.log("=====================================");
    console.log("          STRUK PEMBAYARAN           ");
    console.log("              EMADOS                 ");
    console.log("=====================================");
    cart.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name.padEnd(20)} : ${rupiahFormatter.format(item.price)}`);
    });
    console.log("-------------------------------------");
    console.log(`TOTAL BELANJA : ${rupiahFormatter.format(totalPrice)}`);
    console.log(`TUNAI         : ${rupiahFormatter.format(cashGiven)}`);
    console.log(`KEMBALIAN     : ${rupiahFormatter.format(changeAmount)}`);
    console.log("=====================================");
    console.log("\nTERIMA KASIH ATAS KUNJUNGAN ANDA");
    console.log("Selamat menikmati hidangan!");

    rl.close();
  });
};

selectCategory();