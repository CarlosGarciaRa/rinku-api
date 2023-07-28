import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as request from 'supertest';
import { UploadService } from 'src/upload/upload.service';
import { UploadsFolder } from 'src/upload/enum';

describe('ProjectController Int', () => {
  let app: INestApplication;
  let uploadService: UploadService;
  let fileNameGlobal: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    uploadService = moduleRef.get(UploadService);
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (fileNameGlobal) {
      await uploadService.removeFile(UploadsFolder.Test, fileNameGlobal);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('fetch file', () => {
    it('should fetch a profile picture', async () => {
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
      const response = await request(app.getHttpServer()).get(
        `/file/${encoded}`,
      );

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('image'); // Verificar que la respuesta es una imagen
      // expect(response.headers['content-disposition']).toContain(encoded); // Verificar que el nombre del archivo se encuentra en el encabezado
    });
  });
});
