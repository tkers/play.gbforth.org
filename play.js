const palette = {
  0: [0x08, 0x18, 0x20],
  96: [0x30, 0x68, 0x50],
  192: [0x88, 0xc0, 0x70],
  200: [200, 0, 0], // ?
  250: [0, 0, 200], // ?
  255: [0xe0, 0xf8, 0xd0]
};

const setRenderTarget = (gameboy, canvas) => {
  const ctx = canvas.getContext("2d");
  gameboy.gpu.on("frame", img => {
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0, length = data.data.length; i < length; i += 4) {
      const col = palette[data.data[i]] || [0, 0, 0];

      data.data[i] = col[0];
      data.data[i + 1] = col[1];
      data.data[i + 2] = col[2];
    }
    ctx.putImageData(data, 0, 0);
  });
};

const fetchBytes = src => fetch(src).then(res => res.arrayBuffer());

const decodeBytes = base64 => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

const initGameboy = canvas => {
  const gameboy = new window.Gameboy();
  setRenderTarget(gameboy, canvas);
  window.addEventListener("keydown", e => gameboy.joypad.keyDown(e.keyCode));
  window.addEventListener("keyup", e => gameboy.joypad.keyUp(e.keyCode));
  return gameboy;
};

const playRom = (rom, canvas) => {
  const gameboy = initGameboy(canvas);
  gameboy.loadCart(rom);
  gameboy.start();
  return () => gameboy.reset();
};

const playFromBase64 = (b64, canvas) => playRom(decodeBytes(b64), canvas);
const playFromUrl = (url, canvas) =>
  fetchBytes(url).then(rom => playRom(rom, canvas));

window.playFromBase64 = playFromBase64;
window.playFromUrl = playFromUrl;
