import { Injectable } from '@nestjs/common';
import { UploadsFolder } from './enum';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  async saveFile(uploadType: UploadsFolder, file: Express.Multer.File) {
    try {
      // Root uploads Folder + upload type folder
      const uploadsPath = path.join('uploads', uploadType);
      // If upload type folder doesnt exist it creates it
      if (!fs.existsSync(uploadsPath)) {
        await fs.promises.mkdir(uploadsPath, { recursive: true, mode: 0o755 });
      }
      // generating file name
      const fileExt = path.extname(file.originalname);
      const fileId = randomUUID();
      const fileName = `${fileId}${fileExt}`;
      const filePath = path.join(uploadsPath, fileName);
      // saving file
      await fs.promises.writeFile(filePath, file.buffer, { mode: 0o644 });
      const fileObject = {
        fileName,
        fileType: uploadType,
      };
      const encode = encodeURIComponent(JSON.stringify(fileObject));
      // return filename to parent service logic
      return encode;
    } catch (error) {
      throw error;
    }
  }
  async removeFile(uploadType: UploadsFolder, encoded: string) {
    try {
      // Root uploads Folder + upload type folder
      const fileObject = JSON.parse(decodeURIComponent(encoded));
      const uploadsPath = path.join('uploads', uploadType, fileObject.fileName);
      await fs.promises.unlink(uploadsPath);
      // saving file
      // return filename to save in user and do;
    } catch (error) {
      throw error;
    }
  }
}
