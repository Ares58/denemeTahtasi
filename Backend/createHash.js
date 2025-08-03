const bcrypt = require("bcrypt");

async function createHash() {
  const password = "1234"; // Buraya istediğin şifreyi yazabilirsin
  const hash = await bcrypt.hash(password, 10);
  console.log("Yeni hash:", hash);
}

createHash();
