import { prisma } from "../services";

interface IRead {
  id?: string;
}

export class BookModel {
  static async create({
    data,
  }: {
    data: (typeof prisma.book.create)["arguments"]["data"];
  }) {
    return await prisma.book.create({ data });
  }

  static async read({ id }: IRead) {
    if (id) {
      const book = await prisma.book.findUnique({
        where: { id },
      });
      return book ? [book] : [];
    }

    return await prisma.book.findMany({});
  }
}
