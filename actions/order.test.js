import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import {
  determineCategoryRoute,
  validateMenuSelection,
  processMenuSelection, 
  rl
} from './order.js';

describe('determineCategoryRoute', () => {
  it('harus melempar error jika input bukan angka (NaN)', () => {
    assert.throws(
      () => { determineCategoryRoute(NaN); },
      { name: 'Error', message: 'Input harus berupa angka!' }
    );
  });

  it('harus melempar error jika pilihan angka di luar range 1-3', () => {
    assert.throws(
      () => { determineCategoryRoute(5); },
      { name: 'Error', message: 'Tidak ada pilihan tersebut!' }
    );
  });

  it('harus mengembalikan angka pilihan jika input valid (misal: 1)', () => {
    assert.doesNotThrow(() => {
      const result = determineCategoryRoute(1);
      assert.strictEqual(result, 1);
    });
  });
});

describe('validateMenuSelection', () => {
  const mockListMenu = [
    { id: 1, name: 'Nasi Goreng', price: 20000 },
    { id: 2, name: 'Mie Goreng', price: 18000 }
  ];

  it('harus melempar error jika ID menu tidak ditemukan di dalam list', () => {
    assert.throws(
      () => { validateMenuSelection(99, mockListMenu); },
      { name: 'Error', message: 'Menu tidak valid / tidak ditemukan. Silakan pilih kembali.' }
    );
  });

  it('harus mengembalikan objek data menu jika ID ditemukan', () => {
    assert.doesNotThrow(() => {
      const result = validateMenuSelection(1, mockListMenu);
      assert.strictEqual(result.name, 'Nasi Goreng');
      assert.strictEqual(result.price, 20000);
    });
  });
});

describe('Pengujian Flow Alur untuk Menaikkan Coverage', () => {

  it('harus sukses mengeksekusi processMenuSelection jika menu ditemukan', () => {
    const mockMenu = [{ id: 1, name: 'Ayam Goreng', price: 15000 }];
    let askMoreTerpanggil = false;
    processMenuSelection(1, mockMenu, () => { }, () => { askMoreTerpanggil = true; });
    assert.strictEqual(askMoreTerpanggil, true);
  });

  it('harus mengeksekusi retry fungsi jika menu tidak ditemukan pada processMenuSelection', () => {
    const mockMenu = [{ id: 1, name: 'Ayam Goreng', price: 15000 }];
    let retryTerpanggil = false;
    processMenuSelection(99, mockMenu, () => { retryTerpanggil = true; }, () => { });

    assert.strictEqual(retryTerpanggil, true);
  });
});

after(() => {
  rl.close();
});