import { app } from "./app";

const PORT = process.env.SERVER_PORT || 6001;

app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}`),
);
