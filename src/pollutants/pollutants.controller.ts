import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PollutantsService } from './pollutants.service';
import { CreatePollutantDto } from './create-pollutant.dto';
import { UpdatePollutantDto } from './update-pollutant.dto';

@Controller('pollutants')
export class PollutantsController {
  constructor(private readonly service: PollutantsService) {}

  @Post()
  create(@Body() dto: CreatePollutantDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdatePollutantDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
