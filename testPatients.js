const DatabaseConfig = require("./config/database");
const PatientDatabase = require("./database/PatientDatabase");

class PatientTest {
  constructor() {
    const config = new DatabaseConfig();

    this.writer = config.createWriter();
    this.reader = config.createReader();

    this.database = new PatientDatabase(this.writer, this.reader);
  }

  async run() {
    try {
      await this.reader.query("DELETE FROM patient");
      console.log("SECURITY FAILURE: DELETE was allowed!");
      const result = await this.database.insertPatients();
      console.log(result);

      const patients = await this.database.executeSelect(
        "SELECT * FROM patient",
      );

      console.table(patients);
    } catch (error) {
      console.error("Test failed:", error.message);
    } finally {
      await this.writer.end();
      await this.reader.end();
    }
  }
}

const test = new PatientTest();
test.run();
