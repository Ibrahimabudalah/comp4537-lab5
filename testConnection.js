const DatabaseConfig = require("./config/database");

class ConnectionTest {
  constructor() {
    const config = new DatabaseConfig();

    this.writer = config.createWriter();
    this.reader = config.createReader();
  }

  async test() {
    try {
      const [writerResult] = await this.writer.query(
        "SELECT CURRENT_USER() AS user",
      );

      const [readerResult] = await this.reader.query(
        "SELECT CURRENT_USER() AS user",
      );

      console.log("Writer connected:", writerResult[0].user);
      console.log("Reader connected:", readerResult[0].user);
      console.log("Both database connections successful!");
    } catch (error) {
      console.error("Connection failed:", error.message);
    } finally {
      await this.writer.end();
      await this.reader.end();
    }
  }
}

const test = new ConnectionTest();
test.test();
