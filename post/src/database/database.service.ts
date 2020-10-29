import * as lowdb from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import { Injectable } from '@nestjs/common'

interface Value {
  id: string
}

@Injectable()
export class DatabaseService {
  private db: lowdb.LowdbAsync<any>
  private readonly dataStore: string = 'post'

  constructor () {
    this.initDb()
  }

  async initDb (): Promise<void> {
    const adapter = new FileAsync('db.json')
    this.db = await lowdb(adapter)

    const data = await this.db.get(this.dataStore).value()

    if (!data) {
      await this.db.set(this.dataStore, []).write()
    }
  }

  async findAll<T>(): Promise<T[]> {
    const values: T[] = await this.db.get(this.dataStore).value()
    return values
  }

  async findOneById<T extends Value>(id: string): Promise<T> {
    const values: T[] = await this.db.get(this.dataStore).value()

    const valueFound = values.find(obj => obj.id === id)

    return valueFound
  }

  async create<T>(newData: T): Promise<T> {
    const data: T[] = this.db.get(this.dataStore).value()

    data.push(newData)

    await this.db.set(this.dataStore, data).write()

    return newData
  }

  async deleteOne<T extends Value>(id: string): Promise<boolean> {
    let values: T[] = await this.db.get(this.dataStore).value()

    const valueFound = this.findOneById(id)
    if (valueFound) {
      values = values.filter(val => val.id !== id)
      await this.db.set(this.dataStore, values).write()
      return true
    } else {
      return false
    }
  }

  async updateOne<T extends Value>(id: string, newData: any): Promise<T | undefined> {
    const values = await this.findAll<T>()
    let newValue
    const foundValue = values.find(val => val.id === id)
    if (foundValue) {
      newValue = {
        ...foundValue,
        ...newData
      }

      const newValues = values.map(val => {
        if (val.id !== id) return val
        else return newValue
      })

      await this.db.set(this.dataStore, newValues).write()
    }
    return newValue
  }
}
