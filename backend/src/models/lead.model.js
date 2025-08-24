import mongoose, { Schema } from 'mongoose';

const leadsSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String, //leading zeros will be lost if number
        required: true
    },
    company: {  
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'lost', 'won'],
        default: 'new'
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    lead_value: {
        type: Number,
        default: 0
    },
    last_activity_at: {
        type: Date,
        default: null
    },
    is_qualified: {
        type: Boolean,
        default: false
    }
});

leadsSchema.set('timestamps',true);

const Lead = mongoose.model("Lead", leadsSchema);
export default Lead;
