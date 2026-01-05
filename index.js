const p1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log(1);
    resolve();
  }, 2000);
});

console.log(2);

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log(3);
    resolve();
  }, 1000);
});

Promise.all([p1, p2]).then(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(4);
      resolve();
    }, 3000);
  });
}).then(() => {
  console.log(5);
});
