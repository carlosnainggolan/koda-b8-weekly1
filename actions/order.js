/**
 * @typedef {Object} MenuItem
 * @property {number} id
 * @property {string} name
 * @property {number} price
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {string} name
 * @property {number} price
 */

import {
  foodCategory,
  listMainCourse,
  listSideDish,
  listDrink,
  categoryQuestion,
  mainCourseQuestion,
  sideDishQuestion,
  drinkQuestion
} from '../config/menu.js';
import { displayCart } from '../utils/display.js'; 
import { rupiahFormatter } from '../utils/formatCurrency.js';
import { createInterface } from 'readline';
import process from 'process'
import { completeCheckout } from '../services/service.js';

/**
 * Keranjang belanja sementara.
 * @type {CartItem[]}
 */
export let cart = [];

/**
 * Interface readline untuk menerima input user.
 * @type {import('readline').Interface}
 */
export const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Menanyakan pertanyaan ke user dan mengembalikan jawabannya.
 * @param {string} questionText - Teks pertanyaan yang akan ditampilkan.
 * @returns {Promise<string>}
 */
export const askQuestion = (questionText) => {
  return new Promise((resolve) => {
    rl.question(questionText, (answer) => {
      resolve(answer);
    });
  });
};

/**
 * Menentukan rute kategori berdasarkan pilihan user.
 * @param {number} choice - Pilihan kategori dari user.
 * @returns {number} Nilai yang valid jika pilihan benar.
 * @throws {Error} Jika input bukan angka atau di luar rentang 1-3.
 */
export const determineCategoryRoute = (choice) => {
  if (isNaN(choice)) {
    throw new Error("Input harus berupa angka!");
  }
  if (choice < 1 || choice > 3) {
    throw new Error("Tidak ada pilihan tersebut!");
  }
  return choice;
};

/**
 * Menampilkan daftar kategori menu ke console.
 * @returns {void}
 */
export const displayCategoryList = () => {
  console.log("--- PILIH KATEGORI MENU ---");
  for (let i = 0; i < foodCategory.length; i++) {
    const categoryName = foodCategory[i].category;
    const idCategory = foodCategory[i].id;
    console.log(`${idCategory}. ${categoryName}`);
  }
};

/**
 * Memulai proses pemilihan kategori dan meneruskan ke menu terkait.
 * @param {Function} [altMainCourse=mainCourse] - Fungsi alternatif untuk menu main course.
 * @param {Function} [altSideDish=sideDish] - Fungsi alternatif untuk menu side dish.
 * @param {Function} [altDrink=drink] - Fungsi alternatif untuk menu drink.
 * @returns {Promise<void>}
 */
export const selectCategory = async (
  altMainCourse = mainCourse,
  altSideDish = sideDish,
  altDrink = drink
) => {
  displayCategoryList();
  const answer = await askQuestion(categoryQuestion);
  const categoryChoice = parseInt(answer);
  console.clear();

  try {
    const route = determineCategoryRoute(categoryChoice);
    if (route === 1) await altMainCourse();
    if (route === 2) await altSideDish();
    if (route === 3) await altDrink();
  } catch (error) {
    console.log(`${error.message}\n`);
    if (process.env.NODE_ENV !== 'test') {
      selectCategory();
    } else {
      throw error; 
    }
  }
};

/**
 * Menampilkan daftar main course ke console.
 * @returns {void}
 */
export const mainCourseShow = () => {
  for (let i = 0; i < listMainCourse.length; i++) {
    const idMainCourse = listMainCourse[i].id;
    const mainCourseName = listMainCourse[i].name;
    const mainCoursePrice = rupiahFormatter.format(listMainCourse[i].price);
    console.log(`${idMainCourse}. ${mainCourseName} : ${mainCoursePrice}`);
  }
};

/**
 * Menangani alur pemilihan main course.
 * @returns {Promise<void>}
 */
export const mainCourse = async () => {
  console.log("--- MENU MAIN COURSE ---");
  mainCourseShow();
  const answerMainCourse = await askQuestion(mainCourseQuestion);
  const mainCourseChoice = parseInt(answerMainCourse);
  console.clear();
  processMenuSelection(mainCourseChoice, listMainCourse, mainCourse);
};

