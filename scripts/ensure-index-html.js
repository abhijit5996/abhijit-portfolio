import fs from "node:fs";
import path from "node:path";

const publicDir = path.resolve(process.cwd(), ".output", "public");
const assetsDir = path.join(publicDir, "assets");

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith(".css")) || "";

  // Only include the main client entry script (e.g. index-*.js).
  // Including code-split route chunks like admin-*.js directly as script tags causes
  // out-of-order execution and invariant errors before the router initializes.
  const entryJs =
    files.find((f) => (f.startsWith("index-") || f.startsWith("main-") || f.startsWith("entry-")) && f.endsWith(".js")) ||
    files.find((f) => f.endsWith(".js")) ||
    "";

  const jsScripts = entryJs ? `    <script type="module" src="/assets/${entryJs}"></script>` : "";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Abhijit Das — Developer Portfolio</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
    <script>
      window.$_TSR = window.$_TSR || new Proxy({
        h: function() {},
        init: function() {},
        cleanups: [],
        buffer: [],
        t: new Map(),
        initialized: false,
        router: {
          matches: [],
          manifest: {},
          dehydratedData: null,
          lastMatchId: ""
        }
      }, {
        get: function(target, prop) {
          if (prop in target) return target[prop];
          return function() {};
        }
      });
    </script>
  </head>
  <body class="bg-background text-foreground">
    <div id="root"></div>
${jsScripts}
  </body>
</html>`;

  fs.writeFileSync(path.join(publicDir, "index.html"), html, "utf-8");
  console.log("[Build] Successfully generated .output/public/index.html");
}

