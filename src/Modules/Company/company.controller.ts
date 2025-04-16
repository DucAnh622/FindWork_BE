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
import { CompanyService } from './company.service';
import { CompanyCreate } from './DTO/CompanyCreate';
import { CompanyUpdate } from './DTO/CompanyUpdate';
import { Public, ResponseMessage } from 'src/Decorator/customize';

@Controller('/companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('')
  @Public()
  @ResponseMessage('Get companies successfully!')
  getListCompany(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('order') order: string,
  ) {
    return this.companyService.getListCompany(page, limit, order, sort);
  }

  @Get('all')
  @ResponseMessage('Get all companies successfully!')
  getListAllCompany() {
    return this.companyService.getListAllCompany();
  }

  @Get('')
  @Public()
  @ResponseMessage('Search companies successfully!')
  searchListCompany(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('key') key: string,
    @Query('address') address: string,
  ) {
    return this.companyService.searchListCompany(
      page,
      limit,
      sort,
      key,
      address,
    );
  }

  @Post('')
  @ResponseMessage('Create companies successfully!')
  createCompany(@Body() companyCreate: CompanyCreate) {
    return this.companyService.createCompany(companyCreate);
  }

  @Put('/:id')
  @ResponseMessage('Update companies successfully!')
  updateCompany(@Body() companyUpdate: CompanyUpdate) {
    return this.companyService.updateCompany(companyUpdate);
  }

  @Get('/:id')
  @ResponseMessage('Get company successfully!')
  getByIdCompany(@Param('id') id: number) {
    return this.companyService.getByIdCompany(id);
  }

  @Delete()
  @ResponseMessage('Delete company successfully!')
  deleteCompany(@Body('ids') ids: number[]) {
    return this.companyService.deleteCompany(ids);
  }
}
