import app from "./app";
import config from "./config";

const PORT = config.port;

async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting in the server", error);
    process.exit(1);
  }
}

main();
