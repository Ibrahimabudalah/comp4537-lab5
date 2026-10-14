require("dotenv").config();

const http = require("node:http");
const DatabaseConfig = require("./config/database");
const PatientDatabase = require("./database/PatientDatabase");

class PatientServer {
  constructor() {
    const config = new DatabaseConfig();

    this.writer = config.createWriter();
    this.reader = config.createReader();

    this.database = new PatientDatabase(this.writer, this.reader);

    this.port = Number(process.env.PORT) || 3000;
    this.clientOrigin = process.env.CLIENT_ORIGIN;

    this.server = http.createServer((req, res) => this.handleRequest(req, res));
  }

  sendResponse(res, status, data) {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(JSON.stringify(data));
  }

  async handleRequest(req, res) {
    res.setHeader("Access-Control-Allow-Origin", this.clientOrigin);

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

      const pathname = url.pathname;
      const sqlPath = "/lab5/api/v1/sql/";

      if (req.method === "POST" && pathname === "/lab5/api/v1/insert") {
        const result = await this.database.insertPatients();

        this.sendResponse(res, 200, result);
        return;
      }

      if (req.method === "GET" && pathname.startsWith(sqlPath)) {
        const sql = decodeURIComponent(pathname.substring(sqlPath.length));

        if (!sql.trim()) {
          this.sendResponse(res, 400, {
            error: "SQL query is required.",
          });
          return;
        }

        const rows = await this.database.executeSelect(sql);

        this.sendResponse(res, 200, rows);
        return;
      }

      this.sendResponse(res, 404, {
        error: "Endpoint not found.",
      });
    } catch (error) {
      console.error("Request error:", error.message);

      if (error.message === "Only SELECT queries are allowed.") {
        this.sendResponse(res, 403, {
          error: error.message,
        });
        return;
      }

      this.sendResponse(res, 500, {
        error: "Unable to process request.",
      });
    }
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server 2 running at http://localhost:${this.port}`);
    });
  }
}

const app = new PatientServer();
app.start();
