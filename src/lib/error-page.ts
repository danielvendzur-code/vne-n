export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="sk">
  <head>
    <meta charset="utf-8" />
    <title>Stránku sa nepodarilo načítať</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: radial-gradient(circle at 18% 10%, rgba(52,120,246,.09), transparent 32rem), #050609; color: #f7f9fc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: clamp(2rem, 6vw, 3rem); border: 1px solid rgba(247,249,252,.12); border-radius: 1rem; background: rgba(14,17,24,.96); box-shadow: 0 28px 80px rgba(0,0,0,.42); }
      h1 { font-size: clamp(1.45rem, 4vw, 2rem); letter-spacing: -.04em; margin: 0 0 0.65rem; }
      p { color: #aeb6c2; margin: 0 0 1.75rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: .72rem 1.05rem; border-radius: .7rem; font: inherit; font-weight: 650; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: transform .2s ease, background-color .2s ease, border-color .2s ease; }
      a:hover, button:hover { transform: translateY(-2px); }
      .primary { background: #3478f6; color: #fff; }
      .primary:hover { background: #1f55c9; }
      .secondary { background: #0e1118; color: #f7f9fc; border-color: rgba(247,249,252,.16); }
      .secondary:hover { border-color: rgba(52,120,246,.5); }
      :focus-visible { outline: 3px solid #3478f6; outline-offset: 3px; }
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
