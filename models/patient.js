const mongoose = require('mongoose');
const Joi = require('joi');

const AdmitPatient = mongoose.model('AdmitPatient', new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    dateAdmitted: {
        type: String,
        required: true
    },
    dateDischarged: {
        type: String,
    },
    reasonForAdmitting: {
        type: String,
        required: true
    },
    testsPrescribed: {
        type: String,
    }
}));


const Patient = mongoose.model('Patient', new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    profile: {
        type: String,
        default: 'Patient'
    },
    password: {
        type: String,
        required: true
    }
}));

function validatePatient(patient) {
    const schema = Joi.object({
        name: Joi.string().required(),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        phoneNo: Joi.number().required()
    });

    return schema.validate(patient);
}

function validateAdmissionDetails(admissionDetails) {
    const schema = Joi.object({
        patientId: Joi.string().required(),
        patientName: Joi.string().required(),
        age: Joi.string().required(),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        phoneNo: Joi.number().required(),
        dateAdmitted: Joi.string().required(),
        dateDischarged: Joi.string().empty(''),
        reasonForAdmitting: Joi.string().required(),
        testsPrescribed: Joi.string().empty('')
    });
    return schema.validate(admissionDetails);
}

exports.Patient = Patient;
exports.validatePatient = validatePatient;
exports.AdmitPatient = AdmitPatient;
exports.validateAdmissionDetails = validateAdmissionDetails;