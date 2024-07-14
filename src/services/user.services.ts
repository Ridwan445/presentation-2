import { PrismaClient, user } from "@prisma/client";
import argon2  from "argon2";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

class UserService {
  public async getUsers(): Promise<user[]> {
    return await prisma.user.findMany();
  }
  public async createUser(name: string, email: string, plainPassword: string, role: string): Promise<user> {
    const hashedPassword = await this.hashPassword(plainPassword);
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role,
      },
    });
    return user;
  }

  private async hashPassword(plainPassword: string): Promise<string> {
    return await argon2.hash(plainPassword);
  }



  public async getUserById(id: number): Promise<user | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  public async userExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user !== null;
  }


public async loginUser(email: string, plainPassword: string): Promise<{ token: string; user: user }> {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const validPassword = await argon2.verify(user.password, plainPassword);
  if (!validPassword) {
    throw new Error('Invalid password');
  }

  const token = this.generateToken(user);

  return { token, user };
}

private generateToken(user: user): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
}

public async deleteAllUsers() {
  return await prisma.user.deleteMany({})
}
}

export default new UserService();
