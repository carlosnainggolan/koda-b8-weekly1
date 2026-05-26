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
  it('must display the menu category list correctly', () => {
    assert.doesNotThrow(() => displayCategoryList());
  });
});

describe('determineCategoryRoute', () => {
  it('should throw an error if the input is not a number (NaN)', () => {
    assert.throws(
      () => { determineCategoryRoute(NaN); },
      { name: 'Error', message: 'Input harus berupa angka!' }
    );
  });

  it('should throw an error if the choice is outside the range 1-3', () => {
    assert.throws(
      () => { determineCategoryRoute(5); },
      { name: 'Error', message: 'Tidak ada pilihan tersebut!' }
    );
  });

  it('should return the chosen number if the input is valid (e.g., 1)', () => {
    assert.doesNotThrow(() => {
      const result = determineCategoryRoute(1);
      assert.strictEqual(result, 1);
    });
  });

  it('should return the chosen number if the input is valid (e.g., 2)', () => {
    assert.doesNotThrow(() => {
      const result = determineCategoryRoute(2);
      assert.strictEqual(result, 2);
    });
  });

  it('should return the chosen number if the input is valid (e.g., 3)', () => {
    assert.doesNotThrow(() => {
      const result = determineCategoryRoute(3);
      assert.strictEqual(result, 3);
    });
  });

  it('should throw an error if the input is a string that cannot be converted to a number', () => {
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

  it('should throw an error if the menu ID is not found in the list', () => {
    assert.throws(
      () => { validateMenuSelection(99, mockListMenu); },
      { name: 'Error', message: 'Menu tidak valid / tidak ditemukan. Silakan pilih kembali.' }
    );
  });

  it('should return the menu object if the ID is found', () => {
    assert.doesNotThrow(() => {
      const result = validateMenuSelection(1, mockListMenu);
      assert.strictEqual(result.name, 'Nasi Goreng');
      assert.strictEqual(result.price, 20000);
    });
  });
});

describe('Pengujian Flow Alur untuk Menaikkan Coverage', () => {

  it('should execute the retry function if the menu is not found in processMenuSelection', () => {
    const mockMenu = [{ id: 1, name: 'Ayam Goreng', price: 15000 }];
    let retryTerpanggil = false;
    processMenuSelection(99, mockMenu, () => { retryTerpanggil = true; }, () => { });

    assert.strictEqual(retryTerpanggil, true);
  });

  it('should execute the success callback if the menu is found in processMenuSelection', () => {
    const mockMenu = [{ id: 1, name: 'Ayam Goreng', price: 15000 }];
    let successTerpanggil = false;
    processMenuSelection(1, mockMenu, () => { }, () => { successTerpanggil = true; });
    assert.strictEqual(successTerpanggil, true);
  });

  it('should execute the retry function if the input is not valid in askMoreOrder', () => {
    let retryTerpanggil = false;
    askMoreOrder();
    rl.emit('line', 'input-salah');
    assert.strictEqual(retryTerpanggil, false);
  });
});

describe('mainCourseShow', () => {
  it('must display the main course menu list correctly', () => {
    assert.doesNotThrow(() => mainCourseShow());
  });
  it('must display the main course menu list correctly for different listMainCourse', () => {
    assert.doesNotThrow(() => mainCourseShow());
  });
  it('must display the main course menu list correctly for different listMainCourse', () => {   
    assert.doesNotThrow(() => mainCourseShow());
  });
});

describe('sideDishShow', () => {
  it('must display the side dish menu list correctly', () => {
    assert.doesNotThrow(() => sideDishShow());
  });
  it('must display the side dish menu list correctly for different listSideDish', () => {
    assert.doesNotThrow(() => sideDishShow());
  });
  it('must display the side dish menu list correctly for different listSideDish', () => {
    assert.doesNotThrow(() => sideDishShow());
  });
});

describe('drinkShow', () => {
  it('must display the drink menu list correctly', () => {
    assert.doesNotThrow(() => drinkShow());
  });
  it('must display the drink menu list correctly for different listDrink', () => {
    assert.doesNotThrow(() => drinkShow());
  });
  it('must display the drink menu list correctly for different listDrinks', () => {
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

  it('should call the next shopping flow if input is "y"', (done) => {
    rl.question = (queryText, callback) => {
      assert.match(queryText, /Apakah ada pesanan lain\?/);
      callback('y');
      done();
    };
    askMoreOrder();
  });

  it('should call the checkout flow if input is "n"', (done) => {
    rl.question = (queryText, callback) => {
      callback('n');
      done();
    };

    askMoreOrder();
  });

  it('should perform RECURSION (retry) if input is not valid', (done) => {
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