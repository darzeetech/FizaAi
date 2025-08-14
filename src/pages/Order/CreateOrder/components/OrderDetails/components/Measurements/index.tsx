import { useEffect, useRef, useState } from 'react';
import _reduce from 'lodash/reduce';
import _forEach from 'lodash/forEach';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { FaRegEdit } from 'react-icons/fa';

import { api } from '../../../../../../../utils/apiRequest';
import { positiveNumberRegex } from '../../../../../../../utils/regexValue';
import { validateValueWithRegex } from '../../../../../../../utils/common';

import { DropdownField } from '../../../../../../../components/FormComponents';
import {
  Button,
  Loader,
  Modal,
  ModalMethods,
  Text,
  toasts,
} from '../../../../../../../ui-component';
import {
  EditIcon,
  MeasurementImageIcon,
  PenIcon,
  PlusIcon,
} from '../../../../../../../assets/icons';

import type { ImageObjType } from '../../../../../../../ui-component';
import type { OrderItemType } from '../../../../type';

import UploadImageButton from './UploadImageButton';
import ImageMeasurement from './ImageMeasurement';
import CustomMeasurements, {
  CustomMeasurementsDetailsType,
  CustomMeasurementsErrorType,
} from './CustomMeasurements';

import { MeasuementModalHeader, MeasurementContainer, RevisionDropdownOption } from './style';
import button1 from '../../../../../../../assets/images/Importbutton.png';
import history from '../../../../../../../assets/images/history.png';
import { ConfirmationModal } from './confirmation-modal';
import { MeasurementPopup } from './measurement-popup';

export type MeasurementRevisionObj = {
  created_at: string;
  customer_id: number;
  outfit_type: number;
  measurement_value: Record<string, any>;
  image_detail: ImageObjType & { image_url?: string };
  revision_id: number;
  label: string;
  value: string;
};

type MeaseurementsProps = {
  customer_id: number;
  selectedOutfitChipIndex: number;
  order_items: OrderItemType;
  handleChange: (value: any, key: string) => void;
};

