import {rl} from '../actions/order.js';
import {rupiahFormatter} from '../utils/formatCurrency.js';

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

  processPayment(totalPrice);
};

const processPayment = (totalPrice, cart) => {
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