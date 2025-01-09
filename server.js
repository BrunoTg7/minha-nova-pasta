const https = require("https");
const http = require("http");
const express = require("express");
const selfsigned = require("selfsigned");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Gerar certificados autoassinados
const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, { days: 365 });

// Configurar CORS
app.use(cors());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.get("/", (req, res) => {
  const inputFilePath = path.join(__dirname, "public/index.html");
  fs.readFile(inputFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the input file:", err);
      res.status(500).send("Error reading the input file");
      return;
    }
    res.send(data);
  });
});

// Configurar o proxy para vídeos HTTP do primeiro domínio
app.use(
  "/video1",
  createProxyMiddleware({
    target: "http://fhd4.doramasapp.xyz",
    changeOrigin: true,
    pathRewrite: {
      "^/video1": "", // Remove o prefixo /video1 da URL
    },
  })
);

// Configurar o proxy para vídeos HTTP do segundo domínio
app.use(
  "/video2",
  createProxyMiddleware({
    target: "http://tkosportz.live:25461",
    changeOrigin: true,
    pathRewrite: {
      "^/video2": "", // Remove o prefixo /video2 da URL
    },
  })
);

// Configurar o proxy para redirecionar qualquer URL
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "",
    changeOrigin: true,
    router: function (req) {
      // Adicionar http:// ao URL se ele não começar com http:// ou https://
      const targetUrl = new URL(req.query.url.match(/^https?:\/\//) ? req.query.url : 'http://' + req.query.url);
      return targetUrl.origin;
    },
    pathRewrite: function (path, req) {
      // Adicionar http:// ao URL se ele não começar com http:// ou https://
      const targetUrl = new URL(req.query.url.match(/^https?:\/\//) ? req.query.url : 'http://' + req.query.url);
      return targetUrl.pathname + targetUrl.search;
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
    logLevel: "debug",
  })
);

// Servidor HTTPS
https
  .createServer({ key: pems.private, cert: pems.cert }, app)
  .listen(443, () => {
    console.log("HTTPS server running on port 443");
  });

// Redirecionamento HTTP para HTTPS
http
  .createServer((req, res) => {
    res.writeHead(301, {
      Location: "https://" + req.headers["host"] + req.url,
    });
    res.end();
  })
  .listen(80, () => {
    console.log("HTTP server running on port 80 and redirecting to HTTPS");
  });
