// Egypt Governments
const egyGov = [
  {
    serial: 1,
    nameAr: 'القاهرة',
    code: 'Cairo',
  },
  {
    serial: 2,
    nameAr: 'الإسكندرية',
    code: 'Alexandria',
  },
  {
    serial: 3,
    nameAr: 'الغربية',
    code: 'Tanta',
  },
  {
    serial: 4,
    nameAr: 'البحيرة',
    code: 'Beheira',
  },
  {
    serial: 5,
    nameAr: 'الدقهلية',
    code: 'Dakahlia',
  },
  {
    serial: 6,
    nameAr: 'الشرقية',
    code: 'Al Sharqia',
  },
  {
    serial: 7,
    nameAr: 'القليوبية',
    code: 'Qalyubia',
  },
  {
    serial: 8,
    nameAr: 'أسوان',
    code: 'Aswan',
  },
  {
    serial: 9,
    nameAr: 'الجيزة',
    code: 'Giza',
  },
  {
    serial: 10,
    nameAr: 'سوهاج',
    code: 'Sohag',
  },
  {
    serial: 11,
    nameAr: 'الفيوم',
    code: 'Faiyum',
  },
  {
    serial: 12,
    nameAr: 'المنوفية',
    code: 'Monufia',
  },
  {
    serial: 13,
    nameAr: 'أسيوط',
    code: 'Asyut',
  },
  {
    serial: 14,
    nameAr: 'الأقصر',
    code: 'Luxor',
  },
  {
    serial: 15,
    nameAr: 'قنا',
    code: 'Qena',
  },
  {
    serial: 16,
    nameAr: 'البحر الأحمر',
    code: 'alBahralAhmar',
  },
  {
    serial: 17,
    nameAr: 'بني سويف',
    code: 'BeniSuef',
  },
  {
    serial: 18,
    nameAr: 'دمياط',
    code: 'Domiat',
  },
  {
    serial: 19,
    nameAr: 'الإسماعيلية',
    code: 'Ismailia',
  },
  {
    serial: 20,
    nameAr: 'جنوب سيناء',
    code: 'SouthSinai',
  },
  {
    serial: 21,
    nameAr: 'كفر الشيخ',
    code: 'Kafrel-Sheikh',
  },
  {
    serial: 22,
    nameAr: 'المنيا',
    code: 'Minya',
  },
  {
    serial: 23,
    nameAr: 'مطروح',
    code: 'Matrouh',
  },
  {
    serial: 24,
    nameAr: 'بورسعيد',
    code: 'Port Said',
  },
  {
    serial: 25,
    nameAr: 'السويس',
    code: 'Suez',
  },
  {
    serial: 26,
    nameAr: 'شمال سيناء',
    code: 'NorthSinai',
  },
  {
    serial: 27,
    nameAr: 'الوادي الجديد',
    code: 'NewValley',
  },
];

// DOM Variables
const cityOptions = document.getElementById('city');
const fajr = document.getElementById('fajr');
const sunrise = document.getElementById('sunrise');
const dhuhr = document.getElementById('dhuhr');
const asr = document.getElementById('asr');
const maghrib = document.getElementById('maghrib');
const isha = document.getElementById('isha');
const nextPrayName = document.getElementById('nextPrayName');
const selectCity = document.getElementById('selectCity');

// Filling Governments
cityOptions.innerHTML = '';
for (let i = 0; i < egyGov.length; i++) {
  cityOptions.innerHTML += `<option value="${egyGov[i].code}" data-code="${egyGov[i].nameAr}">${egyGov[i].nameAr}</option>`;
}

// Start Api Fetch
async function getData(city) {
  let url = `https://api.aladhan.com/v1/timingsByAddress?address=${city},EG`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const result = await response.json();
    const timings = result.data.timings;
    fajr.textContent = timings.Fajr;
    sunrise.textContent = timings.Sunrise;
    dhuhr.textContent = timings.Dhuhr;
    asr.textContent = timings.Asr;
    maghrib.textContent = timings.Maghrib;
    isha.textContent = timings.Isha;
    let dateHigri =
      result.data.date.hijri.day +
      ' ' +
      result.data.date.hijri.month.ar +
      ' ' +
      result.data.date.hijri.year;
    document.getElementById('date-hijri').textContent = dateHigri;
  } catch (error) {
    console.error(error.message);
  }
}
async function nextPray(city) {
  let url = `https://api.aladhan.com/v1/nextPrayerByAddress?address=${city},EG`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const result = await response.json();
    const timings = result.data.timings;
    console.log(result);
    switch (Object.keys(timings)[0]) {
      case 'Fajr':
        nextPrayName.textContent = 'الفجر';
        break;
      case 'Dhuhr':
        nextPrayName.textContent = 'الظهر';
        break;
      case 'Asr':
        nextPrayName.textContent = 'العصر';
        break;
      case 'Maghrib':
        nextPrayName.textContent = 'المغرب';
        break;
      case 'Isha':
        nextPrayName.textContent = 'العشاء';
        break;
    }
    function countDown() {
      let refTime = `${result.data.date.gregorian.year}-${
        result.data.date.gregorian.month.number
      }-${result.data.date.gregorian.day}T${Object.values(timings)[0]}`;
      const nextPrayTime = new Date(refTime).getTime();
      const now = new Date().getTime();
      let distance = nextPrayTime - now;
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById('nextPrayCountDown').textContent = `${String(
        hours
      ).padStart(2, 0)}:${String(minutes).padStart(2, 0)}:${String(
        seconds
      ).padStart(2, 0)}`;
    }
    const intervalCount = setInterval(countDown, 1000);
    cityOptions.addEventListener('change', () => {
      clearInterval(intervalCount);
    });
  } catch (error) {
    console.error(error.message);
  }
}

// Start Event Listeners
cityOptions.addEventListener('change', () => {
  const newCity = cityOptions.value;
  selectCity.textContent =
    cityOptions.options[cityOptions.selectedIndex].dataset.code;
  document.getElementById('cityHeader').textContent =
    cityOptions.options[cityOptions.selectedIndex].dataset.code;
  getData(newCity);
  nextPray(newCity);
});
window.addEventListener('load', () => {
  getData('Cairo');
  nextPray('Cairo');
});

// Time Update
setInterval(() => {
  const timeNow = new Date();
  const hours = timeNow.getHours();
  const minutes = timeNow.getMinutes();
  const seconds = timeNow.getSeconds();
  document.getElementById('timeNow').textContent = `${String(hours).padStart(
    2,
    0
  )}:${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)} ${
    hours >= 0 && hours < 12 ? 'ص' : 'م'
  }`;
  document.getElementById('timeNowForNextPray').textContent = `${String(
    hours
  ).padStart(2, 0)}:${String(minutes).padStart(2, 0)}:${String(
    seconds
  ).padStart(2, 0)} ${hours >= 0 && hours < 12 ? 'ص' : 'م'}`;
}, 1000);
