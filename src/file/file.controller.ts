import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('/:encodedFilePath')
  serveImage(
    @Param('encodedFilePath') encodedFilePath: string,
    @Res() res: Response,
  ) {
    const path = this.fileService.decodePath(encodedFilePath);

    return res.sendFile(path, { root: '.' });
  }
}
