const readerSelection = document.getElementById("reader-selection");
const suraSelection = document.getElementById("sura-selection");
const readerName = document.getElementById("reader-name");
const suraName = document.getElementById("sura-name");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.querySelector(".progress-fill");
const progressHandle = document.querySelector(".progress-handle");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

let allReaders = [];
let allSuras = [];
let serverReader = "";
let serverSurah = "";
let audioSrc = "";
let currentIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

const audio = new Audio();

// ------------------------------------------------
// Fetch Readers
async function getReaders() {
  try {
    const response = await fetch(
      "https://www.mp3quran.net/api/v3/reciters?language=ar"
    );
    const data = await response.json();
    allReaders = data.reciters;

    allReaders.forEach((reader, i) => {
      readerSelection.insertAdjacentHTML(
        "beforeend",
        `<option value="${reader.id},${reader.name},${i}">${reader.name}</option>`
      );
    });

    readerSelection.selectedIndex = 0;
    readerName.textContent = `القارئ/ ${allReaders[0].name}`;
    const moshaf = allReaders[0].moshaf.at(-1);
    serverReader = moshaf.server;
  } catch (err) {
    console.error("Reader Error:", err);
  }
}

// Fetch Suras
async function getAllSuras() {
  try {
    const response = await fetch(
      "https://mp3quran.net/api/v3/suwar?language=ar"
    );
    const data = await response.json();
    allSuras = data.suwar;

    allSuras.forEach((sura) => {
      suraSelection.insertAdjacentHTML(
        "beforeend",
        `<option value="${sura.id},${sura.name}">${sura.name}</option>`
      );
    });

    suraSelection.selectedIndex = 0;
    suraName.textContent = allSuras[0].name;
    serverSurah = String(allSuras[0].id).padStart(3, "0") + ".mp3";
  } catch (err) {
    console.error("Sura Error:", err);
  }
}

// ------------------------------------------------
// Update Audio Source
function updateAudioSrc() {
  if (serverReader && serverSurah) {
    audioSrc = serverReader.endsWith("/")
      ? serverReader + serverSurah
      : serverReader + "/" + serverSurah;
    audio.src = audioSrc;
    console.log("AudioSrc:", audioSrc);
  }
}

// Load Specific Sura
function loadSong(index) {
  const sura = allSuras[index];
  if (!sura) return;
  suraSelection.selectedIndex = index;
  suraName.textContent = sura.name;
  serverSurah = String(sura.id).padStart(3, "0") + ".mp3";
  updateAudioSrc();
}

// ------------------------------------------------
// Player Controls
function playSong() {
  if (!audio.src) return;
  isPlaying = true;
  audio.play();
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}
function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

function nextSong() {
  currentIndex = isShuffle
    ? Math.floor(Math.random() * allSuras.length)
    : (currentIndex + 1) % allSuras.length;
  loadSong(currentIndex);
  playSong();
}
function prevSong() {
  currentIndex = (currentIndex - 1 + allSuras.length) % allSuras.length;
  loadSong(currentIndex);
  playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "#4527A0" : "#BAA8ED";
});
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#4527A0" : "#BAA8ED";
});

audio.addEventListener("ended", () => {
  if (isRepeat) playSong();
  else nextSong();
});

// ------------------------------------------------
// Update Time + Progress
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const progress = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${progress}%`;
  progressHandle.style.left = `${progress}%`;

  // Update times
  const currentM = Math.floor(audio.currentTime / 60);
  const currentS = Math.floor(audio.currentTime % 60);
  const durationM = Math.floor(audio.duration / 60);
  const durationS = Math.floor(audio.duration % 60);
  currentTimeEl.textContent = `${String(currentM).padStart(2, "0")}:${String(
    currentS
  ).padStart(2, "0")}`;
  durationEl.textContent = `${String(durationM).padStart(2, "0")}:${String(
    durationS
  ).padStart(2, "0")}`;
});

progressBar.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const newTime = (clickX / width) * audio.duration;
  audio.currentTime = newTime;
});

// ------------------------------------------------
// Change Reader or Sura
readerSelection.addEventListener("change", () => {
  const [id, name, index] = readerSelection.value.split(",");
  readerName.textContent = `القارئ/ ${name}`;
  serverReader = allReaders[index].moshaf.at(-1).server;
  updateAudioSrc();
});
suraSelection.addEventListener("change", () => {
  const [id, name] = suraSelection.value.split(",");
  suraName.textContent = name;
  serverSurah = String(id).padStart(3, "0") + ".mp3";
  currentIndex = allSuras.findIndex((s) => s.id == id);
  updateAudioSrc();
});

// ------------------------------------------------
// Keyboard Space Play/Pause
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying ? pauseSong() : playSong();
  }
});

// ------------------------------------------------
// Start App
(async () => {
  await getReaders();
  await getAllSuras();
  loadSong(currentIndex);
})();
