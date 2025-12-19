const { getDB } = require("../connection/db");

const COLLECTION = "events";

class EventModel {
  static async create(data) {
    const db = getDB();
    const doc = {
      title: data.title,
      description: data.description || "",
      date: data.date ? new Date(data.date) : new Date(),
      location: data.location || "",
      category: data.category || "general",
      owner: data.owner || null,
      createdAt: new Date()
    };
    const res = await db.collection(COLLECTION).insertOne(doc);
    return { id: res.insertedId, ...doc };
  }

  static async findAll({ filter = {}, sort = { createdAt: -1 }, limit = 0 } = {}) {
    const db = getDB();
    const cursor = db.collection(COLLECTION).find(filter).sort(sort).limit(limit);
    return cursor.toArray();
  }

  static async findById(id) {
    const db = getDB();
    const { ObjectId } = require("mongodb");
    return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  }

  static async update(id, data) {
    const db = getDB();
    const { ObjectId } = require("mongodb");
    const update = {
      $set: {
        title: data.title,
        description: data.description || "",
        date: data.date ? new Date(data.date) : new Date(),
        location: data.location || "",
        category: data.category || "general",
      }
    };
    await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, update);
    return this.findById(id);
  }

  static async remove(id) {
    const db = getDB();
    const { ObjectId } = require("mongodb");
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return true;
  }
}

module.exports = EventModel;
