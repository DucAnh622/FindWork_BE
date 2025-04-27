import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public, ResponseMessage } from 'src/Decorator/customize';
import { SpecialityService } from './speciality.service';
import { SpecialityUpdateDTO } from './DTO/SpecialityUpdateDTO';
import { SpecialityCreateDTO } from './DTO/SpecialityCreateDTO';

@Controller('specialities')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Get()
  @ResponseMessage('Get speciality successfully!')
  @Public()
  getListSpeciality(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: string,
    @Query('sort') sort: string,
  ) {
    return this.specialityService.getListSpeciality(page, limit, order, sort);
  }

  @Get('/all')
  @Public()
  @ResponseMessage('Get all speciality successfully!')
  getListAllSpeciality() {
    return this.specialityService.getListAllSpeciality();
  }

  @Get('/:id')
  @ResponseMessage('Get speciality successfully!')
  getSpecialityById(@Param('id') id: number) {
    return this.specialityService.getSpecialityById(id);
  }

  @Post()
  @ResponseMessage('Create speciality successfully!')
  createSpeciality(@Body() speciality: SpecialityCreateDTO) {
    return this.specialityService.createSpeciality(speciality);
  }

  @Put('/:id')
  @ResponseMessage('Update speciality successfully!')
  updateSpeciality(@Body() speciality: SpecialityUpdateDTO) {
    return this.specialityService.updateSpeciality(speciality);
  }

  @Delete()
  @ResponseMessage('Delete speciality successfully!')
  deleteSpeciality(@Body('ids') ids: number[]) {
    return this.specialityService.deleteSpeciality(ids);
  }
}
