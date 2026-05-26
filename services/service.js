import {rl} from '../actions/order.js';
import {rupiahFormatter} from '../utils/formatCurrency.js';

/**
 * Service untuk memproses checkout, menghitung pembayaran, dan menampilkan struk.
 * @module services/service
 */
export const completeCheckout = (cart) => {
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

  processPayment(totalPrice, cart);
};

/**
 * Menghitung pembayaran berdasarkan input uang tunai dan total harga, serta menangani validasi input dan kekurangan pembayaran.
 * @param {string} cashInput - Input uang tunai yang diberikan oleh user.
 * @param {number} totalPrice - Total harga yang harus dibayar.
 * @return {Object} Objek yang berisi cashGiven dan changeAmount jika pembayaran berhasil.
 * @throws {Error} Jika input uang tidak valid atau jika uang yang diberikan kurang dari total harga.
 */
export const calculatePayment = (cashInput, totalPrice) => {
  const cashGiven = parseInt(cashInput.replace(/\D/g, ''));
  if (isNaN(cashGiven)) {
    throw new Error("Input uang tidak valid. Silakan masukkan angka saja.");
  }
  if (cashGiven < totalPrice) {
    const amountShortage = totalPrice - cashGiven;
    const errorShortage = new Error("Uang kurang");
    errorShortage.shortage = amountShortage;
    throw errorShortage;
  }
  return {
    cashGiven,
    changeAmount: cashGiven - totalPrice
  };
};

/**
 * Memproses pembayaran, menampilkan struk, dan menangani kasus kekurangan pembayaran dengan retry.
 * @param {number} totalPrice - Total harga yang harus dibayar.
 * @param {CartItem[]} cart - Daftar item yang ada di keranjang belanja.  
 * @return {void}
 */
const processPayment = (totalPrice, cart) => {
  rl.question("Masukkan jumlah uang tunai yang dibayarkan: Rp. ", (cashInput) => {
   
    console.clear();

    try {
      const { cashGiven, changeAmount } = calculatePayment(cashInput, totalPrice);
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
    } catch (error) {
      if (error.message === "Uang kurang") {
        console.log(` Uang yang Anda masukkan kurang sebesar: ${rupiahFormatter.format(error.shortage)}`);
        console.log(`Total tagihan yang harus dibayar: ${rupiahFormatter.format(totalPrice)}\n`);
      } else {
        console.log(` ${error.message}\n`);
      }
      return processPayment(totalPrice, cart);
    }
  });
};