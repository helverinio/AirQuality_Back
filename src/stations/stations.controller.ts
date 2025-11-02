import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './create-station.dto';
import { UpdateStationDto } from './update-station.dto';

@Controller('stations')
export class StationsController {
  constructor(private readonly service: StationsService) {}

  @Post()
  create(@Body() dto: CreateStationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStationDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
