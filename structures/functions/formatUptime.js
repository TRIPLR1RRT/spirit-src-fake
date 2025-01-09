module.exports = (ms) => {
  var s = Math.floor((ms / 1000) % 60);
  var m = Math.floor((ms / (1000 * 60)) % 60);
  var h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  var d = Math.floor(ms / (1000 * 60 * 60 * 24));

  s %= 60;
  m %= 60;
  h %= 24;

  let Uptime = "";
  
  if (d > 0) {
    Uptime += `${d}d `;
  }
  if (h > 0) {
    Uptime += `${h}h `;
  }
  if (m > 0) {
     Uptime += `${m}m `;
  }
  if (s > 0) {
    Uptime += `${s}s`;
  }

  if (Uptime.endsWith(' ')) {
    Uptime = Uptime.slice(0, -1); 
  }

  return Uptime;
};