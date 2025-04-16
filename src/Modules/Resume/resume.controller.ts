import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { ResumeCreateDto } from './DTO/ResumeCreateDto';
import { ResumeUpdateDto } from './DTO/ResumeUpdateDto';
import { ResumeService } from './resume.service';
import { ResponseMessage } from 'src/Decorator/customize';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  @ResponseMessage('Get resumes successfully!')
  getListResume(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('order') order: string,
  ) {
    return this.resumeService.getListResume(page, limit, sort, order);
  }

  @Get('personal')
  @ResponseMessage('Get resumes successfully!')
  getListResumeByUserId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('order') order: string,
    @Request() req,
  ) {
    return this.resumeService.getListResumeByUserId(
      page,
      limit,
      sort,
      order,
      req.user,
    );
  }

  @Get()
  @ResponseMessage('Get resumes successfully!')
  getListResumeByJobId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: string,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('id') id: number,
  ) {
    return this.resumeService.getListResumeByJobId(
      page,
      limit,
      sort,
      order,
      id,
    );
  }

  @Get()
  @ResponseMessage('Get resumes successfully!')
  getListResumeByStatus(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: string,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('status') status: string,
  ) {
    return this.resumeService.getListResumeByStatus(
      page,
      limit,
      sort,
      order,
      status,
    );
  }

  @Get('/:id')
  @ResponseMessage('Get resume successfully!')
  getResumeById(@Param('id') id: number) {
    return this.resumeService.getResumeById(id);
  }

  @Post()
  @ResponseMessage('Create resume successfully!')
  createResume(@Request() req, @Body() resume: ResumeCreateDto) {
    return this.resumeService.createResume(req.user, resume);
  }

  @Put()
  @ResponseMessage('Update resume successfully!')
  updateResume(@Body() resume: ResumeUpdateDto) {
    return this.resumeService.updateResume(resume);
  }

  @Delete()
  @ResponseMessage('Delete resume successfully!')
  deleteResume(@Body('ids') ids: number[]) {}
}
