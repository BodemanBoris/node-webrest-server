import { Server } from "./presentation/server";
import { envs } from "./config/envs";

(() => {
  main();
})();

function main() {
  const app = new Server({ port: envs.PORT, public_path: envs.PUBLIC_PATH });
  app.start();
}
