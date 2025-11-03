import { DataSource } from 'typeorm';
import { adminUserSeed } from './seeds/admin-user.seed';

const runSeeds = async () => {
    try {
        const dataSource = new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '1234',
            database: 'airquality',
            entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: false,
        });

        await dataSource.initialize();
        console.log('Connected to database');

        await adminUserSeed(dataSource);
        
        await dataSource.destroy();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error running seeds:', error);
        process.exit(1);
    }
};

runSeeds();