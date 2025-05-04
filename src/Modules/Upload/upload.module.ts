import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [UploadService, CloudinaryService],
  controllers: [],
  exports: [CloudinaryService],
})
export class UploadModule {}
