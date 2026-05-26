/**
 * Konfigurasi menu makanan dan minuman yang tersedia di restoran.
 * @module config/menu
 */
export const foodCategory = [
  { id: 1, category: "Main Course" },
  { id: 2, category: "Side Dish" },
  { id: 3, category: "Drink" }
];

/** Daftar menu main course yang tersedia.
 * @type {Array<{id: number, name: string, price: number}>}
 */
export const listMainCourse = [
  { id: 1, name: "1/4 Ayam Nasi", price: 39150 },
  { id: 2, name: "1 Ekor Ayam Nasi", price: 189599 },
  { id: 3, name: "Sultan Ayam", price: 320700 },
  { id: 4, name: "Sultan Lamb", price: 476000 },
  { id: 5, name: "Personal lamb", price: 97920 }
];

/** Daftar menu side dish yang tersedia.
 * @type {Array<{id: number, name: string, price: number}>}
 */
export const listSideDish = [
  { id: 1, name: "Shawarma Chicken", price: 33000 },
  { id: 2, name: "Shawarma Peri Peri", price: 33000 },
  { id: 3, name: "Samosa Beef", price: 39000 },
  { id: 4, name: "Samosa Cheese", price: 39000 },
  { id: 5, name: "Pisang Kunafa", price: 46500 }
];

/** Daftar menu drink yang tersedia.
 * @type {Array<{id: number, name: string, price: number}>}
 */
export const listDrink = [
  { id: 1, name: "Mineral Water", price: 13200 },
  { id: 2, name: "Lemon tea", price: 19800 },
  { id: 3, name: "Lemonade", price: 19800 },
  { id: 4, name: "Teh Tawar", price: 9600 },
  { id: 5, name: "Karak tea", price: 26500 }
];

/** Pertanyaan untuk memilih kategori menu. */
export const categoryQuestion = "Mau pesan nomor berapa? ";
export const mainCourseQuestion = "Mau main course apa? ";
export const sideDishQuestion = "Mau side dish apa? ";
export const drinkQuestion = "Mau drink apa? ";