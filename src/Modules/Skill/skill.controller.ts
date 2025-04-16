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
import { SkillCreateDto } from './DTO/SkillCreateDto';
import { SkillUpdateDto } from './DTO/SkillUpdateDto';
import { SkillService } from './skill.service';
import { ResponseMessage } from 'src/Decorator/customize';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ResponseMessage('Get skills successfully!')
  getListSkill(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
  ) {
    return this.skillService.getListSkill(page, limit, order, sort);
  }

  @Get('/all')
  @ResponseMessage('Get all skills successfully!')
  getListAllSkill() {
    return this.skillService.getListAllSkill();
  }

  @Post()
  @ResponseMessage('Create skill successfully!')
  createSkill(@Body() skill: SkillCreateDto) {
    return this.skillService.createSkill(skill);
  }

  @Get('/:id')
  @ResponseMessage('Get skill successfully!')
  getSpecialityById(@Param('id') id: number) {
    return this.skillService.getSkillById(id);
  }

  @Put('/:id')
  @ResponseMessage('Update skill successfully!')
  updateSkill(@Body() skill: SkillUpdateDto) {
    return this.skillService.updateSkill(skill);
  }

  @Delete()
  @ResponseMessage('Delete skill successfully!')
  deleteSkill(@Body('ids') ids: number[]) {
    return this.skillService.deleteSkill(ids);
  }
}
