import { PrismaClient } from '@prisma/client'

class DbService {
  private static _instance: DbService
  private readonly prisma: PrismaClient

  // Set up as a singleton to avoid too many PrismaClients being created
  constructor() {
    if (DbService._instance) {
      return DbService._instance
    }
    DbService._instance = this
    this.prisma = new PrismaClient()
  }

  public getPrismaClient(): PrismaClient {
    return this.prisma
  }
}

export default DbService
