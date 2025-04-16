import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('PASS_CLOUD_ONE'),
      api_key: this.configService.get<string>('PASS_CLOUD_TWO'),
      api_secret: this.configService.get<string>('PASS_CLOUD_THREE'),
    });
  }

  async uploadFile(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'Library',
          resource_type: 'auto',
          type: 'upload',
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('No result'));
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
}
