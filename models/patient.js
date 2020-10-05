const mongoose = require('mongoose');
const Joi = require('joi');

const PatientLogin = mongoose.model('PatientLogin', new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: 'Patient'
    }
}));


const Patient = mongoose.model('Patient', new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateAdmitted: {
        type: String,
        required: true
    },
    dateDischarged: {
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
    }
}));

function validatePatient(patient) {
    const schema = Joi.object({
        patientId: Joi.string().required(),
        name: Joi.string().required(),
        gender: Joi.string().required(),
        dateAdmitted: Joi.string().required(),
        dateDischarged: Joi.string().required(),
        address: Joi.string().required(),
        phoneNo: Joi.number().required()
    });

    return schema.validate(patient);
}

exports.Patient = Patient;
exports.validatePatient = validatePatient;
exports.PatientLogin = PatientLogin;