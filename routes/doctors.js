const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const {
    Doctor,
    validateDoctor
} = require('../models/doctor');

const {
    verifyToken,
    isAdmin,
    isDoctor,
    isPatient
} = require('../auth/auth');

router.post('/add', async (req, res) => {
    const {
        error
    } = validateDoctor(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let doctor = await Doctor.findOne({
        email: req.body.email
    });

    if (doctor) return res.status(400).send('Doctor with the given email already exist.');

    doctor = new Doctor(_.pick(req.body,
        ['doctorId', 'name', 'highestQualification', 'specialization', 'email', 'gender', 'phoneNo', 'password']
    ));
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(doctor.password, salt);
    await doctor.save();
    return res.status(200).send({
        message: 'Doctor record added successfully.'
    });
});

router.get('/isDoctor', [verifyToken, isDoctor], async (req, res) => {
    console.log('1');
    return res.status(200).send(true);
});

router.post('/login', async (req, res) => {
    let doctor = await Doctor.findOne({
        email: req.body.email
    });

    if (!doctor) return res.status(400).send('Invalid email/password.');

    const validPassword = await bcrypt.compare(req.body.password, doctor.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({
        doctorId: doctor.doctorId,
        email: doctor.email,
        name: doctor.name,
        profile: doctor.profile
    }, 'jwtPrivateKey');

    return res.status(200).send({
        token: token
    });
});

module.exports = router;