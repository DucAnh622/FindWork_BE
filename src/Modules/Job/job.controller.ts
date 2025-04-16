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
import { JobCreateDto } from './DTO/JobCreate';
import { JobUpdateDto } from './DTO/JobUpdate';
import { JobService } from './job.service';
import { Public, ResponseMessage } from 'src/Decorator/customize';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @ResponseMessage('Get list success!')
  @Public()
  getListJob(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('order') order: string,
  ) {
    return this.jobService.getListJob(page, limit, sort, order);
  }

  @Get()
  @ResponseMessage('Filter list success!')
  filterListJob(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('key') key: string,
    @Query('companyId') companyId: number,
    @Query('skillId') skillId: number[],
    @Query('level') level: string[],
    @Query('experience') experience: string[],
    @Query('address') address: string,
  ) {
    return this.jobService.filterListJob(
      page,
      limit,
      sort,
      key,
      companyId,
      skillId,
      level,
      experience,
      address,
    );
  }

  @Get()
  @ResponseMessage('Get list success!')
  searchListJob(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('key') key: string,
  ) {
    return this.jobService.searchListJob(page, limit, sort, key);
  }

  @Get('/:id')
  @ResponseMessage('Get list success!')
  getJobById(@Param('id') id: number) {
    return this.jobService.getJobById(id);
  }

  @Post()
  @ResponseMessage('Create job successfully!')
  createJob(@Body() job: JobCreateDto) {
    return this.jobService.createJob(job);
  }

  @Put('/:id')
  @ResponseMessage('Update job successfully!')
  updateJob(@Body() job: JobUpdateDto) {
    return this.jobService.updateJob(job);
  }

  @Delete()
  @ResponseMessage('Delete job successfully!')
  deleteJob(@Body('ids') ids: number[]) {
    return this.jobService.deleteJob(ids);
  }
}
