import { app } from "./src/app.js";

import environmentConfig from "./src/config/environment.config.js";
import connectDB from "./src/config/db.config.js";

app.listen(environmentConfig.PORT, () => {
  console.log(`Server is connected with port ${environmentConfig.PORT}`);
  connectDB();
});
