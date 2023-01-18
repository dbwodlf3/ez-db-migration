import path from "path";

const projectRoot = path.resolve(path.dirname(__dirname));
const serverRoot = path.join(projectRoot, "src", "server");

export default {
    projectRoot: projectRoot,
    serverRoot: serverRoot
}
