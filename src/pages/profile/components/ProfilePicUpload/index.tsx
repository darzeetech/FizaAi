import type { ChangeEvent } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

import { ImageObjType } from '../../../../components/FormComponents';
import { Text } from '../../../../ui-component';
import { EditIcon, ProfilePicIcon } from '../../../../assets/icons';
import { api } from '../../../../utils/apiRequest';

import { Container, Field, UploadButton } from './style';

type ProfilePicUploadProps = {
  value: ImageObjType;
  onChange: (value: ImageObjType) => void;
  label?: string;
};

const ProfilePicUpload = (props: ProfilePicUploadProps) => {
  const { label = 'Upload your profile picture', value, onChange } = props;

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    let currentValue: ImageObjType = {};

    if (!_isNil(e.target.files)) {
      const formData = new FormData();

      const file = e.target.files?.[0] ?? '';
      formData.append('file', file);
      //   formData.append('file_type', '3');

      const response = await api.postRequest('storage/upload_multiple_files', formData, true);

      const { status, data } = response;

      if (status && !_isNil(data)) {
        currentValue = data.response[0];

        onChange(currentValue);
      }
    }

    // if (required) {
    if (_isEmpty(currentValue)) {
      // setErrorMessage('This field is required');
    } else {
      // setErrorMessage('');
    }
    // }
  };

  const isValueEmpty = _isEmpty(value);
  const btnLabel = isValueEmpty ? (
    'Upload'
  ) : (
    <div className="edit-btn">
      Edit <EditIcon />
    </div>
  );

  return (
    <Container>
      <Text className=" flex items-center gap-2 font-inter font-[600] text-[.8rem]" color="black">
        {label}
      </Text>

      <Field>
        <div className="circle">
          {isValueEmpty ? (
            <ProfilePicIcon />
          ) : (
            <img src={value.short_lived_url ?? ''} alt="profile-pic" />
          )}
        </div>
        <div>
          <label htmlFor="profilePic">
            <UploadButton>{btnLabel}</UploadButton>
          </label>
          <input
            id="profilePic"
            type="file"
            // value={value}
            className="input-file"
            onInput={onUpload}
          />
        </div>
      </Field>
    </Container>
  );
};

export default ProfilePicUpload;
