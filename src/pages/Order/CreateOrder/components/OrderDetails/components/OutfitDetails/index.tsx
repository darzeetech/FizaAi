import _isNil from 'lodash/isNil';
import {
  BulkImageUploadField,
  InputField,
  RadioField,
  SingleDateField,
  CheckboxField,
  AudioRecordField,
} from '../../../../../../../components/FormComponents';
import type { OrderItemType, OutfitDetailsType } from '../../../../type';
import Measurements from '../Measurements';
import StitchOptions from '../StitchOptions';

import { OutfitDetailsContainer } from './style';
import { useEffect } from 'react';

type OutfitDetailsProps = {
  selectedOutfitChipIndex: number;
  customer_id: number;
  order_items: OrderItemType;
  selected_outfits: Record<string, OutfitDetailsType>;
  handleChange: (value: any, key: string) => void;
  setIsValidDetails: (data: boolean) => void;
  order_id?: number;
};

export const ORDER_TYPE_OPTIONS = [
  {
    label: 'Stitching',
    value: 'stitching',
  },
  {
    label: 'Alteration',
    value: 'alteration',
  },
];

const OutfitDetails = ({
  selectedOutfitChipIndex,
  customer_id,
  order_items,
  selected_outfits,
  handleChange,
}: OutfitDetailsProps) => {
  const currentOutfit = !_isNil(order_items) ? selected_outfits[order_items.outfit_type] : null;
  let canAddStitchOptions = true;
  let canAddMeasurements = true;

  useEffect(() => {
    if (!_isNil(order_items?.order_type) && order_items.order_type === 'alteration') {
      handleChange(null, 'measurement_revision_id');
      handleChange([], 'stitch_option_references');
    }
  }, [order_items?.order_type]);

  useEffect(() => {
    if (!_isNil(order_items?.delivery_date)) {
      const deliveryDate = new Date(order_items.delivery_date);
      const trialDate = new Date(deliveryDate);
      trialDate.setDate(deliveryDate.getDate() - 1); // Set trial date to one day before delivery date
      handleChange(trialDate.toISOString(), 'trial_date');
    }
  }, [order_items?.delivery_date]);

  if (!_isNil(currentOutfit)) {
    canAddStitchOptions =
      currentOutfit.stitch_options_exist && order_items?.order_type === 'stitching';
  }

  if (!_isNil(order_items?.order_type)) {
    canAddMeasurements = order_items?.order_type === 'stitching';
  }

  if (_isNil(order_items)) {
    return null;
  }

  const handleDateChange = (value: string, dateType: string) => {
    // This will trigger the parent's handleChange which updates all outfits
    handleChange(value, dateType);
  };

  return (
    <OutfitDetailsContainer id="outfit-details">
      <RadioField
        label="Type"
        type="radio"
        required={true}
        value={order_items?.order_type ?? ''}
        options={ORDER_TYPE_OPTIONS}
        onChange={(value) => handleChange(value, 'order_type')}
      />

      {canAddMeasurements && (
        <Measurements
          selectedOutfitChipIndex={selectedOutfitChipIndex}
          customer_id={customer_id}
          order_items={order_items}
          handleChange={handleChange}
        />
      )}

      {canAddStitchOptions && (
        <StitchOptions
          selectedOutfitChipIndex={selectedOutfitChipIndex}
          order_items={order_items}
          handleChange={handleChange}
        />
      )}
      <InputField
        label="Special Instructions"
        placeholder="Write Instructions given by customer"
        type="textarea"
        required={false}
        value={order_items?.special_instructions ?? ''}
        maxLength={800}
        onChange={(value) => handleChange(value, 'special_instructions')}
      />

      <AudioRecordField
        label="Record Audio"
        type="textarea"
        required={false}
        value={order_items?.audio_urls ?? []}
        multiple={true}
        maxUpload={5}
        onChange={(value) => handleChange(value, 'audio_urls')}
      />

      <InputField
        label="Add Inspiration"
        placeholder="https://www.google.com"
        type="text"
        required={false}
        value={order_items?.inspiration ?? ''}
        maxLength={250}
        onChange={(value) => handleChange(value, 'inspiration')}
      />

      <BulkImageUploadField
        label="Upload Cloth Images"
        placeholder="Upload Cloth Images"
        type="file"
        required={false}
        multiple={true}
        maxUpload={10}
        fileTypeRequired={false}
        value={order_items?.cloth_images}
        onChange={(value) => handleChange(value, 'cloth_images')}
      />

      <div className="date-field-container">
        <SingleDateField
          label="Delivery Date"
          placeholder="Select Date"
          required={true}
          value={order_items?.delivery_date}
          valueFormat="isoString"
          dateFormat="dd/MM/yyyy h:mm aa"
          showTimeSelect={true}
          timeIntervals={15}
          onChange={(value) => handleDateChange(value.toString(), 'delivery_date')}
        />
      </div>

      <CheckboxField
        label="Prioritize Order"
        value={order_items?.is_priority_order ?? false}
        onChange={(value) => handleChange(value, 'is_priority_order')}
      />

      <div className="date-field-container">
        <SingleDateField
          label="Trial Date"
          placeholder="Select Date"
          required={false}
          value={order_items?.trial_date}
          valueFormat="isoString"
          dateFormat="dd/MM/yyyy h:mm aa"
          showTimeSelect={true}
          timeIntervals={15}
          onChange={(value) => handleDateChange(value.toString(), 'trial_date')}
        />
      </div>
    </OutfitDetailsContainer>
  );
};

export default OutfitDetails;
