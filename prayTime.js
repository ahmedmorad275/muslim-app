setInterval(() => {
  const timeNow = new Date();
  const hours = timeNow.getHours();
  const minutes = timeNow.getMinutes();
  const seconds = timeNow.getSeconds();
  document.getElementById(
    'timeNow'
  ).textContent = `${hours}:${minutes}:${seconds} ${
    hours >= 0 && hours < 12 ? 'ص' : 'م'
  }`;
  document.getElementById(
    'timeNowForNextPray'
  ).textContent = `${hours}:${minutes}:${seconds} ${
    hours >= 0 && hours < 12 ? 'ص' : 'م'
  }`;
}, 1000);
