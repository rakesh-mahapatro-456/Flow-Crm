// seedLeads.js
import mongoose from 'mongoose';
import Lead from '../models/lead.model.js'; // adjust path if needed
import { faker } from '@faker-js/faker';

const MONGO_URI ="mongodb+srv://rakeshmahapatro85:qPhA7oGbZ0rt3vlq@cluster0.ppqanjt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Helper arrays for enum fields
const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];

// Generate a random lead
const generateLead = () => {
    return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number('##########'), // 10-digit number
        company: faker.company.name(),
        city: faker.address.city(),
        state: faker.address.state(),
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 101), // 0-100
        lead_value: parseFloat((Math.random() * 10000).toFixed(2)), // 0-10000
        last_activity_at: faker.date.recent(30), // last 30 days
        is_qualified: faker.datatype.boolean()
    };
};

// Seed function
const seedLeads = async () => {
    try {
        await Lead.deleteMany({}); 
        const leads = [];

        for (let i = 0; i < 150; i++) {
            leads.push(generateLead());
        }

        await Lead.insertMany(leads);
        console.log('150 leads inserted successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding leads:', err);
    }
};

seedLeads();
