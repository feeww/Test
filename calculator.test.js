const { add, subtract, multiply, divide } = require('./calculator');

test('додає 2 + 3 і очікує результат 5', () => {
  expect(add(2, 3)).toBe(5);
});

test('віднімає 5 - 2 і очікує результат 3', () => {
  expect(subtract(5, 2)).toBe(3);
});

test('множить 4 * 3 і очікує результат 12', () => {
  expect(multiply(4, 3)).toBe(12);
});

test('ділить 10 / 2 і очікує результат 5', () => {
  expect(divide(10, 2)).toBe(5);
});

test('повертає помилку при діленні на нуль', () => {
  expect(divide(10, 0)).toBe("Error: Division by zero");
});