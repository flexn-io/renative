"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = require("rnv/dist/common");

var _config = _interopRequireDefault(require("rnv/dist/config"));

var _path = _interopRequireDefault(require("path"));

var _prompt = require("rnv/dist/systemTools/prompt");

var _logger = require("rnv/dist/systemTools/logger");

var _exec = require("rnv/dist/systemTools/exec");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const doDeploy = async () => {
  const {
    paths,
    runtime,
    platform,
    files
  } = _config.default.getConfig();

  const projectBuilds = paths.project.builds.dir;

  const projectBuildWeb = _path.default.join(projectBuilds, `${runtime.appId}_${platform}`);

  const dockerFile = _path.default.join(__dirname, '../Dockerfile');

  const nginxConfFile = _path.default.join(__dirname, '../nginx/default.conf');

  const copiedDockerFile = _path.default.join(projectBuildWeb, 'Dockerfile');

  const copiedNginxConfFile = _path.default.join(projectBuildWeb, 'nginx.default.conf');

  let {
    DOCKERHUB_USER,
    DOCKERHUB_PASS
  } = process.env; // save the Dockerfile

  (0, _logger.logTask)('docker:Dockerfile:create');
  (0, _common.writeCleanFile)(dockerFile, copiedDockerFile);
  (0, _common.writeCleanFile)(nginxConfFile, copiedNginxConfFile); // ask for user/pass if not present in env

  if (!DOCKERHUB_PASS || !DOCKERHUB_USER) {
    const {
      confirm
    } = await (0, _prompt.inquirerPrompt)({
      type: 'confirm',
      message: 'It seems you don\'t have the DOCKERHUB_USER and DOCKERHUB_PASS environment variables set. Do you want to enter them here?'
    });

    if (confirm) {
      const {
        user
      } = await (0, _prompt.inquirerPrompt)({
        name: 'user',
        type: 'input',
        message: 'DockerHub username',
        validate: i => !!i || 'No username provided'
      });
      DOCKERHUB_USER = user;
      const {
        pass
      } = await (0, _prompt.inquirerPrompt)({
        name: 'pass',
        type: 'password',
        message: 'DockerHub password',
        validate: i => !!i || 'No password provided'
      });
      DOCKERHUB_PASS = pass;
    } else {
      return (0, _logger.logInfo)('You chose to not publish the image on DockerHub. The Dockerfile is located in the root folder');
    }
  }

  const imageName = runtime.appId.toLowerCase();
  const imageTag = `${DOCKERHUB_USER}/${imageName}`;
  const appVersion = files.project.package.version;
  (0, _logger.logTask)('docker:Dockerfile:build');
  await (0, _exec.executeAsync)(`docker build -t ${imageTag}:latest ${projectBuildWeb}`);
  (0, _logger.logTask)('docker:Dockerfile:login');
  await (0, _exec.executeAsync)(`echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin`, {
    interactive: true
  });
  (0, _logger.logTask)('docker:Dockerfile:push'); // tagging for versioning

  await (0, _exec.executeAsync)(`docker tag ${imageTag}:latest ${imageTag}:${appVersion}`);
  await (0, _exec.executeAsync)(`docker push ${imageTag}:${appVersion}`);
  await (0, _exec.executeAsync)(`docker push ${imageTag}:latest`);
};

var _default = doDeploy;
exports.default = _default;