import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';

export const adminUserSeed = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
        where: { email: 'admin@airquality.com' }
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = userRepository.create({
            fullName: 'System Administrator',
            email: 'admin@airquality.com',
            password: hashedPassword,
            phone: '+1234567890'
        });

        await userRepository.save(adminUser);
        console.log('Admin user created successfully');
    } else {
        console.log('Admin user already exists');
    }
};