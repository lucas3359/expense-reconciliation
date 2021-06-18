import { PrismaClient, user } from '@prisma/client'
import User from '../model/user'

class UserService {
  private readonly prisma: PrismaClient

  public constructor() {
    this.prisma = new PrismaClient()
  }

  public async getUsers(): Promise<User[]> {
    const users: user[] = await this.prisma.user.findMany()

    return users.map((prismaUser) => {
      return {
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.name,
      }
    })
  }
}

export default UserService
