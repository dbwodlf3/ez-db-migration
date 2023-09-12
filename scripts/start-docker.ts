import path from "path";
import { spawn } from "child_process";
import common from "./common";

const dockerRoot = path.join(common.testRoot, "docker");
const [env] = process.argv.slice(2);

const env_file_name = (() => {
  return `.env.test`;
  //   return `.env.${env}`;
})();

spawn(
  `cd ${dockerRoot} && docker-compose --env-file ./${env_file_name} up --abort-on-container-exit \
    --force-recreate`,
  {
    shell: true,
    stdio: "inherit",
  }
);
