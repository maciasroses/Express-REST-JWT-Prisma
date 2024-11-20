import { Author, Book, User } from "@prisma/client";

export interface IUser extends User {}

export interface IAuthor extends Author {
  // books: IBook[];
}

export interface IBook extends Book {
  // author: IAuthor;
}

export interface IBookModel {
  create: ({ data }: { data: object }) => Promise<IBook>;
  read: ({ id }: { id?: string }) => Promise<IBook | IBook[] | []>;
}

export interface IAuthorModel {
  create: ({ data }: { data: object }) => Promise<IAuthor>;
  read: ({ id }: { id?: string }) => Promise<IAuthor | IAuthor[] | []>;
}