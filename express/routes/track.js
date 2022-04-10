const router = require('express').Router();
const TrackService = require('../service/track');
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
