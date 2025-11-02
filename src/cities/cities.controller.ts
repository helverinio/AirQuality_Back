import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './create-city.dto';
import { UpdateCityDto } from './update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly service: CitiesService) {}

  @Post()
  create(@Body() dto: CreateCityDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
