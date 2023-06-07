import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { DESTINATION_ATTACHMENTS } from '../../constants/uploads.constants';
import { AttachmentDocument } from './schemas/attachment.schema';

@Injectable()
export class AttachmentsService {
  constructor(@InjectModel('attachments') private readonly attachmentModel: Model<AttachmentDocument>) {}

  async findAll() {
    return await this.attachmentModel.find({});
  }

  async findOne(id: string) {
    return await this.attachmentModel.findById(id);
  }

  async create(title: string, file: Express.Multer.File) {
    const attachments = await this.attachmentModel.find({ title });
    if (attachments.length > 0) throw new NotFoundException('Ya existe un archivo con ese nombre');
    return await this.attachmentModel.create({ title, filename: file.filename });
  }

  async update(id: string, title: string) {
    const attachments = await (await this.attachmentModel.find({ title })).filter((attachment) => !attachment._id.equals(id));
    if (attachments.length > 0) throw new NotFoundException('Ya existe un archivo con ese nombre');
    return await this.attachmentModel.findByIdAndUpdate(id, { title }, { new: true });
  }

  async remove(id: string) {
    const attachment = await this.attachmentModel.findByIdAndDelete(id);
    if (!attachment) throw new NotFoundException('No se ha encontrado el archivo');
    const filePath = join(DESTINATION_ATTACHMENTS, attachment.filename);
    await new Promise<void>((resolve, reject) => {
      fs.unlink(filePath, (error) => {
        if (error) {
        }
        resolve();
      });
    });
    return attachment;
  }
}
