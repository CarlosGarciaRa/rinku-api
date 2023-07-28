import { Test, TestingModule } from '@nestjs/testing';
import { UploadsFolder } from './enum';
import { UploadService } from './upload.service';
import * as fs from 'fs';
import * as path from 'path';

describe('upload file service', () => {
  let uploadService: UploadService;
  let fileNameGlobal: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    uploadService = module.get<UploadService>(UploadService);
  });
  it('create folder uploads/test and upload file', async () => {
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1233,
      destination: '/path/to/destination',
      filename: 'test.jpg',
      path: '/path/to/destination/test.jpg',
      buffer: Buffer.from([]),
      stream: null,
    };
    const encoded = await uploadService.saveFile(UploadsFolder.Test, file);
    fileNameGlobal = encoded;
    const decoded = decodeURIComponent(encoded);
    const fileObject = JSON.parse(decoded);

    const fileName = fileObject.fileName;
    const filePath = path.join('uploads', UploadsFolder.Test, fileName);
    expect(fileName).toBeDefined();
    expect(typeof fileName).toEqual('string');
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fileName.endsWith('jpg')).toBe(true);
  });

  it('should delete file', async () => {
    const filePath = path.join('uploads', UploadsFolder.Test, fileNameGlobal);
    await uploadService.removeFile(UploadsFolder.Test, fileNameGlobal);
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
