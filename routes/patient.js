const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const router = require('express').Router();
const {
    Patient,
    validatePatient,
    PatientLogin
} = require('../models/patient');
const {
    verifyToken
} = require('../auth/auth');
const {
    Prescription
} = require('../models/prescription');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/login', async (req, res) => {
    let patient = await PatientLogin.findOne({
        patientId: req.body.patientId
    });

    if (!patient) return res.status(400).send('Invalid Patient Id / Password.');

    const validPassword = await bcrypt.compare(req.body.password, patient.password);
    if (!validPassword) return res.status(400).send('Invalid Patient Id or Password.');

    const token = jwt.sign({
        patientId: patient.patientId,
        patientName: patient.name,
        profile: patient.profile
    }, 'jwtPrivateKey');

    return res.status(200).send({
        token: token
    });
});

router.post('/add-patient', async (req, res) => {
    const {
        error
    } = validatePatient(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let patient = new Patient(_.pick(req.body,
        ['patientId', 'name', 'gender', 'dateAdmitted', 'dateDischarged', 'address', 'phoneNo']
    ));
    await patient.save();

    let user = await PatientLogin.findOne({
        patientId: req.body.patientId
    });

    if (!user) {
        let password = generator.generate({
            length: 10,
            numbers: true
        });
        user = new PatientLogin({
            patientId: req.body.patientId,
            password: password,
            name: req.body.name
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        let pno = '+91';
        pno = pno + _.pick(req.body, ['phoneNo']).phoneNo;

        const body = `Welcome to DocHub.COM, Login to your account with user id: ${req.body.patientId} and password: ${password}`;

        client.messages
            .create({
                body: body,
                from: process.env.MY_PHONE_NUMBER,
                to: pno
            })
            .then(message => console.log(message.sid));
    }

    return res.status(200).send({
        message: 'Patient record added successfully.'
    });
});

router.get('/search-patient/:patientId', verifyToken, async (req, res) => {
    console.log(req.user);

    let patient = await Patient.findOne({
        patientId: req.params.patientId
    }).select({
        name: 1,
        gender: 1
    });

    if (!patient) return res.status(400).json('No patient found with the given Id.');

    return res.status(200).json(patient);
});


router.post('/add-prescription', verifyToken, async (req, res) => {
    let prescription = new Prescription({
        doctorId: req.user.doctorId,
        doctorName: req.user.name,
        doctorEmail: req.user.email,
        patientId: req.body.patientId,
        prescription: req.body.prescription
    });

    await prescription.save();

    return res.status(200).json({
        message: 'success'
    });
});

router.get('/get-prescription/:patientId', verifyToken, async (req, res) => {
    const prescriptions = await Prescription.find({
        patientId: req.params.patientId
    });

    if (!prescriptions.length) return res.status(400).json({
        message: 'No prescription found.'
    });

    return res.status(200).json(prescriptions);
});

module.exports = router;