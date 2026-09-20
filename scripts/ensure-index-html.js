import fs from "node:fs";
import path from "node:path";

const publicDir = path.resolve(process.cwd(), ".output", "public");
const assetsDir = path.join(publicDir, "assets");

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith(".css")) || "";

  const jsScripts = files
    .filter((f) => f.endsWith(".js"))
    .map((f) => `    <script type="module" src="/assets/${f}"></script>`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Abhijit Das — Developer Portfolio</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body class="bg-background text-foreground">
    <div id="root"></div>
${jsScripts}
  </body>
</html>`;

  fs.writeFileSync(path.join(publicDir, "index.html"), html, "utf-8");
  console.log("[Build] Successfully generated .output/public/index.html");
}
