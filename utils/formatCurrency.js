/**
 * Formatter untuk mengubah angka menjadi format mata uang Rupiah.
 * @module utils/formatCurrency
 */
export const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
});