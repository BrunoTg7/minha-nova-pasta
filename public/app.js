const videos = [
  {
    nome: "Deadpool & Wolverine",
    url: "https://minha-nova-pasta.vercel.app/343rt342wtg34wetg34retg4rghy5rh/FHD4/tt6263850.mp4",
  },
  {
    nome: "Venom: A Última Rodada",
    url: "/video1/343rt342wtg34wetg34retg4rghy5rh/FHD4/tt16366836.mp4",
  },
  {
    nome: "DivertidaMente 2",
    url: "/video1/343rt342wtg34wetg34retg4rghy5rh/FHD4/tt22022452.mp4",
  },
  {
    nome: "A Liga",
    url: "/video1/343rt342wtg34wetg34retg4rghy5rh/FHD4/tt12610390.mp4",
  },
  {
    nome: "Spaceman",
    url: "/video2/movie/swilder2023/6063815781/96792.mp4",
  },
  {
    nome: "Kung Fu Panda 4 (2024)",
    url: "/video2/movie/swilder2023/6063815781/100551.mp4",
  },
  {
    nome: "Spaceman",
    url: "/video2/movie/swilder2023/6063815781/96792.mp4",
  },
];

function criarListaDeVideos() {
  const videoList = document.getElementById("videoList");
  videos.forEach((video) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "list-button";
    button.setAttribute("data-src", video.url);
    button.innerText = video.nome;
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const videoSrc = this.getAttribute("data-src");
      const videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.style.display = "block"
      videoPlayer.src = videoSrc;
      videoPlayer.play();
    });
    li.appendChild(button);
    videoList.appendChild(li);
  });
}

criarListaDeVideos();

function carregarIframe(url) {
  var videoPlayer = document.getElementById("videoPlayer");
  videoPlayer.style.display = "block";
  videoPlayer.src = null;
  const modifiedUrl = url.replace(/^https?:\/\//, ''); // Remove o prefixo http:// ou https://
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(`/proxy?url=${encodeURIComponent(modifiedUrl)}`);
    hls.attachMedia(videoPlayer);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      videoPlayer.play();
    });
  } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
    videoPlayer.src = `/proxy?url=${encodeURIComponent(modifiedUrl)}`;
    videoPlayer.addEventListener("canplay", function () {
      videoPlayer.play();
    });
  } else {
    videoPlayer.src = `/proxy?url=${encodeURIComponent(modifiedUrl)}`;
    videoPlayer.play();
  }
}




