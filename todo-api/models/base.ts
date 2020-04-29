import { Collection, ObjectId } from "../deps.ts";
import { db } from "../mongo.ts";

export interface WithId {
  _id?: ObjectId;
}

export class MongoModel<Schema, T = Schema & WithId> {
  private collection: Collection;

  constructor(private readonly modelType: { new (): Schema }, name: string) {
    this.collection = db.collection(name);
  }

  private mergeDefaults(doc: Partial<Schema>) {
    const _doc: any = { ...new this.modelType(), ...doc };
    return _doc;
  }

  public async findById(_id: ObjectId | string): Promise<Schema | null> {
    if (typeof _id === "string") _id = ObjectId(_id);
    return this.collection.findOne({ _id });
  }

  public async findOne(filter?: Partial<Schema>): Promise<Schema | null> {
    return this.collection.findOne(filter);
  }

  public async find(filter?: Object): Promise<Schema | null> {
    return this.collection.find(filter);
  }

  public async delete(filter: Partial<Schema> & WithId): Promise<number> {
    return this.collection.deleteMany(filter);
  }

  public async aggregate(pipleline: Object[]): Promise<any | null> {
    return this.collection.aggregate(pipleline);
  }

  public async count(filter?: Object): Promise<number> {
    return this.collection.count(filter);
  }

  public async create(doc: Partial<Schema>): Promise<T> {
    const _doc: any = this.mergeDefaults(doc);
    const insertId = await this.collection.insertOne(_doc);
    _doc._id = insertId;
    return _doc;
  }

  public async updateOne(doc: Partial<Schema> & WithId) {
    const { _id, ...updateDoc } = this.mergeDefaults(doc);
    this.collection.updateOne({ _id }, { $set: updateDoc });
  }
}
