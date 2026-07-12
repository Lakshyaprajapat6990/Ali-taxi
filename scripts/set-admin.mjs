// Updates the admin account's email and password.
// Usage: bun scripts/set-admin.mjs <newEmail> <newPassword>
import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";
import { readFileSync } from "fs";

try {
  const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(plain).digest("hex");
  return `${salt}:${hash}`;
}

const [, , newEmail, newPassword] = process.argv;
if (!newEmail || !newPassword) {
  console.error("Usage: bun scripts/set-admin.mjs <newEmail> <newPassword>");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({}, { strict: false, collection: "users" });
const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

await mongoose.connect(process.env.MONGO_URI, { dbName: "alitaxis" });

const admin = await User.findOne({ role: "admin" });
if (!admin) {
  console.log("No admin account found.");
  await mongoose.disconnect();
  process.exit(1);
}

// Make sure the target email isn't already used by a different (non-admin) user
const clash = await User.findOne({ email: newEmail.toLowerCase(), _id: { $ne: admin._id } });
if (clash) {
  console.log(`Email ${newEmail} is already used by another account. Aborting.`);
  await mongoose.disconnect();
  process.exit(1);
}

await User.updateOne(
  { _id: admin._id },
  { $set: { email: newEmail.toLowerCase(), password: hashPassword(newPassword) } }
);

console.log(`\n✅ Admin updated.`);
console.log(`   Email:    ${newEmail.toLowerCase()}`);
console.log(`   Password: ${newPassword}`);
console.log(`   Log in at /admin/login\n`);

await mongoose.disconnect();
process.exit(0);
