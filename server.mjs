import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL(".", import.meta.url).pathname;
const PORT = process.env.PORT || 5480;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".pdf": "application/pdf" };

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = normalize(join(ROOT, p));
  if (!file.startsWith(ROOT) || /\/(scripts|\.git)\//.test(file)) { res.writeHead(404); return res.end("Not found"); }
  try {
    if ((await stat(file)).isDirectory()) throw 0;
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(PORT, "127.0.0.1", () => console.log(`Guest explorer on http://127.0.0.1:${PORT}`));
