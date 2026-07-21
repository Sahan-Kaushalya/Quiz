require("dotenv").config();
const sequelize = require("./config/db.config");
const { Admin } = require("./models/associations");

async function checkAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");

    const admins = await Admin.findAll();
    console.log("Admins:", admins.map(a => ({ id: a.id, username: a.username, email: a.email })));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
}

checkAdmin();
