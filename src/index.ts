import dotenv from "dotenv";

import { server } from "./config/server";

dotenv.config();

server.listen(3000, () => {
  console.log("server started at 3000");
});
