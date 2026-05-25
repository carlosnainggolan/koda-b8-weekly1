import { describe, it } from "node:test";
import assert from "node:assert";
import {displayCart} from "./display.js";

describe("displayCart", () => {
  it("should display the cart contents correctly", () => {
    const cart = [
      { name: "Nasi Goreng", price: 15000 },
      { name: "Es Teh", price: 5000 }
    ];
    assert.doesNotThrow(() => displayCart(cart));
  });

  it("should display a message when the cart is empty", () => {
    const cart = [];
    assert.doesNotThrow(() => displayCart(cart));
  }); 

  it("should display the cart summary correctly", () => {
    const cart = [
      { name: "Nasi Goreng", price: 15000 },
      { name: "Es Teh", price: 5000 }
    ];
    assert.doesNotThrow(() => displayCart(cart));
  });

  it("should handle a cart with multiple items correctly", () => {
    const cart = [
      { name: "Nasi Goreng", price: 15000 },
      { name: "Es Teh", price: 5000 },
      { name: "Ayam Goreng", price: 20000 }
    ];
    assert.doesNotThrow(() => displayCart(cart));
  });

  it("should handle a cart with a single item correctly", () => {
    const cart = [
      { name: "Nasi Goreng", price: 15000 }
    ];
    assert.doesNotThrow(() => displayCart(cart));
  });

});

