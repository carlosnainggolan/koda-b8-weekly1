import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import process from 'node:process';
import { completeCheckout } from './service.js';
import { rl } from '../actions/order.js';
import { calculatePayment } from './service.js';

describe('Unit Test Lengkap calculatePayment', () => {
  it('harus mengembalikan cashGiven dan changeAmount yang benar untuk input valid', () => {
    const result = calculatePayment('25000', 20000);
    assert.strictEqual(result.cashGiven, 25000);
    assert.strictEqual(result.changeAmount, 5000);
  });

  it('harus melempar error jika input uang tidak valid (bukan angka)', () => {
    assert.throws(
      () => calculatePayment('uang-salah', 20000),
      { name: 'Error', message: 'Input uang tidak valid. Silakan masukkan angka saja.' }
    );
  });
  
});

describe('Unit Test Lengkap service.js (Tanpa Mengubah Kode Asli)', () => {

  it('harus mengeksekusi alur completeCheckout jika keranjang kosong', () => {
    const originalClose = rl.close;
    let closeTerpanggil = false;
    rl.close = () => {
      closeTerpanggil = true;
    };
    completeCheckout([]);
    rl.close = originalClose;
    assert.strictEqual(closeTerpanggil, true, 'rl.close harus terpanggil jika cart kosong');
  });

  it('harus mengeksekusi cetak nota dan struk sukses jika uang pas/lebih', () => {
    const mockCart = [{ id: 1, name: 'Nasi Goreng', price: 20000 }];
    const originalQuestion = rl.question;
    const originalClose = rl.close;
    let closeTerpanggil = false;
    rl.question = (query, callback) => {
      callback('25000');
    };
    rl.close = () => {
      closeTerpanggil = true;
    };
    completeCheckout(mockCart);
    rl.question = originalQuestion;
    rl.close = originalClose;
    assert.strictEqual(closeTerpanggil, true, 'Alur struk harus selesai sampai rl.close()');
  });

  it('harus mengeksekusi catch block input validasi jika uang dimasukkan bukan angka', () => {
    const mockCart = [{ id: 1, name: 'Nasi Goreng', price: 20000 }];
    const originalQuestion = rl.question;
    let giliran = 0;
    rl.question = (query, callback) => {
      giliran++;
      if (giliran === 1) {
        callback('uang-salah');
      } else {
        callback('20000');
      } 
    }; 
    completeCheckout(mockCart);
    rl.question = originalQuestion;
    assert.strictEqual(giliran, 2, 'Harus memicu rekursif kembali ke processPayment saat input salah');
  }); 

  it('harus mengeksekusi catch block ketika jumlah uang tunai kurang', () => {
    const mockCart = [{ id: 1, name: 'Nasi Goreng', price: 20000 }];
    const originalQuestion = rl.question;
    let giliran = 0;
    rl.question = (query, callback) => {
      giliran++;
      if (giliran === 1) {
        callback('10000');
      } else {
        callback('20000');
      }
    };

    completeCheckout(mockCart);
    rl.question = originalQuestion;
    assert.strictEqual(giliran, 2, 'Harus memicu rekursif kembali ke processPayment saat uang kurang');
  });

});

after(() => {
  rl.close();
  setTimeout(() => {
    process.exit(0);
  }, 100);
});