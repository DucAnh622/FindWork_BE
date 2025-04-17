import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
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

  @Get('/search')
  @Public()
  @ResponseMessage('Filter list success!')
  searchListJob(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('keyword') keyword: string,
    @Query(
      'level',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    level: string[] = [],
    @Query(
      'address',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    address: string[] = [],
    @Query(
      'step',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    step: string[] = [],
    @Query('order') order: string,
    @Query('sort') sort: 'ASC' | 'DESC',
  ) {
    return this.jobService.searchListJob(
      page,
      limit,
      keyword,
      address,
      level,
      step,
      order,
      sort,
    );
  }

  @Get('/:id')
  @Public()
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