/**
 * Menampilkan daftar side dish ke console.
 * @returns {void}
 */
export const sideDishShow = () => {
  for (let i = 0; i < listSideDish.length; i++) {
    const idSideDish = listSideDish[i].id;
    const sideDishName = listSideDish[i].name;
    const sideDishPrice = rupiahFormatter.format(listSideDish[i].price);
    console.log(`${idSideDish}. ${sideDishName} : ${sideDishPrice}`);
  }
};

/**
 * Menangani alur pemilihan side dish.
 * @returns {Promise<void>}
 */
export const sideDish = async () => {
  console.log("--- MENU SIDE DISH ---");
  sideDishShow();
  const answerSideDish = await askQuestion(sideDishQuestion);
  const sideDishChoice = parseInt(answerSideDish);
  console.clear();
  processMenuSelection(sideDishChoice, listSideDish, sideDish);
};

/**
 * Menampilkan daftar drink ke console.
 * @returns {void}
 */
export const drinkShow = () => {
  for (let i = 0; i < listDrink.length; i++) {
    const idDrink = listDrink[i].id;
    const drinkName = listDrink[i].name;
    const drinkPrice = rupiahFormatter.format(listDrink[i].price);
    console.log(`${idDrink}. ${drinkName} : ${drinkPrice}`);
  }
};

/**
 * Menangani alur pemilihan drink.
 * @returns {Promise<void>} 
 * @throws {Error} Jika input tidak valid, akan memanggil ulang fungsi drink untuk retry.
 * @description Fungsi ini akan menampilkan menu drink, meminta input user, dan memproses pilihan. Jika input tidak valid, akan menampilkan pesan error dan memanggil ulang fungsi untuk retry.
 */
export const drink = async () => {
  console.log("--- MENU DRINK ---");
  drinkShow();
  const answerDrink = await askQuestion(drinkQuestion);
  const drinkChoice = parseInt(answerDrink);
  console.clear();
  processMenuSelection(drinkChoice, listDrink, drink);
};

/**
 * Menampilkan nota pembayaran dan memulai proses pembayaran.
 * @param {CartItem[]} cart - Daftar item yang ada di keranjang belanja.
 * @return {void}
 */
export const validateMenuSelection = (userChoice, listMenu) => {
  const selectedMenu = listMenu.find(item => item.id === userChoice);
  if (!selectedMenu) {
    throw new Error("Menu tidak valid / tidak ditemukan. Silakan pilih kembali.");
  }
  return selectedMenu;
};

/**
 * Memproses pemilihan menu oleh user, menambahkan ke keranjang, dan menampilkan cart.
 * @param {number} userChoice - ID menu yang dipilih oleh user.
 * @param {MenuItem[]} listMenu - Daftar menu yang tersedia untuk dipilih.
 * @param {Function} retryMenuFunction - Fungsi yang akan dipanggil jika pilihan menu tidak valid untuk retry.
 * @return {void}
 */
export const processMenuSelection = (userChoice, listMenu, retryMenuFunction) => {
  try {
    const selectedMenu = validateMenuSelection(userChoice, listMenu);
    cart = [...cart, {
      id: selectedMenu.id,
      name: selectedMenu.name,
      price: selectedMenu.price
    }];
    console.log(`\n Berhasil menambahkan [${selectedMenu.name}] ke keranjang.`);
    displayCart(cart);
    askMoreOrder();
  } catch (error) {
    console.log(`\n${error.message}\n`);
    retryMenuFunction();
  }
};

/** Menanyakan apakah user ingin memesan lagi dan mengarahkan sesuai jawaban.
 * @return {void}
 */
export const askMoreOrder = () => {
  rl.question("Apakah ada pesanan lain? (y/n): ", (input) => {
    const answer = input.toLowerCase().trim();
    console.clear();
    const answerActions = {
      'y': () => {
        selectCategory();
      },
      'n': () => {
        completeCheckout(cart);
      }
    };

    const action = answerActions[answer] ?? (() => {
      console.log(" Pilihan tidak valid. Ketik 'y' untuk ya atau 'n' untuk tidak.\n");
      askMoreOrder();
    });
    action();
  });
};