const bcrypt = require("bcrypt");

async function testHash() {
  const plainPassword = "1234";
  const hash = "$2b$10$SIOG8fNf6K0vdfzRkhqGVusqOZ41bmDMdGR7Z8nKU28Vn3uD4KHh2";

  const result = await bcrypt.compare(plainPassword, hash);
  console.log("Test sonucu:", result);
}

testHash();
