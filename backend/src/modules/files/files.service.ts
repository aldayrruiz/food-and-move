import { Injectable } from '@nestjs/common';
import { DEFAULT_PROFILE_IMAGE, DESTINATION_PROFILE_IMAGE } from 'src/constants/uploads.constants';
import fs = require('fs');

@Injectable()
export class FilesService {
  async removeProfileImage(filename?: string) {
    if (filename) {
      await fs.unlink(this.getPathProfileImage(filename), (err) => {});
    }
  }

  async getProfileImage(filename: string): Promise<string> {
    if (await this.checkProfileImageExists(filename)) return filename;
    return DEFAULT_PROFILE_IMAGE;
  }

  async checkProfileImageExists(filename: string): Promise<boolean> {
    try {
      await fs.promises.access(this.getPathProfileImage(filename));
      return true;
    } catch (error) {
      return false;
    }
  }

  getPathProfileImage(filename: string): string {
    return DESTINATION_PROFILE_IMAGE + '/' + filename;
  }
}
