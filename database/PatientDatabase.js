class PatientDatabase {
  constructor(writer, reader) {
    this.writer = writer;
    this.reader = reader;
  }

  async createTable() {
    const sql = `
            CREATE TABLE IF NOT EXISTS patient (
                patientid INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                dateOfBirth DATETIME
            ) ENGINE=InnoDB
        `;

    await this.writer.query(sql);
  }

  async insertPatients() {
    // Check whether the table exists and create it if needed.
    await this.createTable();

    const patients = [
      ["Sara Brown", "1901-01-01"],
      ["John Smith", "1941-01-01"],
      ["Jack Ma", "1961-01-30"],
      ["Elon Musk", "1999-01-01"],
    ];

    const sql = `
            INSERT INTO patient (name, dateOfBirth)
            VALUES (?, ?)
        `;

    for (const patient of patients) {
      await this.writer.execute(sql, patient);
    }

    return {
      message: "Four patients inserted successfully.",
      inserted: patients.length,
    };
  }

  async executeSelect(sql) {
    const statement = sql.trim();

    if (!/^SELECT\b/i.test(statement)) {
      throw new Error("Only SELECT queries are allowed.");
    }

    const [rows] = await this.reader.query(statement);

    return rows;
  }
}

module.exports = PatientDatabase;
