import {rupiahFormatter} from './formatCurrency.js';

/**
 * Utility untuk menampilkan isi keranjang belanja dan ringkasan pembelian.
 * @module utils/display
 */
export const displayCart = (cart) => {
  console.log("\n--- Isi Keranjang Saat Ini ---");
  if (cart.length === 0) {
    console.log("(Keranjang masih kosong)");
  } else {
    displayCartSummary(cart);
  }
  console.log("-------------------------------\n");
};

/**
 * Menampilkan ringkasan isi keranjang belanja dengan format yang rapi.
 * @param {CartItem[]} cart - Daftar item yang ada di keranjang belanja.
 * @return {void}
 */
export const displayCartSummary = (cart) => {
  cart.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} (${rupiahFormatter.format(item.price)})`);
  });
};