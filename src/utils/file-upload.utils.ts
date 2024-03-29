import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

// Allow only images
export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif|doc|docx|xls|xlsx|pdf|PDF|mp3|mp4|zip|pptx|stl|dicom)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req: any, file: any, callback: any) => {
  //console.log("request ", req.params);
  const { id, group } = req.params;
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(10)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  callback(null, `${id}-${group}-${randomName}${fileExtName}`);
};