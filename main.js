const getRom = name => {
  switch (name) {
    case "soko":
      return "sokoban";
    case "simon":
      return "simon";
    case "aces":
      return "aces-up";
    case "bday":
      return "happy-birthday";
    default:
      return "hello";
  }
};

window.addEventListener("load", () => {
  const name = window.location.hash.substring(1);
  const url = `roms/${getRom(name)}.gb`;
  playFromUrl(url, document.getElementById("lcd"));

  const dl = document.getElementById('download');
  dl.href = url;
  dl.innerHTML = url.substring(5);
});

window.addEventListener("hashchange", () => {
  window.location.reload();
}, false);
