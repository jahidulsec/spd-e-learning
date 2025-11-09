import { app } from "./app";

const PORT = process.env.SERVER_PORT || 6001;



const start = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`
🚀 Server ready at: http://localhost:${PORT}`),
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


start();