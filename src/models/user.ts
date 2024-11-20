import { prisma } from "../services";

interface IRead {
  id?: string;
  email?: string;
}

export class UserModel {
  static async create({
    data,
  }: {
    data: (typeof prisma.user.create)["arguments"]["data"];
  }) {
    return await prisma.user.create({ data });
  }

  static async read({ id, email }: IRead) {
    if (id) {
      return await prisma.user.findUnique({
        where: { id },
      });
    }

    if (email) {
      return await prisma.user.findUnique({
        where: { email },
      });
    }

    return await prisma.user.findMany();
  }
}
