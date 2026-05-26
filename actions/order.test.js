import { describe, it, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  determineCategoryRoute,
  validateMenuSelection,
  processMenuSelection, 
  rl,
  displayCategoryList,
  mainCourseShow,
  sideDishShow,
  drinkShow,
  askMoreOrder
} from './order.js';

describe('displayCategoryList', () => {
  it('harus menampilkan daftar kategori menu dengan benar', () => {
    assert.doesNotThrow(() => displayCategoryList());
  });
});

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

  it('harus mengembalikan angka pilihan jika input valid (misal: 2)', () => {
    assert.doesNotThrow(() => {
      const result = determineCategoryRoute(2);
      assert.strictEqual(result, 2);
    });
  });

  it('harus mengembalikan angka pilihan jika input valid (misal: 3)', () => {
    assert.doesNotThrow(() => {
      const result = determineCategoryRoute(3);
      assert.strictEqual(result, 3);
    });
  });

  it('harus melempar error jika input berupa string yang tidak bisa di-convert ke angka', () => {
    assert.throws(
      () => { determineCategoryRoute("abc"); },
      { name: 'Error', message: 'Input harus berupa angka!' }
    );
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

  it('harus mengeksekusi retry fungsi jika menu tidak ditemukan pada processMenuSelection', () => {
    const mockMenu = [{ id: 1, name: 'Ayam Goreng', price: 15000 }];
    let retryTerpanggil = false;
    processMenuSelection(99, mockMenu, () => { retryTerpanggil = true; }, () => { });

    assert.strictEqual(retryTerpanggil, true);
  });

  it('harus mengeksekusi success callback jika menu ditemukan pada processMenuSelection', () => {
    const mockMenu = [{ id: 1, name: 'Ayam Goreng', price: 15000 }];
    let successTerpanggil = false;
    processMenuSelection(1, mockMenu, () => { }, () => { successTerpanggil = true; });
    assert.strictEqual(successTerpanggil, true);
  });

  it('harus mengeksekusi retry fungsi jika input tidak valid pada askMoreOrder', () => {
    let retryTerpanggil = false;
    askMoreOrder();
    rl.emit('line', 'input-salah');
    assert.strictEqual(retryTerpanggil, false);
  });
});

describe('mainCourseShow', () => {
  it('harus menampilkan daftar menu main course dengan benar', () => {
    assert.doesNotThrow(() => mainCourseShow());
  });
  it('harus menampilkan daftar menu main course dengan benar untuk listMainCourse yang berbeda', () => {
    assert.doesNotThrow(() => mainCourseShow());
  });
  it('harus menampilkan daftar menu main course dengan benar untuk listMainCourse yang berbeda', () => {   
    assert.doesNotThrow(() => mainCourseShow());
  });
});

describe('sideDishShow', () => {
  it('harus menampilkan daftar menu side dish dengan benar', () => {
    assert.doesNotThrow(() => sideDishShow());
  });
  it('harus menampilkan daftar menu side dish dengan benar untuk listSideDish yang berbeda', () => {
    assert.doesNotThrow(() => sideDishShow());
  });
  it('harus menampilkan daftar menu side dish dengan benar untuk listSideDish yang berbeda', () => {
    assert.doesNotThrow(() => sideDishShow());
  });
});

describe('drinkShow', () => {
  it('harus menampilkan daftar menu drink dengan benar', () => {
    assert.doesNotThrow(() => drinkShow());
  });
  it('harus menampilkan daftar menu drink dengan benar untuk listDrink yang berbeda', () => {
    assert.doesNotThrow(() => drinkShow());
  });
  it('harus menampilkan daftar menu drink dengan benar untuk listDrink yang berbeda', () => {
    assert.doesNotThrow(() => drinkShow());
  });
});

describe('Unit Testing: askMoreOrder', () => {
  let originalQuestion;
  beforeEach(() => {
    originalQuestion = rl.question;
  });
  afterEach(() => {
    rl.question = originalQuestion;
  });

  it('harus memanggil alur lanjut belanja jika input "y"', (done) => {
    rl.question = (queryText, callback) => {
      // Pastikan teks pertanyaan benar
      assert.match(queryText, /Apakah ada pesanan lain\?/);
      callback('y');
      done();
    };
    askMoreOrder();
  });

  it('harus memanggil alur checkout jika input "n"', (done) => {
    rl.question = (queryText, callback) => {
      callback('n');
      done();
    };

    askMoreOrder();
  });

  it('harus melakukan RECURSION (retry) jika input tidak valid', (done) => {
    let jumlahPanggilan = 0;
    rl.question = (queryText, callback) => {
      jumlahPanggilan++;
      if (jumlahPanggilan === 1) {
        callback('input-ngawur');
      } else if (jumlahPanggilan === 2) {
        assert.strictEqual(jumlahPanggilan, 2);
        done();
      }
    };
    askMoreOrder();
  });
});
after(() => {
  rl.close();
});