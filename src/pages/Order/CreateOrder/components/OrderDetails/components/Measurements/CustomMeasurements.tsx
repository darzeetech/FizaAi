import { useEffect, useState } from 'react';
import _isUndefined from 'lodash/isUndefined';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { api } from '../../../../../../../utils/apiRequest';
import { positiveNumberRegex } from '../../../../../../../utils/regexValue';

import { InputField } from '../../../../../../../components/FormComponents';
import { Text, Tabs } from '../../../../../../../ui-component';
import type { OrderItemType } from '../../../../type';
import type { MeasurementRevisionObj } from '.';
import { useSelector } from 'react-redux';

import {
  CustomMeasurementContainer,
  CustomMeasurementTabBody,
  CustomMeasurementImage,
  CustomMeasurementItem,
  CustomMeasurementList,
} from './style';

type CustomMeasurementObj = {
  image_link: string;
  index: string;
  title: string;
  value: string;
  name: string;
};

export type CustomMeasurementsDetailsType = {
  outfit_image_link: string;
  outfit_type_heading: string;
  measurement_details_list: CustomMeasurementObj[];
};

export type CustomMeasurementsErrorType = string[];

type CustomMeasurementsProps = {
  customer_id: number;
  selectedOutfitChipIndex: number;
  order_items: OrderItemType;
  setIsMeasurementUpdated: (data: boolean) => void;
  setCustomMeasurementDetails: (data: Record<number, CustomMeasurementsDetailsType[]>) => void;
  customMeasurementDetails?: Record<number, CustomMeasurementsDetailsType[]>;
  customMeasurementErrors: Record<number, CustomMeasurementsErrorType[]>;
  setCustomMeasurementErrors: (errorData: Record<number, CustomMeasurementsErrorType[]>) => void;
  isModalOpen: boolean;
  tabIndex: number;
  setTabIndex: (index: number) => void;
  tabNameList: string[];
  selectedRevision?: MeasurementRevisionObj | null;
};

