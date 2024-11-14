const Joi = require('joi');

exports.signupschema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ['com', 'net']}}).required(),
    password: Joi.string().required(),
})