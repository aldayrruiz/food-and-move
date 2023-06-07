import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DESTINATION_ATTACHMENTS, DESTINATION_PROFILE_IMAGE } from 'src/constants/uploads.constants';
import { FilesService } from './files.service';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('profile-image/:filename?')
  async getProfileImage(@Param('filename') filename?: string, @Res() res?) {
    const imagename = await this.filesService.getProfileImage(filename);
    return res.sendFile(imagename, { root: DESTINATION_PROFILE_IMAGE });
  }

  @Get('attachment/:filename')
  async getAttachment(@Param('filename') filename: string, @Res() res?) {
    return res.sendFile(filename, { root: DESTINATION_ATTACHMENTS });
  }
}
