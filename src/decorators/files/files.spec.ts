import { IsFileType, MaxFileSize } from './index';
import { validate } from 'class-validator';

describe('IsFileType Decorator', () => {
  class TestClass {
    @IsFileType(['image/jpeg', 'image/png'])
    file: Express.Multer.File;
  }

  it('should validate when the file type is allowed', async () => {
    const instance = new TestClass();
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1234,
      destination: '/path/to/destination',
      filename: 'test.jpg',
      path: '/path/to/destination/test.jpg',
      buffer: Buffer.from([]),
      stream: null,
    };
    instance.file = file;

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should not validate when the file type is not allowed', async () => {
    const instance = new TestClass();
    const file: Express.Multer.File = {
      fieldname: 'resumeFile',
      originalname: 'test.gif',
      encoding: '7bit',
      mimetype: 'image/gif',
      size: 5678,
      destination: '/path/to/destination',
      filename: 'test.gif',
      path: '/path/to/destination/test.gif',
      buffer: Buffer.from([]),
      stream: null,
    };
    instance.file = file;

    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('MaxFileSize Decorator', () => {
  class TestClass {
    @MaxFileSize(1024)
    file: Express.Multer.File;
  }

  it('should validate when the file size is less', async () => {
    const instance = new TestClass();
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 888,
      destination: '/path/to/destination',
      filename: 'test.jpg',
      path: '/path/to/destination/test.jpg',
      buffer: Buffer.from([]),
      stream: null,
    };
    instance.file = file;

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should not validate when the size is more', async () => {
    const instance = new TestClass();
    const file: Express.Multer.File = {
      fieldname: 'resumeFile',
      originalname: 'test.gif',
      encoding: '7bit',
      mimetype: 'image/gif',
      size: 5678,
      destination: '/path/to/destination',
      filename: 'test.gif',
      path: '/path/to/destination/test.gif',
      buffer: Buffer.from([]),
      stream: null,
    };
    instance.file = file;

    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });
});
