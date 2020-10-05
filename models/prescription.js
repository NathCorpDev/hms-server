const mongoose = require('mongoose');
const Joi = require('joi');

const Prescription = mongoose.model('Prescription', new mongoose.Schema({
    doctorId: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorEmail: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        required: true
    },
    prescription: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        noOfDays: {
            type: String,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now()
    }
}));

// function validatePrescription(payload) {
//     const schema = Joi.object({
//         doctorId: Joi.string().required(),
//         doctorName: Joi.string().required(),
//         patientId: Joi.string().required(),
//         prescription: Joi.object({})
//     });

//     return schema.validate(doctor);
// }

exports.Prescription = Prescription;
//exports.validateDoctor = validateDoctor;