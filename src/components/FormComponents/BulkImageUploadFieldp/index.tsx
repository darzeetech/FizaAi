import { useState, type ChangeEvent, useEffect } from 'react';
import _isNil from 'lodash/isNil';
import _isUndefined from 'lodash/isUndefined';

import { api } from '../../../utils/apiRequest';
import { Loader } from '../../../ui-component';
import ImageUploadp from '../../../ui-component/ImageUploadp/index';

type BulkImageUploadFieldProps = {
  label?: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  value?: Array<Record<string, string>> | Record<string, string>;
  accept?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  errorMessage?: string;
  maxUpload?: number;
  onChange?: (imgUrl: Array<Record<string, string>> | Record<string, string>) => void;
  fileTypeRequired?: boolean;
  updateInfoInParent?: (obj: Record<string, any>) => void;
};

const BulkImageUploadFieldp = (props: BulkImageUploadFieldProps) => {
  const {
    required = false,
    maxUpload = 1,
    multiple = true,
    fileTypeRequired = true,
    value,
    onChange,
    updateInfoInParent,
    ...rest
  } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showLocalLoader = _isNil(updateInfoInParent);

  useEffect(() => {
    if (typeof updateInfoInParent === 'function') {
      updateInfoInParent({
        isLoading,
      });
    }
  }, [isLoading]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const filesLength = !_isNil(e.target.files)
      ? Array.from({ length: e.target.files.length ?? 0 }, (_, i) => i)
      : [];

    let currentValue: Array<Record<string, string>> = [];

    if (!_isNil(e.target.files)) {
      const formData = new FormData();

      filesLength.forEach(async (i: number) => {
        const file = e.target.files?.[i] ?? '';
        formData.append('file', file);
      });

      if (fileTypeRequired) {
        formData.append('file_type', '3');
      }

      e.target.value = '';

      setIsLoading(true);
      const response = await api.postRequest('storage/upload_multiple_files', formData, true);

      const { status, data } = response;

      if (status && !_isUndefined(onChange)) {
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

    if (required) {
      if (value?.length === 0) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handleDeleteImage = (reference_id: string) => {
    let updatedValue = multiple ? [] : {};

    if (multiple && Array.isArray(value)) {
      updatedValue = value?.filter((url) => url.reference_id !== reference_id) ?? [];
    }

    if (!_isUndefined(onChange)) {
      onChange(updatedValue);
    }
  };

  return (
    <>
      <ImageUploadp
        required={required}
        multiple={multiple}
        maxUpload={maxUpload}
        value={value}
        errorMessage={errorMessage}
        onUpload={handleUpload}
        handleDeleteImage={handleDeleteImage}
        {...rest}
      />
      {showLocalLoader && <Loader showLoader={isLoading} />}
    </>
  );
};

export default BulkImageUploadFieldp;
