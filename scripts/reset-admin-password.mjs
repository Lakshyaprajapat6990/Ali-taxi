// One-off admin password reset / lister.
//
// Usage (run with bun so .env loads automatically):
//   bun scripts/reset-admin-password.mjs                      -> lists all admin accounts
//   bun scripts/reset-admin-password.mjs <email> <newPassword> -> resets that user's password
//
// It uses the SAME hashing scheme as the app (salt:hmac-sha256) so the new
// password works with the normal /admin/login page.

import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";
import { readFileSync } from "fs";

// Minimal .env loader (in case you run with plain `node`)
try {
  const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not found. Make sure .env exists.");
  process.exit(1);
}

function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(plain).digest("hex");
  return `${salt}:${hash}`;
}

const [, , emailArg, newPassword] = process.argv;

const UserSchema = new mongoose.Schema({}, { strict: false, collection: "users" });
const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

await mongoose.connect(MONGO_URI, { dbName: "alitaxis" });

const admins = await User.find({ role: "admin" }).lean();
console.log(`\nFound ${admins.length} admin account(s):`);
for (const a of admins) console.log(`  • ${a.name}  <${a.email}>`);

if (!emailArg || !newPassword) {
  console.log("\nTo reset a password run:");
  console.log("  bun scripts/reset-admin-password.mjs <email> <newPassword>\n");
  await mongoose.disconnect();
  process.exit(0);
}

const email = emailArg.toLowerCase();
const result = await User.updateOne(
  { email },
  { $set: { password: hashPassword(newPassword), role: "admin" } }
);

if (result.matchedCount === 0) {
  console.log(`\nNo user found with email "${email}". No changes made.`);
  console.log("Tip: use one of the admin emails listed above, or create a new admin via /api/auth/create-admin.\n");
} else {
  console.log(`\n✅ Password reset for ${email}. You can now log in at /admin/login with the new password.\n`);
}

await mongoose.disconnect();
process.exit(0);
