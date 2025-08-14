import { useState } from 'react';
import _isNil from 'lodash/isNil';
import _isUndefined from 'lodash/isUndefined';

import { api } from '../../../utils/apiRequest';
import { AudioRecord, AudioRecordProps, Loader } from '../../../ui-component';

type AudioRecordFieldProps = Omit<AudioRecordProps, 'onUpload' | 'handleDeleteAudio'> & {
  onChange?: (imgUrl: Array<Record<string, string>> | Record<string, string>) => void;
};

const AudioRecordField = (props: AudioRecordFieldProps) => {
  const { required = false, maxUpload = 1, multiple = false, value, onChange, ...rest } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (audioFile: Blob) => {
    let currentValue: Array<Record<string, string>> = [];

    if (!_isNil(audioFile)) {
      const formData = new FormData();

      formData.append('file_type', '2');
      formData.append('file', audioFile);

      setIsLoading(true);
      const response = await api.postRequest('storage/upload_multiple_files', formData, true);

      const { status, data } = response;

      if (status && typeof onChange === 'function') {
        currentValue = data.response;

        if (multiple) {
          onChange(
            _isUndefined(value)
              ? currentValue.slice(0, maxUpload)
              : Array.isArray(value)
                ? [...value, ...currentValue].slice(0, maxUpload)
                : [value, ...currentValue].slice(0, maxUpload)
          );
        } else if (!Array.isArray(value)) {
          onChange(currentValue.length > 0 ? currentValue[0] : {});
        }
      }

      setIsLoading(false);
    }

    if (required && Array.isArray(value)) {
      if (value?.length === 0) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handleDeleteAudio = (reference_id: string) => {
    let updatedValue = multiple ? [] : {};

    if (multiple && Array.isArray(value)) {
      updatedValue = value?.filter((url) => url.reference_id !== reference_id) ?? [];
    }

    if (typeof onChange === 'function') {
      onChange(updatedValue);
    }
  };

  return (
    <>
      <AudioRecord
        required={required}
        multiple={multiple}
        maxUpload={maxUpload}
        value={value}
        errorMessage={errorMessage}
        onUpload={handleUpload}
        handleDeleteAudio={handleDeleteAudio}
        {...rest}
      />
      <Loader showLoader={isLoading} />
    </>
  );
};

export default AudioRecordField;
