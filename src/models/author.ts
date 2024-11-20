import { prisma } from "../services";

interface IRead {
  id?: string;
}

export class AuthorModel {
  static async create({
    data,
  }: {
    data: (typeof prisma.author.create)["arguments"]["data"];
  }) {
    return await prisma.author.create({ data });
  }

  static async read({ id }: IRead) {
    if (id) {
      const author = await prisma.author.findUnique({
        where: { id },
      });
      return author ? [author] : [];
    }

    return await prisma.author.findMany();
  }
}
