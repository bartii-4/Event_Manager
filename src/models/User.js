const { getDB } = require("../connection/db");
const crypto = require("crypto");

const COLLECTION = "users";

function hashPassword(password, salt = null) {
  salt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");
  return { salt, hash };
}

class User {
  static async create({ username, password }) {
    const db = getDB();
    const exists = await db.collection(COLLECTION).findOne({ username });
    if (exists) throw new Error("Username already taken");
    const { salt, hash } = hashPassword(password);
    const res = await db.collection(COLLECTION).insertOne({ username, hash, salt });
    return { id: res.insertedId, username };
  }

  static async findByUsername(username) {
    const db = getDB();
    return db.collection(COLLECTION).findOne({ username });
  }

  static async findById(id) {
    const db = getDB();
    const { ObjectId } = require("mongodb");
    return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  }

  static validPassword(userDoc, password) {
    if (!userDoc) return false;
    const { salt, hash } = hashPassword(password, userDoc.salt);
    return hash === userDoc.hash;
  }
}

module.exports = User;
