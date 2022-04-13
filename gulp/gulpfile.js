const gulp = require('gulp');
const argv = require('yargs').argv;
const template = require('gulp-template');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {exec} = require('child_process');

/**
 *  Basic parameters
 *  ( use --env=dev . stg . prod to change the target environment )
 */
const ENVIRONMENT = (argv.env || argv.e || 'dev').toLowerCase();

console.log(`ENVIRONMENT: ${ENVIRONMENT}`);

// 參考資料 : https://gulpjs.com/docs/en/api/task/
const makeFn = (displayName, description, flags, fn) => {

    // name	- string - A special property of named functions. Used to register the task. Note: name is not writable; it cannot be set or changed.
    // displayName - string - When attached to a taskFunction creates an alias for the task. If using characters that aren't allowed in function names, use this property.
    // description - string - When attached to a taskFunction provides a description to be printed by the command line when listing tasks.
    // flags - object - When attached to a taskFunction provides flags to be printed by the command line when listing tasks. The keys of the object represent the flags and the values are their descriptions.

    fn.displayName = displayName;
    fn.description = description;
    fn.flags = flags;
    return fn;
};

const uploadFunc = uploadType => async () => {

    /**
     upload
     1. docker-compose.yml & DockerFiles
     2. web          => web/build
     3. api          => express
     */

        // -----------------  here are functions ---------------------- //

    const uploadFolderFiles = async ({ssh, type, localDirectory, remoteDirectory}) => {

            const status_1 = await ssh.putDirectory(localDirectory, remoteDirectory, {
                recursive: true,
                concurrency: 10,
                validate: function (itemPath) {
                    const baseName = path.basename(itemPath);
                    return baseName.substr(0, 1) !== '.' && // do not allow dot files
                        baseName.substring(baseName.length - 4, baseName.length) !== '.ppk' && // do not allow privateKey
                        baseName !== 'node_modules' && // do not allow node_modules
                        baseName !== 'logs' // do not allow logs
                },
                tick: function (localPath, remotePath, error) {
                    if (error) {
                        console.error(`${type} file , failed transfers ---`, error);
                    } else {
                        console.log(`${type} file , successful transfers ---`, localPath);
                    }
                }
            });

            console.log(`the ${type}-files transfer was`, status_1 ? 'successful' : 'unsuccessful');
        };

    const connet = async ({host, username, privateKey}) => {

        const node_ssh = require('node-ssh');

        const ssh = new node_ssh();

        await ssh.connect({host, username, privateKey});

        return ssh;
    };

    const disConnect = async (ssh) => await ssh.dispose();

    // -----------------  here are functions ---------------------- //

    let ciConfig = require(`./gen/ciConfig`);

    const serverRoot = ciConfig.sshServer.root;
    const webRoot = ciConfig.webServer.root;
    const apiRoot = ciConfig.apiServer.root;
    const notifyRoot = ciConfig.notifyServer.root;
    const host = ciConfig.sshServer.host;
    const env = ENVIRONMENT;
    const username = ciConfig.sshServer.username;
    const privateKey = ciConfig.sshServer.privateKey;

    const ssh = await connet({host, username, privateKey});

    const dockerFn = () => uploadFolderFiles({
        ssh,
        type: 'docker-files',
        localDirectory: './gen',
        remoteDirectory: `${serverRoot}/docker-files`
    });
    const webFn = () => uploadFolderFiles({
        ssh,
        type: 'web',
        localDirectory: `${webRoot}/dist`,
        remoteDirectory: `${serverRoot}/web/${env}`
    });
    const apiFn = () => uploadFolderFiles({
        ssh,
        type: 'api',
        localDirectory: apiRoot,
        remoteDirectory: `${serverRoot}/api`
    });
    const notifyFn = () => uploadFolderFiles({
        ssh,
        type: 'notify',
        localDirectory: notifyRoot,
        remoteDirectory: `${serverRoot}/notify`
    });

    // all 全跑 , 不然各自跑
    if (uploadType === 'docker') await dockerFn();
    else if (uploadType === 'web') await webFn();
    else if (uploadType === 'api') await apiFn();
    else if (uploadType === 'notify') await notifyFn();
    else if (uploadType === 'all') await Promise.all([dockerFn(), webFn(), apiFn(), notifyFn()]);

    await disConnect(ssh);
};

