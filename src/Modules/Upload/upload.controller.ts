import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './configFile';
import { CloudinaryService } from './cloudinary.service';
import { Express } from 'express';
import { Public, ResponseMessage } from 'src/Decorator/customize';

@Controller('upload')
@Public()
@ResponseMessage('Upload success!')
export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload-cloud')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: 'No file provided' };
    }

    try {
      const result = await this.cloudinaryService.uploadFile(file.buffer);
      return {
        message: 'File uploaded successfully!',
        url: result.secure_url,
      };
    } catch (error) {
      return {
        message: 'Error uploading file',
        error: error.message,
      };
    }
  }
}
