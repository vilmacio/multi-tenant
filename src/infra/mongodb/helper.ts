import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string):Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async desconnect ():Promise<void> {
    await this.client.close()
  },

  getCollection (collection: string):Collection {
    return this.client.db().collection(collection)
  }
}
