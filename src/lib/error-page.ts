export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="sk">
  <head>
    <meta charset="utf-8" />
    <title>Stránku sa nepodarilo načítať</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: radial-gradient(circle at 18% 10%, rgba(201,170,112,.09), transparent 32rem), radial-gradient(circle at 88% 86%, rgba(127,165,143,.08), transparent 28rem), #06120e; color: #f2efe6; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: clamp(2rem, 6vw, 3rem); border: 1px solid rgba(242,239,230,.12); border-radius: 1rem; background: rgba(16,38,29,.92); box-shadow: 0 28px 80px rgba(0,0,0,.42); backdrop-filter: blur(18px); }
      h1 { font-size: clamp(1.45rem, 4vw, 2rem); letter-spacing: -.04em; margin: 0 0 0.65rem; }
      p { color: #b7beb4; margin: 0 0 1.75rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: .72rem 1.05rem; border-radius: .7rem; font: inherit; font-weight: 650; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: transform .2s ease, background-color .2s ease, border-color .2s ease; }
      a:hover, button:hover { transform: translateY(-2px); }
      .primary { background: #bc7352; color: #07140e; }
      .primary:hover { background: #cd8665; }
      .secondary { background: #10261d; color: #f2efe6; border-color: rgba(242,239,230,.16); }
      .secondary:hover { border-color: rgba(127,165,143,.5); }
      :focus-visible { outline: 3px solid #7fa58f; outline-offset: 3px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Stránku sa nepodarilo načítať</h1>
      <p>Niečo sa pokazilo. Skúste stránku obnoviť alebo sa vráťte na úvod.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Skúsiť znova</button>
        <a class="secondary" href="./">Späť na úvod</a>
      </div>
    </div>
  </body>
</html>`;
}
