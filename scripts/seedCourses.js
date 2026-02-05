require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const coursesMockData = require('../data/coursesData');

const seedCourses = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Option: Clear existing courses to avoid duplicates
        // Comment this out if you want to append instead
        await Course.deleteMany({ isPublished: true });
        console.log('Cleared existing courses.');

        // Prepare data
        const coursesToInsert = coursesMockData.map(course => ({
            ...course,
            isPublished: true,
            viewCount: Math.floor(Math.random() * 1000),
            completionCount: Math.floor(Math.random() * 500)
        }));

        // Insert new courses
        await Course.insertMany(coursesToInsert);
        console.log(`Successfully seeded ${coursesToInsert.length} courses!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
};

seedCourses();
