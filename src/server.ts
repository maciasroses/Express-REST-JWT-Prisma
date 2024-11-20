import { createApp } from "./app";
import { BookModel, AuthorModel } from "./models";

const app = createApp({
  bookModel: BookModel,
  authorModel: AuthorModel,
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
