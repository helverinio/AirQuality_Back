import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './create-alert.dto';
import { UpdateAlertDto } from './update-alert.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) {}

    @Post()
    create(@Body() createAlertDto: CreateAlertDto) {
        return this.alertsService.create(createAlertDto);
    }

    @Get()
    findAll() {
        return this.alertsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.alertsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
        return this.alertsService.update(+id, updateAlertDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.alertsService.remove(+id);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.alertsService.markAsRead(+id);
    }
}