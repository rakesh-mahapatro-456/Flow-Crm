import Joi from "joi";

export const leadValidationSchema = Joi.object({
  first_name: Joi.string()
    .min(1)
    .max(50)
    .required(),

  last_name: Joi.string()
    .min(1)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .pattern(/^\d+$/) // only digits
    .required(),

  company: Joi.string()
    .min(1)
    .max(100)
    .required(),

  city: Joi.string()
    .required(),

  state: Joi.string()
    .required(),

  source: Joi.string()
    .valid('website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other')
    .required(),

  status: Joi.string()
    .valid('new', 'contacted', 'qualified', 'lost', 'won')
    .default('new'),

  score: Joi.number()
    .min(0)
    .max(100)
    .default(0),

  lead_value: Joi.number()
    .min(0)
    .default(0),

  last_activity_at: Joi.date()
    .allow(null)
    .optional(),

  is_qualified: Joi.boolean()
    .default(false)
});