const CustomMeasurements = ({
  selectedOutfitChipIndex,
  order_items,
  customMeasurementDetails,
  setCustomMeasurementDetails,
  setIsMeasurementUpdated,
  customMeasurementErrors,
  setCustomMeasurementErrors,
  isModalOpen,
  tabIndex,
  setTabIndex,
  tabNameList,
  selectedRevision,
}: CustomMeasurementsProps) => {
  const { outfit_type } = order_items;

  const [selectedCustomMesurementIndex, setSelectedCustomMeasurementIndex] = useState(0);
  const [isCustomDetailsFetched, setIsCustomDetailsFetched] = useState(false);
  const [customDataFromApi, setCustomDataFromApi] = useState<CustomMeasurementObj[]>([]);

  useEffect(() => {
    return () => {
      setIsCustomDetailsFetched(false);
      setSelectedCustomMeasurementIndex(0);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      void getCustomMeasurementDetails();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isCustomDetailsFetched && !_isNil(customMeasurementDetails) && !_isNil(selectedRevision)) {
      const hasMeasurement =
        !_isNil(selectedRevision.measurement_value) &&
        !_isEmpty(selectedRevision.measurement_value);

      const updatedCustomMeasurement = customMeasurementDetails[selectedOutfitChipIndex].map(
        (details) => {
          return {
            ...details,
            measurement_details_list: details.measurement_details_list.map((obj, index) => {
              //   const key = outfitMeasurementMap[outfit_type][details.outfit_type_heading][index];

              return {
                ...obj,
                value: hasMeasurement
                  ? selectedRevision.measurement_value[obj.name]
                  : customDataFromApi.length > index
                    ? customDataFromApi[index].value
                    : '',
              };
            }),
          };
        }
      );

      setCustomMeasurementDetails({
        ...customMeasurementDetails,
        [selectedOutfitChipIndex]: updatedCustomMeasurement,
      });
    }
  }, [isCustomDetailsFetched, JSON.stringify(selectedRevision)]);

  // Get the order details from Redux
  const { customer_details } = useSelector((state: any) => state.createOrderReducer);

  const getCustomMeasurementDetails = async () => {
    const response = await api.getRequest(
      `measurement/?scale=inch&outfit_type=${outfit_type}&customer_id=${customer_details?.customer_id}`
    );
    const { status, data } = response;

    if (status) {
      if (data.inner_measurement_details.length > 0) {
        setCustomMeasurementDetails({
          ...customMeasurementDetails,
          [selectedOutfitChipIndex]: data.inner_measurement_details,
        });

        setCustomDataFromApi(data.inner_measurement_details);

        const errObj = data.inner_measurement_details.map(
          (measurement: any) => measurement.measurement_details_list.map(() => '') ?? []
        );
        setCustomMeasurementErrors({
          ...customMeasurementErrors,
          [selectedOutfitChipIndex]: errObj,
        });

        setIsCustomDetailsFetched(true);
      }
    }
  };

  const handleChange = (value: any, index: number, customIndex: number) => {
    if (
      !_isUndefined(customMeasurementDetails) &&
      !_isUndefined(customMeasurementDetails[selectedOutfitChipIndex])
    ) {
      const updatedMeasurementList = customMeasurementDetails[selectedOutfitChipIndex][
        customIndex
      ].measurement_details_list.map((measurement, currIndex) => {
        if (currIndex === index) {
          return {
            ...measurement,
            value,
          };
        }

        return measurement;
      });

      const updateCustomMeasurement = customMeasurementDetails[selectedOutfitChipIndex].map(
        (custom, i) => {
          if (i === customIndex) {
            return {
              ...custom,
              measurement_details_list: updatedMeasurementList,
            };
          }

          return custom;
        }
      );

      setCustomMeasurementDetails({
        ...customMeasurementDetails,
        [selectedOutfitChipIndex]: updateCustomMeasurement,
      });

      setIsMeasurementUpdated(true);
    }
  };

  const handleOnFocus = (index: number) => {
    setSelectedCustomMeasurementIndex(index);
  };

  const onTabChange = (currTabIndex: number) => {
    handleOnFocus(0);
    setTabIndex(currTabIndex);
  };

  if (
    _isUndefined(customMeasurementDetails) ||
    _isUndefined(customMeasurementDetails[selectedOutfitChipIndex])
  ) {
    return null;
  }

  return (
    <CustomMeasurementContainer>
      <Tabs
        defaultIndex={tabIndex}
        isSticky={true}
        width="calc(100% - 64px)"
        tabNameList={tabNameList}
        onTabChange={onTabChange}
      >
        {customMeasurementDetails[selectedOutfitChipIndex].map((custom, customIndex) => (
          <CustomMeasurementTabBody key={customIndex}>
            {custom.measurement_details_list.length > 0 && (
              <CustomMeasurementImage
                src={custom.measurement_details_list[selectedCustomMesurementIndex]?.image_link}
                alt="measurement_image"
              />
            )}
            <CustomMeasurementList>
              {custom.measurement_details_list.map((measurement, index) => (
                <CustomMeasurementItem
                  className="list-item"
                  key={measurement.index}
                  isFocused={selectedCustomMesurementIndex === index}
                  onFocus={() => handleOnFocus(index)}
                >
                  <div className="measurement-title">
                    <Text>
                      {`${index + 1}. `} {measurement.title}
                    </Text>
                  </div>
                  <div className="measurement-input">
                    <InputField
                      type="text"
                      required={false}
                      value={measurement.value ?? ''}
                      regex={positiveNumberRegex}
                      errorMsg={
                        customMeasurementErrors[selectedOutfitChipIndex][customIndex][index] ?? ''
                      }
                      onChange={(value) => handleChange(value, index, customIndex)}
                    />
                  </div>
                </CustomMeasurementItem>
              ))}
            </CustomMeasurementList>

            {custom.measurement_details_list.length === 0 && <Text>No Measurement Details</Text>}
          </CustomMeasurementTabBody>
        ))}
      </Tabs>
    </CustomMeasurementContainer>
  );
};

export default CustomMeasurements;
