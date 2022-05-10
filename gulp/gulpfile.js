const gulp = require('gulp');
const argv = require('yargs').argv;
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

gulp.task(makeFn('_build-dockers', "build the docker containers that project need", {}, function (cb) {

    // docker-compose -p bs-compare -f docker-compose.yml up -d --no-recreate

    const projectName = 'bs-compare'
    const childProcess = exec(`docker-compose -p ${projectName} -f docker-compose.yml up -d --no-recreate`, {cwd: `${__dirname}/docker`});

    childProcess.stdout.on("data", (data) => console.log(data));
    childProcess.stderr.on("data", (data) => console.error(data));
    childProcess.on('close', () => cb());
    childProcess.on('exit', () => cb());
}));