const Measurements = ({
  customer_id,
  selectedOutfitChipIndex,
  order_items,
  handleChange,
}: MeaseurementsProps) => {
  const ref = useRef<ModalMethods>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [measurementRevisionList, setMeasurementRevisionList] = useState<MeasurementRevisionObj[]>(
    []
  );
  const [selectedRevision, setSelectedRevision] = useState<MeasurementRevisionObj>();

  const [customMeasurementDetails, setCustomMeasurementDetails] = useState<
    Record<number, CustomMeasurementsDetailsType[]>
  >({});
  const [imageMeasurement, setImageMeasurement] = useState<Record<number, ImageObjType | null>>({});
  const [isMeasurementUpdated, setIsMeasurementUpdated] = useState(false);

  const [customMeasurementErrors, setCustomMeasurementErrors] = useState<
    Record<number, CustomMeasurementsErrorType[]>
  >({});

  const [tabIndex, setTabIndex] = useState(0);
  const [tabNameList, setTabNameList] = useState<string[]>([]);
  const [popup, setpopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [measurementData, setMeasurementData] = useState({
    imported_measurement_params: [],
  });

  const showImageMeasurements =
    !_isNil(imageMeasurement) &&
    !_isEmpty(imageMeasurement) &&
    !_isNil(imageMeasurement[selectedOutfitChipIndex]) &&
    !_isEmpty(imageMeasurement[selectedOutfitChipIndex]);

  const { outfit_type, measurement_revision_id, measurement_details } = order_items;

  const isEdit =
    !_isNil(measurement_revision_id) ||
    (!_isNil(measurement_details) &&
      (!_isNil(measurement_details.inner_measurement_details) ||
        !_isNil(measurement_details.measurement_image_link)));

  useEffect(() => {
    setCustomMeasurementDetails({});
    setCustomMeasurementErrors({});
  }, [outfit_type]);

  useEffect(() => {
    if (popup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [popup]);

  useEffect(() => {
    if (!_isNil(selectedRevision)) {
      const hasImage =
        !_isNil(selectedRevision.image_detail) &&
        !_isEmpty(selectedRevision.image_detail) &&
        !_isEmpty(selectedRevision.image_detail.image_url);

      setImageMeasurement({
        ...imageMeasurement,
        [selectedOutfitChipIndex]: hasImage
          ? {
              reference_id: selectedRevision.image_detail.reference_id,
              short_lived_url:
                selectedRevision.image_detail.short_lived_url ??
                selectedRevision.image_detail.image_url,
            }
          : null,
      });
    }
  }, [JSON.stringify(selectedRevision)]);

  useEffect(() => {
    if (
      !_isNil(measurementRevisionList) &&
      !_isEmpty(measurementRevisionList) &&
      !_isNil(measurement_revision_id)
    ) {
      setSelectedRevision(
        measurementRevisionList.find((obj) => obj.revision_id === measurement_revision_id)
      );
    }
  }, [measurement_revision_id, measurementRevisionList]);

  useEffect(() => {
    if (!_isNil(customMeasurementDetails)) {
      setTabNameList(
        customMeasurementDetails[selectedOutfitChipIndex]?.map(
          (custom) => custom.outfit_type_heading
        ) ?? []
      );
    }
  }, [JSON.stringify(customMeasurementDetails), selectedOutfitChipIndex]);

  const modalHeader = (
    <MeasuementModalHeader>
      <Text fontWeight={500}>Add Measurements (In Inches)</Text>

      <UploadImageButton
        imageMeasurement={imageMeasurement}
        selectedOutfitChipIndex={selectedOutfitChipIndex}
        setImageMeasurement={setImageMeasurement}
        setSelectedRevision={setSelectedRevision}
        setIsMeasurementUpdated={setIsMeasurementUpdated}
        setIsLoading={setIsLoading}
      />
    </MeasuementModalHeader>
  );

  const openModal = () => {
    ref.current?.show();
    setIsModalOpen(true);
    void getMeasurementRevisions();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    ref.current?.hide();
    setTabIndex(0);
  };

  const closeOrBack = () => {
    if (tabIndex !== 0 && !showImageMeasurements) {
      setTabIndex(tabIndex - 1);

      return;
    }

    closeModal();
  };

  // Get the order details from Redux
  const { customer_details } = useSelector((state: any) => state.createOrderReducer);

  const getMeasurementRevisions = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line no-console
      console.log('Data being passed:');
      const response = await api.getRequest(
        `measurement/revisions?customer_id=${customer_details?.customer_id}&outfit_type=${outfit_type}`
      );

      const { status, data } = response;

      if (status && !_isEmpty(data)) {
        let length = data.data.length + 1;
        const revisionList = data.data.map((revision: MeasurementRevisionObj) => {
          length--;

          return {
            ...revision,
            label: `Measurement ${length}`,
            value: `Measurement ${length}`,
          };
        });

        setSelectedRevision(revisionList[0]);
        setMeasurementRevisionList(revisionList);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'measurement-revisions');
      }
    }
    setIsLoading(false);
  };

  const handleSelectMeasurement = (value: any) => {
    setSelectedRevision(value);
    setIsMeasurementUpdated(false);
  };

  const getFormattedMeasurements = () => {
    let isValidMeasurement = true;

    if (!showImageMeasurements) {
      // Validate filled measurements
      const updatedCustomMeasurementErrors = [...customMeasurementErrors[selectedOutfitChipIndex]];

      _forEach(customMeasurementDetails[selectedOutfitChipIndex], (measurement, parentIndex) => {
        _forEach(measurement.measurement_details_list, (value, index) => {
          if (!_isNil(value.value) && value.value !== '') {
            const { valid, message } = validateValueWithRegex(value.value, positiveNumberRegex);

            updatedCustomMeasurementErrors[parentIndex][index] = message;

            if (!valid) {
              isValidMeasurement = false;
            }
          }
        });
      });

      setCustomMeasurementErrors({
        ...customMeasurementErrors,
        [selectedOutfitChipIndex]: updatedCustomMeasurementErrors,
      });

      // If custom measurement Data is valid then format the data
      if (isValidMeasurement) {
        const formatedMeasurementData = {
          customer_id: customer_details?.customer_id,
          outfit_type,
          scale: 'inch',
          measurements: _reduce(
            customMeasurementDetails[selectedOutfitChipIndex],
            (details, measurement) => {
              measurement.measurement_details_list.forEach((value) => {
                if (!_isNil(value) && !_isNil(value.value) && value.value !== '') {
                  details = {
                    ...details,
                    [value.name]: parseFloat(value.value),
                  };
                }
              });

              return details;
            },
            {}
          ),
        };

        return { formatedMeasurementData, isValidMeasurement };
      }
    } else if (!_isNil(imageMeasurement) && !_isNil(imageMeasurement[selectedOutfitChipIndex])) {
      const formatedMeasurementData = {
        customer_id: customer_details?.customer_id,
        outfit_type,
        scale: 'inch',
        reference_id: imageMeasurement[selectedOutfitChipIndex]?.reference_id ?? '',
      };

      return { formatedMeasurementData, isValidMeasurement };
    }

    return { formatedMeasurementData: {}, isValidMeasurement: false };
  };
  const handleSaveData = async () => {
    if (tabIndex < tabNameList.length - 1 && !showImageMeasurements) {
      setTabIndex(tabIndex + 1);

      return;
    }

    if (isMeasurementUpdated) {
      const { formatedMeasurementData, isValidMeasurement } = getFormattedMeasurements();

      if (!_isEmpty(formatedMeasurementData) && isValidMeasurement) {
        try {
          setIsLoading(true);
          const response = await api.postRequest(`measurement/`, formatedMeasurementData);
          const { status, data } = response;

          if (status && !_isEmpty(data)) {
            const { measurement_revision_id } = data;
            handleChange(measurement_revision_id, 'measurement_revision_id');
            closeModal();
          }
        } catch (err) {
          if (err instanceof Error) {
            toasts('error', err.message, 'save-measurement');
          }
        }

        setIsLoading(false);
      }
    } else {
      handleChange(selectedRevision?.revision_id, 'measurement_revision_id');
      closeModal();
    }
  };

  const CustomOption = (props: any) => {
    const { innerProps, innerRef, isSelected } = props;

    const hasImage =
      !_isNil(props.data.image_detail) &&
      !_isNil(props.data.image_detail.image_url) &&
      !_isEmpty(props.data.image_detail.image_url);

    return (
      <RevisionDropdownOption $isSelected={isSelected as boolean} ref={innerRef} {...innerProps}>
        <div className="revision-img">{hasImage ? <MeasurementImageIcon /> : <PenIcon />}</div>
        <div className="revision-text">
          <Text color={isSelected ? 'white' : 'black'} fontWeight={600}>
            {props.data.label}
          </Text>
          <Text
            size="small"
            color={isSelected ? 'var(--color-lavender)' : 'var(--nightRider)'}
            fontWeight={400}
          >
            {`Recorded on : ${moment(new Date(props.data.created_at)).format('DD/MM/YYYY')}`}
          </Text>
        </div>
      </RevisionDropdownOption>
    );
  };

  // const handleConfirm = () => {
  //   // eslint-disable-next-line no-console
  //   console.log('User confirmed');
  //   setpopup(!popup);
  // };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      const outfit_side = tabIndex + 1;

      // Make API call to fetch imported measurements
      const response = await api.getRequest(
        `customers/${customer_details?.customer_id}/outfit/${outfit_type}/import_measurement?outfit_side=${outfit_side}`
      );

      const { status, data } = response;

      if (status && !_isEmpty(data) && !_isEmpty(data.imported_measurement_params)) {
        // Create a mapping of measurement keys to their values with proper typing
        const importedMeasurements: Record<string, number> = _reduce(
          data.imported_measurement_params,
          (result: Record<string, number>, item: any) => {
            result[item.key] = item.value;

            return result;
          },
          {}
        );

        // Create a deep copy of the current customMeasurementDetails
        const updatedCustomMeasurementDetails = { ...customMeasurementDetails };

        // Update each measurement detail with imported values if available
        if (!_isEmpty(updatedCustomMeasurementDetails[selectedOutfitChipIndex])) {
          updatedCustomMeasurementDetails[selectedOutfitChipIndex] =
            updatedCustomMeasurementDetails[selectedOutfitChipIndex].map((outfitSection) => {
              const updatedMeasurementList = outfitSection.measurement_details_list.map(
                (measurement) => {
                  // If this measurement has an imported value, update it
                  if (importedMeasurements[measurement.name] !== undefined) {
                    return {
                      ...measurement,
                      value: importedMeasurements[measurement.name].toString(),
                    };
                  }

                  return measurement;
                }
              );

              return {
                ...outfitSection,
                measurement_details_list: updatedMeasurementList,
              };
            });

          // Update the state with the new measurements
          setCustomMeasurementDetails(updatedCustomMeasurementDetails);
          setIsMeasurementUpdated(true);
          toasts('success', 'Measurements imported successfully', 'import-measurements');
        }
      } else {
        toasts('error', 'No measurements available to import', 'import-measurements');
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'import-measurements');
      } else {
        toasts('error', 'Failed to import measurements', 'import-measurements');
      }
    } finally {
      setIsLoading(false);
      setpopup(false); // Close the confirmation popup
    }
  };

  const fetchMeasurementData = async () => {
    try {
      setIsLoading(true);
      const outfit_side = tabIndex + 1;

      const response = await api.getRequest(
        `customers/${customer_details?.customer_id}/outfit/${outfit_type}/import_measurement?outfit_side=${outfit_side}`
      );

      const { status, data } = response;

      if (status && !_isEmpty(data) && !_isEmpty(data.imported_measurement_params)) {
        setMeasurementData(data);
        setIsPopupOpen(true);
      } else {
        toasts('error', 'No measurement history available', 'measurement-history');
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'measurement-history');
      } else {
        toasts('error', 'Failed to fetch measurement history', 'measurement-history');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('User cancelled');
    setpopup(!popup);
  };
  // eslint-disable-next-line no-console
  console.log(customMeasurementDetails);

  return (
    <MeasurementContainer className="w-full h-[200%] bg-blac flex items-center">
      {!location.pathname.includes('selectcustomer') && (
        <Text color="black" fontWeight={500}>
          Add Measurements
        </Text>
      )}
      {!location.pathname.includes('selectcustomer') && (
        <Button
          appearance="outlined"
          size="small"
          bgColor={isEdit ? 'var(--color-nightRider)' : 'primary'}
          leadingIcon={
            isEdit ? <EditIcon color="#323232" /> : <PlusIcon color="var(--color-primary)" />
          }
          onClick={openModal}
        >
          <Text fontWeight={500} color={isEdit ? 'var(--color-nightRider)' : 'primary'}>
            {isEdit ? 'Edit' : 'Add'}
          </Text>
        </Button>
      )}

      {location.pathname.includes('selectcustomer') && (
        <div onClick={openModal} className="w-full h-full bg-slate-60 ">
          {order_items.measurement_details && (
            <FaRegEdit
              className="text-[1.5rem] cursor-pointer absolute top-1 right-1 m-2"
              onClick={openModal}
            />
          )}
        </div>
      )}
      <Modal
        ref={ref}
        size="xl"
        headerComponent={modalHeader}
        saveButtonText={
          tabIndex < tabNameList.length - 1 && !showImageMeasurements ? 'Next' : 'Save'
        }
        closeButtonText={tabIndex === 0 ? 'Close' : 'Back'}
        onModalClose={closeOrBack}
        onModalSuccess={handleSaveData}
      >
        <div className="w-full h-fit flex flex-col  relative">
          <ConfirmationModal
            isOpen={popup}
            onClose={() => setIsModalOpen(!popup)}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            title="Confirm Import!"
            message="Do you want to fill the measurements with the imported values?"
            subtitle="This will replace the current measurements"
          />
          <MeasurementPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            data={measurementData}
            title={`${order_items.outfit_alias || 'Outfit'} Measurements`}
          />
          <div className="h-[94px] w-[calc(100%-62px)] fixed py-3 px-0 z-[800] bg-white">
            <div className=" flex items-center justify-between">
              <DropdownField
                className=" w-[25vw]"
                label="Measurement"
                options={measurementRevisionList}
                value={
                  !_isNil(selectedRevision)
                    ? { label: selectedRevision.label, value: selectedRevision.value }
                    : undefined
                }
                onChange={handleSelectMeasurement}
                CustomOption={CustomOption}
              />
              <div className="flex items-center gap-3 mr-4">
                <img
                  onClick={() => setpopup(!popup)}
                  src={button1}
                  className="h-[2.3rem] mt-2 aspect-auto cursor-pointer "
                  alt=""
                />
                <img
                  onClick={fetchMeasurementData}
                  src={history}
                  className="h-[2.1rem] mt-2 aspect-auto cursor-pointer"
                  alt="Measurement History"
                />
              </div>
            </div>
          </div>

          {!showImageMeasurements && (
            <CustomMeasurements
              customer_id={customer_id}
              selectedOutfitChipIndex={selectedOutfitChipIndex}
              order_items={order_items}
              customMeasurementDetails={customMeasurementDetails}
              setCustomMeasurementDetails={setCustomMeasurementDetails}
              customMeasurementErrors={customMeasurementErrors}
              setCustomMeasurementErrors={setCustomMeasurementErrors}
              selectedRevision={selectedRevision}
              isModalOpen={isModalOpen}
              setIsMeasurementUpdated={setIsMeasurementUpdated}
              tabIndex={tabIndex}
              setTabIndex={setTabIndex}
              tabNameList={tabNameList}
            />
          )}

          {showImageMeasurements && (
            <ImageMeasurement
              imageMeasurement={imageMeasurement}
              selectedOutfitChipIndex={selectedOutfitChipIndex}
              setImageMeasurement={setImageMeasurement}
              setSelectedRevision={setSelectedRevision}
              setIsMeasurementUpdated={setIsMeasurementUpdated}
            />
          )}
        </div>
      </Modal>
      <Loader showLoader={isLoading} />
    </MeasurementContainer>
  );
};

export default Measurements;
