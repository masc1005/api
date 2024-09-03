import dotenv from "dotenv";

import { server } from "./config/server";

dotenv.config();

server.listen(process.env.SERVER_PORT, () => {
  console.log(`running on port ${process.env.SERVER_PORT}`);
});
