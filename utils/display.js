import {rupiahFormatter} from './formatCurrency.js';

export const displayCart = (cart) => {
  console.log("\n--- Isi Keranjang Saat Ini ---");
  if (cart.length === 0) {
    console.log("(Keranjang masih kosong)");
  } else {
    displayCartSummary(cart);
  }
  console.log("-------------------------------\n");
};

export const displayCartSummary = (cart) => {
  cart.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} (${rupiahFormatter.format(item.price)})`);
  });
};