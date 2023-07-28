import { Injectable } from '@nestjs/common';
import { UploadsFolder } from 'src/upload/enum';

interface FileObject {
  fileName: string;
  fileType: UploadsFolder;
}

@Injectable()
export class FileService {
  decodePath(encodedFilePath: string) {
    const decoded = decodeURIComponent(encodedFilePath);
    const fileObject: FileObject = JSON.parse(decoded);
    const path = `/uploads/${fileObject.fileType}/${fileObject.fileName}`;
    return path;
  }
}
