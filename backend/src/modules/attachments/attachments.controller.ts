import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { AttachmentStorage, MAX_SIZE_ATTACHMENT } from '../../constants/uploads.constants';
import { AttachmentsService } from './attachments.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get('findOne/:id')
  async findOne(@Param('id') id: string) {
    return await this.attachmentsService.findOne(id);
  }

  @Get('findAll/')
  async findAll() {
    return await this.attachmentsService.findAll();
  }

  @Post('create/:title')
  @UseInterceptors(FileInterceptor('file', AttachmentStorage))
  async create(
    @Param('title') title: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_SIZE_ATTACHMENT }), new FileTypeValidator({ fileType: 'application/pdf' })],
      })
    )
    file: Express.Multer.File
  ) {
    return await this.attachmentsService.create(title, file);
  }

  @Patch('update/:id/:title')
  async update(@Param('id') id: string, @Param('title') title: string) {
    return await this.attachmentsService.update(id, title);
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.attachmentsService.remove(id);
  }
}
