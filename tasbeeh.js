const resetCount = document.getElementById('reset-count');
const countElemnets = document.getElementsByClassName('countTasbeeh');
const resetElemnets = document.getElementsByClassName('reset-current');

for (let ele of countElemnets) {
  ele.textContent = localStorage.getItem(`${ele.dataset.name}`) || '0';
}
// Reset All Counters
resetCount.addEventListener('click', () => {
  for (let ele of countElemnets) {
    ele.textContent = '0';
    counter = 0;
    localStorage.removeItem(`${ele.dataset.name}`);
  }
});
// Increase Counter
for (let ele of countElemnets) {
  let counter = 0;
  ele.closest('div').addEventListener('click', () => {
    if (
      ele.textContent === '0' &&
      localStorage.getItem(`${ele.dataset.name}`) === null
    ) {
      counter = 0;
    } else {
      counter = localStorage.getItem(`${ele.dataset.name}`);
    }
    counter++;
    navigator.vibrate(50);
    ele.textContent = counter;
    localStorage.setItem(`${ele.dataset.name}`, `${ele.textContent}`);
  });
}
// Reset Only Clicked Counter
for (let ele of resetElemnets) {
  ele.addEventListener('click', () => {
    const targetedP = ele.parentElement.children[2].children[0];
    targetedP.textContent = '0';
    localStorage.removeItem(`${targetedP.dataset.name}`);
  });
}
