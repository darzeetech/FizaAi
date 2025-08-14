import { ChangeEvent } from 'react';
import _isNil from 'lodash/isNil';

import { api } from '../../../../../../../utils/apiRequest';
import type { ImageObjType } from '../../../../../../../ui-component';
import type { MeasurementRevisionObj } from '.';

import { UploadButton, UploadMeasurementContainer } from './style';

type UploadImageButtonProps = {
  selectedOutfitChipIndex: number;
  setImageMeasurement: (data: Record<number, ImageObjType | null>) => void;
  imageMeasurement?: Record<number, ImageObjType | null>;
  setSelectedRevision: (data?: MeasurementRevisionObj) => void;
  setIsMeasurementUpdated: (data: boolean) => void;
  setIsLoading: (data: boolean) => void;
};

// eslint-disable-next-line
const UploadImageButton = ({
  imageMeasurement,
  selectedOutfitChipIndex,
  setImageMeasurement,
  setSelectedRevision,
  setIsMeasurementUpdated,
  setIsLoading,
}: UploadImageButtonProps) => {
  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!_isNil(e.target.files)) {
      const formData = new FormData();

      const file = e.target.files?.[0] ?? '';
      formData.append('file', file);
      formData.append('file_type', '3');

      setIsLoading(true);

      const response = await api.postRequest('storage/upload_multiple_files', formData, true);

      const { status, data } = response;

      if (status) {
        if (!_isNil(imageMeasurement)) {
          setImageMeasurement({ ...imageMeasurement, [selectedOutfitChipIndex]: data.response[0] });
        } else {
          setImageMeasurement({ [selectedOutfitChipIndex]: data.response[0] as ImageObjType });
        }
        setSelectedRevision(undefined);
        setIsMeasurementUpdated(true);
      }

      setIsLoading(false);
    }
  };

  return (
    <UploadMeasurementContainer>
      <label htmlFor="measurementPic">
        <UploadButton>Upload Image</UploadButton>
      </label>
      <input
        id="measurementPic"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="input-file"
        onInput={onUpload}
      />
    </UploadMeasurementContainer>
  );
};

export default UploadImageButton;
