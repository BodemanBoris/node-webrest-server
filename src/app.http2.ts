import http2 from "http2";
import fs from "fs";

const server = http2.createSecureServer(
  {
    key: fs.readFileSync("./keys/server.key"),
    cert: fs.readFileSync("./keys/server.crt"),
  },
  (req, res) => {
    //const styles = fs.readFileSync("./public/css/styles.css", "utf-8");
    //const logic = fs.readFileSync("./public/js/index.js", "utf-8");

    if (req.url === "/") {
      res.writeHead(200, { "Content-type": "text/html" });
      const textHtml = fs.readFileSync("./public/index.html", "utf-8");
      res.end(textHtml);
      return;
    }

    if (req.url?.endsWith("js")) {
      res.writeHead(200, { "Content-type": "application/javascript" });
    } else if (req.url?.endsWith("css")) {
      res.writeHead(200, { "Content-type": "text/css" });
    }

    try {
      const responseContent = fs.readFileSync(`./public${req.url}`, "utf-8");
      console.log(req.url);

      res.end(responseContent);
    } catch (error) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end();
    }
  }
);

server.listen(8080, () => {
  console.log(`Server is running on Port https://localhost:8080`);
});
