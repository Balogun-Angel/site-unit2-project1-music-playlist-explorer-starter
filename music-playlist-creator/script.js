const playlistContainer = document.getElementById("playlist-gallery");
const isFeaturedPage = window.location.pathname.includes("featured.html");

if (isFeaturedPage) {
  displayRandomFeaturedPlaylist();
}

fetch("data/data.json")
  .then((response) => response.json())
  .then((playlists) => {
    if (!playlists || playlists.length == 0) {
      playlistContainer.innerHTML = "<p> no playlist added </p>";
      return;
    }

    playlists.forEach((playlist) => {
      const card = document.createElement("div");
      card.classList.add("playlist-tile");

      card.innerHTML = `
      <div class="playlist-actions">
       <button class ="edit-btn title="Edit Playlist">✎</button>
       <button class="delete-btn title="Delete Playlist">🚮</button>
       </div>
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

      //this is the event listener for the modal
      card.addEventListener("click", () => openModal(playlist));
      //this is to keep adding the cards and not replacing them
      playlistContainer.appendChild(card);

      card.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const newName = prompt(
          "Enter new playlist name:",
          playlist.playlist_name
        );
        const newAuthor = prompt(
          "Enter new author name:",
          playlist.playlist_author
        );

        if (newName && newAuthor) {
          playlist.playlist_name = newName;
          playlist.playlist_author = newAuthor;

          card.querySelector("h3").textContent = newName;
          card.querySelector(".author").textContent = newAuthor;
        }
      });

      card.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const confirmDelete = confirm(
          "Are you sure you want to delete this playlist?"
        );
        if (confirmDelete) {
          card.remove();
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error loading playlists: ", error);
    playlistContainer.innerHTML = "<p>Failed to load playlists.<p>";
  });

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

  // SHUFFLE FUNCTIONALITY
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
    .then((res) => res.join())
    .then((data) => {
      const playlists = data;
      if (playlists.length === 0) return;

      const random = playlists[Math.floor(Math.random() * playlists.length)];
      const container = document.getElementById("featured-container");

      container.innerHTML = `
      <div class="featured-layout">
      <div class= "featured-image">
      <img src= "${random.playlist_art}" alt="Playlist Cover" />
      </div>
      <div class= "featured-details">
      <h2>${random.playlist_name}</h2>
      <p><em>By ${random.playlist_author}</em></p>
      <ul>
      ${random.songs
        .map(
          (song) => `
          <li>
          <strong>${song.title}</strong><br />
          ${song.artist}br />
          <small>${sessionStorage.duration}</small>
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
  fetch("data/data.json")
    .then((response) => response.json())
    .then((playlists) => {
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
    })
    .catch((error) => {
      console.log("Failed to load playlist", error);
    });
}

if (
  document.querySelector(".playlist-info") &&
  document.querySelector(".song-list")
) {
  displayRandomFeaturedPlaylist();
}
