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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyCreate } from './DTO/CompanyCreate';
import { CompanyUpdate } from './DTO/CompanyUpdate';
import { Public, ResponseMessage } from 'src/Decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('search')
  @Public()
  @ResponseMessage('Search companies successfully!')
  searchListCompany(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('order') order: string,
    @Query('keyword') keyword: string,
    @Query('specialityId') specialityId: number,
    @Query(
      'address',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    address: string[] = [],
  ) {
    return this.companyService.searchListCompany(
      page,
      limit,
      keyword,
      order,
      sort,
      specialityId,
      address,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ResponseMessage('Create companies successfully!')
  createCompany(
    @Body() companyCreate: CompanyCreate,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.companyService.createCompany(companyCreate, image);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ResponseMessage('Update companies successfully!')
  updateCompany(
    @Body() companyUpdate: CompanyUpdate,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.companyService.updateCompany(companyUpdate, image);
  }

  @Get('/:id')
  @Public()
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