gulp.task(makeFn("compile-template", "Compile files under templates/master with given environment", {'-e': 'environment (optional)'}, function (cb) {
    let environmentStringValues = require(`./build-resources/template/env/${ENVIRONMENT}/string.js`);
    let constantStringValues = require('./build-resources/template/env/constant.js');

    gulp.src('build-resources/template/master/**/*', {base: 'build-resources/template/master/'})
        .pipe(template(Object.assign(environmentStringValues, constantStringValues, {ENVIRONMENT}), {
            interpolate: /<%=([\s\S]+?)%>/g //Ignore ES6 syntax ${} replacement
        }))
        .pipe(gulp.dest('./gen/'))
        .on('end', function () {
            cb();
        })
}));

gulp.task(makeFn('_replace-config-files', "copy web & api config files", {}, async function () {

    let ciConfig = require(`./gen/ciConfig`);

    const apiRoot = path.resolve(__dirname, '../express'); // 'D:/ezoom/ezoom-line-bot/express';
    const webRoot = path.resolve(__dirname, '../front'); // 'D:/ezoom/ezoom-line-bot/front';

    fs.copyFileSync('./gen/knex/knexfile.js', `${apiRoot}/knex/config.js`);
    // copy apiConfig.js to [apiRoot]/configs.js
    fs.copyFileSync('./gen/apiConfig.js', `${apiRoot}/config.js`);
    // copy webConfig.js to [webRoot]/src/configs.js
    fs.copyFileSync('./gen/webConfig.js', `${webRoot}/src/config.js`);

}));

gulp.task(makeFn('_build-source', 'build vue-web-html', {}, async () => {

    // here need to build
    //     1. web          => read the path of web root and make build folder

    // -----------------  here are functions ---------------------- //

    const buildWeb = (webRoot) => {

        if (!webRoot) throw 'webRoot cannot be undefined';

        return new Promise(function (resolve, reject) {

            // copy configs.js to [webRoot]/src/configs/gen/configs.js
            // fs.copyFileSync('../gen/config.js', `${webRoot}/src/configs/gen/config.js`);

            const cmd = `cd ${webRoot} && npm run build`;

            let process = exec(cmd, {stdio: 'inherit'}, (err) => ((err) ? reject(err) : resolve()));

            // the html-output folder is at D:/ezoom/dash-board-test/build

            process.stdout.on("data", (data) => console.log(data.toString()));
            process.stderr.on("data", (data) => console.error(data.toString()));
        });

    };

    // -----------------  here are functions ---------------------- //

    let ciConfig = require(`./gen/ciConfig`);

    const webRoot = ciConfig.webServer.root;

    await buildWeb(webRoot);

}));

gulp.task(makeFn('_upload-files-to-server', 'upload node-api files and web-html with ssh', {}, uploadFunc('all')));

gulp.task(makeFn('_upload-API-to-server', 'upload node-api files with ssh', {}, uploadFunc('api')));

gulp.task(makeFn('_upload-WEB-to-server', 'upload web files with ssh', {}, uploadFunc('web')));

