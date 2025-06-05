const playlistContainer = document.getElementById("playlist-gallery");
const isFeaturedPage = window.location.pathname.includes("featured.html");

if (isFeaturedPage) {
  displayRandomFeaturedPlaylist();
}

if(!playlists|| playlists.length==0){
  playlistContainer.innerHTML="<p> no playlist added </p>";
}else{
playlists.forEach((playlist) => {
  const card = document.createElement("div");
  card.classList.add("playlist-tile");
  card.innerHTML = `
        <img src="${playlist.playlist_art}" alt="Playlist Cover" class="playlist-cover" />
        <h3>${playlist.playlist_name}</h3>
        <p class="author">${playlist.playlist_author}</p>
        <p class="likes">
          <span class="like-icon" role="button" title="Like this playlist">❤️</span>
          <span class="likes-count">${playlist.likes}</span>
       </p>
      `;

  const likeIcon = card.querySelector(".like-icon");
  const likeCount = card.querySelector(".likes-count");

  let liked = false;
  likeIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent modal from opening

    if (!liked) {
      playlist.likes++;
      liked = true;
      likeIcon.classList.add("liked");
    } else {
      playlist.likes--;
      liked = false;
      likeIcon.classList.remove("liked");
    }

    likeCount.textContent = playlist.likes;
  });

  // Add the card to the page
  card.addEventListener("click", () => openModal(playlist));
  playlistContainer.appendChild(card);
});
}

const modal = document.getElementById("playlist-modal");
const modalContent = document.getElementById("modal-content");

function openModal(playlist) {
  modalContent.innerHTML = `
  <img src="${
    playlist.playlist_art
  }" alt="Playlist Cover" style="width: 100%; border-radius: 10px;" />
  <h2>${playlist.playlist_name}</h2>
  <p><em>By ${playlist.playlist_author}</em></p>

  <button id="shuffle-button" class="shuffle-button"> Shuffle</button> <!-- This is the new button -->

  <ul class="song-list">
  ${playlist.songs
    .map(
      (song) => `
    <li class="song-item">
      <img src="${song.cover}" class="song-cover" />
      <div class="song-details">
        <strong>${song.title}</strong><br>
        ${song.artist}<br>
        <small>${song.duration}</small>
      </div>
    </li>
  `
    )
    .join("")}
  </ul>
`;

  document.getElementById("shuffle-button").addEventListener("click", () => {
    playlist.songs = shuffleArray(playlist.songs);
    openModal(playlist); // Refresh modal with new song order
  });

  modal.style.display = "flex";

  // ✅ SHUFFLE FUNCTIONALITY
  const shuffleButton = document.getElementById("shuffle-button");
  const songList = document.getElementById("song-list");

  shuffleButton.addEventListener("click", () => {
    const shuffled = [...playlist.songs].sort(() => Math.random() - 0.5);
    songList.innerHTML = shuffled
      .map(
        (song) => `
      <li>
        <strong>${song.title}</strong><br>
        ${song.artist}<br>
        <small>${song.duration}</small>
      </li>
    `
      )
      .join("");
  });
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// for my featured.html
if (document.getElementById("featured-container")) {
  fetch("data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const playlists = data;
      if (playlists.length === 0) return;

      // Pick a random playlist
      const random = playlists[Math.floor(Math.random() * playlists.length)];

      const container = document.getElementById("featured-container");
      container.innerHTML = `
        <div class="featured-layout">
          <div class="featured-image">
            <img src="${random.playlist_art}" alt="Playlist Cover" />
          </div>
          <div class="featured-details">
            <h2>${random.playlist_name}</h2>
            <p><em>By ${random.playlist_author}</em></p>
            <ul>
              ${random.songs
                .map(
                  (song) => `
                  <li>
                    <strong>${song.title}</strong><br />
                    ${song.artist}<br />
                    <small>${song.duration}</small>
                  </li>
                `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `;
    });
}

function displayRandomFeaturedPlaylist() {
  const randomIndex = Math.floor(Math.random() * playlists.length);
  const playlist = playlists[randomIndex];

  const playlistInfo = document.querySelector(".playlist-info");
  const songList = document.querySelector(".song-list");

  playlistInfo.innerHTML = `
    <img src="${playlist.playlist_art}" alt="Playlist Cover">
    <h2>${playlist.playlist_name}</h2>
    <p><em>By ${playlist.playlist_author}</em></p>
    `;

  songList.innerHTML = `
      
      <ul>
       ${playlist.songs
         .map(
           (song) => `
        <li class="song-item">
        <img src="${song.cover}" class="song-cover" />
        <div class="song-details">
        <strong>${song.title}</strong><br>
        ${song.artist}<br>
        <small>${song.duration}</small>
        </div>
         </li>
         `
         )
         .join("")}
        </ul>
         `;
}

if (
  document.querySelector(".playlist-info") &&
  document.querySelector(".song-list")
) {
  displayRandomFeaturedPlaylist();
}
