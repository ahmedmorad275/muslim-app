const resetCount = document.getElementById('reset-count');
const countElemnets = document.getElementsByClassName('countTasbeeh');
const resetElemnets = document.getElementsByClassName('reset-current');

// Reset All Counters
resetCount.addEventListener('click', () => {
  for (let ele of countElemnets) {
    ele.textContent = '0';
    counter = 0;
  }
});
// Increase Counter
for (let ele of countElemnets) {
  let counter = 0;
  ele.closest('div').addEventListener('click', () => {
    if (ele.textContent === '0') {
      counter = 0;
    }
    counter++;
    ele.textContent = counter;
  });
}
// Reset Only Clicked Counter
for (let ele of resetElemnets) {
  ele.addEventListener('click', () => {
    const targetedP = ele.parentElement.children[2].children[0];
    targetedP.textContent = '0';
  });
}
