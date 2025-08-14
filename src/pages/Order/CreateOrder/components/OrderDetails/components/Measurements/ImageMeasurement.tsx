import _isUndefined from 'lodash/isUndefined';

import { BulkImageUploadField } from '../../../../../../../components/FormComponents';
import { ImageObjType } from '../../../../../../../ui-component';

import type { MeasurementRevisionObj } from '.';
import { ImageMeasurementContainer } from './style';

type ImageMeasurementProps = {
  setImageMeasurement: (data: Record<number, ImageObjType | null>) => void;
  selectedOutfitChipIndex: number;
  imageMeasurement?: Record<number, ImageObjType | null>;
  setSelectedRevision: (data?: MeasurementRevisionObj) => void;
  setIsMeasurementUpdated: (data: boolean) => void;
};

const ImageMeasurement = ({
  imageMeasurement,
  selectedOutfitChipIndex,
  setImageMeasurement,
  setSelectedRevision,
  setIsMeasurementUpdated,
}: ImageMeasurementProps) => {
  if (_isUndefined(imageMeasurement) || _isUndefined(imageMeasurement[selectedOutfitChipIndex])) {
    return null;
  }

  return (
    <ImageMeasurementContainer>
      <BulkImageUploadField
        label="Upload Measurement"
        placeholder="Upload Measurement"
        type="file"
        required={false}
        multiple={false}
        maxUpload={1}
        value={imageMeasurement[selectedOutfitChipIndex] ?? undefined}
        onChange={(value) => {
          setImageMeasurement({
            ...imageMeasurement,
            [selectedOutfitChipIndex]: value as ImageObjType,
          });

          setIsMeasurementUpdated(true);

          setSelectedRevision(undefined);
        }}
      />
    </ImageMeasurementContainer>
  );
};

export default ImageMeasurement;
