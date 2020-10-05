const mongoose = require('mongoose');
const Joi = require('joi');

const Doctor = mongoose.model('Doctor', new mongoose.Schema({
    doctorId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    highestQualification: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: 'Doctor'
    }
}));

function validateDoctor(doctor) {
    const schema = Joi.object({
        doctorId: Joi.string().required(),
        name: Joi.string().required(),
        highestQualification: Joi.string().required(),
        specialization: Joi.string().required(),
        email: Joi.string().required(),
        gender: Joi.string().required(),
        phoneNo: Joi.number().required(),
        password: Joi.string().required()
    });

    return schema.validate(doctor);
}

exports.Doctor = Doctor;
exports.validateDoctor = validateDoctor;