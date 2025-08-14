import { useRef, type ChangeEvent, useState } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _isNil from 'lodash/isNil';

import { CrossIcon, ImageUploadIcon } from '../../assets/icons';

import Text from '../Text';
import Modal, { ModalMethods } from '../Modal';

import { ImageUploadContainer, LabelContainer, HelpText, ImgModalBody } from './style';

export type ImageObjType = {
  reference_id: string;
  short_lived_url: string;
};

export type ImageUploadProps = {
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
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: (imgUrl: string) => void;
};

const ImageUpload = (props: ImageUploadProps) => {
  const {
    label = '',
    className = '',
    type = 'file',
    value = [],
    multiple = false,
    maxUpload = 1,
    disabled = false,
    required = false,
    accept = 'image/png, image/jpeg, image/jpg',
    errorMessage = '',
    onUpload,
    handleDeleteImage,
    ...rest
  } = props;

  const imgRef = useRef<ModalMethods>(null);
  const [imgUrlForModal, setImgUrlForModal] = useState<string>();

  const hasError = !_isEmpty(errorMessage);

  const showAddImage =
    !disabled && (multiple && _isArray(value) ? value.length < maxUpload : _isEmpty(value));

  const handleOpenImgModal = (url: string) => {
    setImgUrlForModal(url);

    imgRef.current?.show();
  };

  return (
    <ImageUploadContainer className={className}>
      {!_isEmpty(label) && (
        <>
          <LabelContainer>
            <Text color="black" fontWeight={500}>
              {label}
            </Text>
            {required && (
              <Text color="black" className="mandatory">
                *
              </Text>
            )}
          </LabelContainer>
          <HelpText size="small">{`You can upload maximum ${maxUpload} pictures.`}</HelpText>
        </>
      )}

      <div className="imgaes-container">
        {showAddImage && (
          <div>
            <input
              id="file"
              disabled={disabled}
              type={type}
              multiple={multiple}
              accept={accept}
              {...rest}
              onInput={onUpload}
              className="input-file"
            />
            <label htmlFor="file" className="input-label">
              <ImageUploadIcon />
            </label>
          </div>
        )}

        {_isArray(value) &&
          value.length > 0 &&
          value.map((currentImage) => (
            <div key={currentImage.reference_id} className="imgae-wrapper">
              <img
                className="images"
                src={currentImage.short_lived_url}
                alt="imgaes"
                onClick={() => handleOpenImgModal(currentImage.short_lived_url)}
              />
              {!disabled && (
                <div
                  className="cross-icon-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(currentImage.reference_id);
                  }}
                >
                  <CrossIcon />
                </div>
              )}
            </div>
          ))}

        {!_isArray(value) && !_isNil(value) && !_isEmpty(value) && (
          <div className="imgae-wrapper">
            <img
              className="images"
              src={value.short_lived_url}
              alt="imgaes"
              onClick={() => handleOpenImgModal(value.short_lived_url)}
            />
            {!disabled && (
              <div
                className="cross-icon-container"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(value.reference_id);
                }}
              >
                <CrossIcon />
              </div>
            )}
          </div>
        )}
        {disabled && (_isNil(value) || _isEmpty(value)) && <Text>No Image Uploaded</Text>}
      </div>

      {hasError && (
        <Text color="red" size="small">
          {errorMessage}
        </Text>
      )}

      <Modal ref={imgRef} size="large" title="Image" showFooter={false} showCloseIcon={true}>
        <ImgModalBody>
          <img src={imgUrlForModal} alt="img" />
        </ImgModalBody>
      </Modal>
    </ImageUploadContainer>
  );
};

export default ImageUpload;
