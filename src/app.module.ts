import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CitiesModule } from './cities/cities.module';
import { LocationsModule } from './locations/locations.module';
import { CompaniesModule } from './companies/companies.module';
import { StationsModule } from './stations/stations.module';
import { PollutantsModule } from './pollutants/pollutants.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    CitiesModule,
    LocationsModule,
    CompaniesModule,
    StationsModule,
    PollutantsModule,
    MeasurementsModule,
    UsersModule,
    AuthModule,
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
