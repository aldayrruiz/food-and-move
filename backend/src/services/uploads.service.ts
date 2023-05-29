import { Injectable } from '@nestjs/common';
import fs = require('fs');

@Injectable()
export class UploadsService {
  async removeProfileImage(filename: string) {
    await fs.unlink('../../uploads/profileimages/' + filename, (err) => {
      if (err) {
        console.log(err);
        return err;
      }
    });
  }
}