gulp.task(makeFn("_remote-build-container", "Build containers from generated docker-compose.yml file", {}, async function () {

    // -----------------  here are functions ---------------------- //

    const installDockerCli = async (ssh) => {

        const checkDockerVersion = async (ssh) => {

            // Command with escaped params
            const result = await ssh.execCommand('docker --version', {
                stream: 'stdout',
                options: {pty: true}
            });

            // console.log('STDOUT: \n\n', result && result.stdout);

            return result.stdout;
        };

        const stdout = await checkDockerVersion(ssh);

        if (stdout && stdout.trim().startsWith('Docker version')) return; // target server already install docker

        const cmd = 'sudo apt install docker.io\n' +
            'sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose\n' +
            'sudo chmod +x /usr/local/bin/docker-compose\n' +
            'sudo gpasswd -a ${USER} docker\n';

        // Command with escaped params
        const result = await ssh.execCommand(cmd, {
            stream: 'stdout',
            options: {pty: true}
        });

        console.log('STDOUT: \n\n', result && result.stdout);
    };

    // -t project:$tag
    const buildContainer = async ({ssh, serverRoot, projectName}) => {

        // Command with escaped params
        const result = await ssh.execCommand(`docker-compose -p ${projectName} -f "./docker-compose.yml" up -d --no-recreate`, {
            cwd: `${serverRoot}/docker-files/docker`, // '/home/ubuntu/mail-auto/setup/docker-files/docker',
            // stream: 'stdout',
            onStdout(chunk) {
                const str = chunk.toString('utf8');

                // https://stackoverflow.com/questions/6157497/node-js-printing-to-console-without-a-trailing-newline
                process.stdout.write(chalk.green(str));
            },
            options: {pty: true}
        });

        // console.log('STDOUT: \n\n', result && result.stdout);
    };

    const connect = async ({host, username, privateKey}) => {

        const node_ssh = require('node-ssh');

        const ssh = new node_ssh();

        await ssh.connect({host, username, privateKey});

        return ssh;
    };

    const disConnect = async (ssh) => await ssh.dispose();

    // -----------------  here are functions ---------------------- //

    const ciConfig = require(`./gen/ciConfig`);

    const serverRoot = ciConfig.sshServer.root;
    const projectName = ciConfig.projectName;
    const host = ciConfig.sshServer.host;
    const username = ciConfig.sshServer.username;
    const privateKey = ciConfig.sshServer.privateKey;

    const ssh = await connect({host, username, privateKey});

    await installDockerCli(ssh);

    // first , install docker & docker-compose on sshServer
    await buildContainer({ssh, serverRoot, projectName});

    await disConnect(ssh);
}));

// 建立 dev-db & 將預設資料灌進去
gulp.task(makeFn('build-dev-db', "setup dev-db and dump init data", {}, async function () {

    const buildDevDB = () => {

        return new Promise(function (resolve, reject) {

            const cmd = `docker-compose -p ezoom-line-bot -f ./gen/docker/docker-compose.yml up -d --no-recreate`;

            let process = exec(cmd, {cwd: '.', stdio: 'inherit'}, (err) => ((err) ? reject(err) : resolve()));

            process.stdout.on("data", (data) => console.log(data.toString()));
            process.stderr.on("data", (data) => console.error(data.toString()));
        });
    };

    const runSqlFile = async function (fileName) {
        const Knex = require('knex');

        const knexConfig = require('./gen/knex/knexfile').database;
        let knex = Knex(knexConfig);

        let file = fs.readFileSync(fileName);
        await knex.raw(file.toString());

        knex.destroy();
    };

    // await buildDevDB();
    await runSqlFile('./sql/ezoom-2021_05_24.sql');

}));

const setupFn = gulp.series('compile-template', '_replace-config-files', '_build-source', '_upload-files-to-server', "_remote-build-container");
gulp.task(makeFn("setup", "setup server on linux for given environment", {'-e': 'environment (optional)'}, setupFn));

const updateFn = gulp.series('compile-template', '_replace-config-files', '_build-source', '_upload-files-to-server');
gulp.task(makeFn("update-codes", "upload new files for given environment", {'-e': 'environment (optional)'}, updateFn));

const apiFn = gulp.series('compile-template', '_replace-config-files', '_upload-API-to-server');
gulp.task(makeFn("compile-and-upload-api", "compile and upload node-api files to server", {'-e': 'environment (optional)'}, apiFn));

const webFn = gulp.series('compile-template', '_replace-config-files', '_build-source', '_upload-WEB-to-server');
gulp.task(makeFn("compile-and-upload-web", "compile and upload web-html files to server", {'-e': 'environment (optional)'}, webFn));
