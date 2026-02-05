const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@codetunisie.com';
        const adminPassword = 'adminpassword123';

        let user = await User.findOne({ email: adminEmail });

        if (user) {
            user.role = 'admin';
            user.password = adminPassword; // Update password just in case
            await user.save();
            console.log('✅ Utilisateur existant mis à jour en tant qu\'ADMIN.');
        } else {
            user = await User.create({
                name: 'Administrateur',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                phone: '00000000'
            });
            console.log('✅ Nouvel utilisateur ADMIN créé.');
        }

        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Mot de passe: ${adminPassword}`);

        process.exit();
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

createAdmin();
