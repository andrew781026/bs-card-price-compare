const router = require('express').Router();
const log4js = require('log4js');
const TrackService = require('../service/track');
const TrackStatService = require('../service/trackStat');
const EmployeeService = require('../service/employee');
const transWrapper = require('../utils/transWrapper');
const errorWrapper = require('../utils/errorWrapper');
const DateUtil = require('../utils/dateUtil');

router.get('/reportedTrackWithDept', errorWrapper(async (req, res) => {
    const {date, department} = req.query;
    const tracks = await new TrackService().reportedTrackWithDept(date, department);
    res.json(tracks);
}));

router.get('/dateDeptStat', errorWrapper(async (req, res) => {
    const {department, date} = req.query;
    const statistic = await new TrackService().dateDeptStat({department, date});
    res.json(statistic);
}));

router.get('/stat', errorWrapper(async (req, res) => {
    const {department} = req.query;
    const statistic = await new TrackService().stat({department});
    res.json(statistic);
}));

router.patch('/dailyBatchStat', errorWrapper(async (req, res) => {

    log4js.getLogger().info( '/track/dailyBatchStat , batch start to run 😃');
    res.json({msg: 'dailyBatchStat , batch start to run 😃'});

    const runner = async (date) => {

        try {

            const stats = await new TrackService().dailyStat(date);
            await transWrapper((trx) => new TrackStatService().save({stats, trx}));
            log4js.getLogger().info(`date = ${date} , TrackService().dailyBatchStat successful finished`);

        } catch (err) {

            log4js.getLogger().error(`date = ${date} , TrackService().deptStat failed`);
            log4js.getLogger().error(`*STACK* ${err.stack}`);
        }
    }

    const date = DateUtil.toDate(req.body.day, 'YYYY-MM-DD');
    runner(date)
        .then(() => log4js.getLogger().info('TrackService().dailyBatchStat successful finished'))
        .catch(err => {
            log4js.getLogger().error(`date = ${date} , TrackService().dailyBatchStat failed`);
            log4js.getLogger().error(`*STACK* ${err.stack}`);
        });
}));

router.patch('/batchStat', errorWrapper(async (req, res) => {

    log4js.getLogger().info( '/track/batchStat , batch start to run 😃');
    res.json({msg: 'batchStat , batch start to run 😃'});

    const departments = await new EmployeeService().getDepartments();

    const runner = async depts => {

        for (const dept of [...depts, null]) {

            try {

                const stats = await transWrapper((trx) => new TrackService().deptStat({department: dept, trx}));
                await transWrapper((trx) => new TrackStatService().deptSave({dept, stats, trx}));
                log4js.getLogger().info(`department = ${dept} , TrackService().deptStat saved`);

            } catch (err) {

                log4js.getLogger().error(`department = ${dept} , TrackService().deptStat failed`);
                log4js.getLogger().error(`*STACK* ${err.stack}`);
            }

        }
    }

    runner(departments)
        .then(() => log4js.getLogger().info('TrackService().batchStat successful finished'))
        .catch(err => {
            log4js.getLogger().error(`TrackService().batchStat failed`);
            log4js.getLogger().error(`*STACK* ${err.stack}`);
        });
}));

router.post('/', errorWrapper(async (req, res) => {
    const track = await new TrackService().add(req.body);
    res.json(track);
}));

router.get('/', errorWrapper(async (req, res) => {

    // 根據不同的 department 給出不同的資料
    const department = req.query.department;

    const getTracks = async (dept) => {
        if (dept) return await new TrackService().listByDepartment(dept);
        else return await new TrackService().list();
    };

    const tracks = await getTracks(department);
    res.json(tracks);
}));

router.get('/:id', errorWrapper(async (req, res) => {
    const track = await new TrackService().findById(req.params.id);
    res.json(track);
}));

router.patch('/:id', errorWrapper(async (req, res) => {
    const track = await new TrackService().update(req.params.id, req.body);
    res.json(track);
}));

router.delete('/:id', errorWrapper(async (req, res) => {
    const result = await new TrackService().deleteById(req.params.id);
    res.json({result, msg: 'delete success'});
}));

module.exports = router;
