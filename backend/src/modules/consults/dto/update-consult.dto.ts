import { PartialType } from '@nestjs/swagger';
import { ConsultDto } from './consult.dto';

export class UpdateConsultDto extends PartialType(ConsultDto) {}
