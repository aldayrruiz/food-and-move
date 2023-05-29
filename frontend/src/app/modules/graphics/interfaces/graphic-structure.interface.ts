import { TimeData } from '@shared/components/graphic/interfaces/time-data.interface';
import { GraphicColor } from '@shared/components/graphic/types/types';

export interface GraphicStructure {
  key: string;
  color: GraphicColor;
  timeData: TimeData;
  loading: boolean;
}
