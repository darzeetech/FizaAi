import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import _isUndefined from 'lodash/isUndefined';
import _forEach from 'lodash/forEach';

import { RootState } from '../../../../../../../store';
import { api } from '../../../../../../../utils/apiRequest';
import { DynamicForm, type FormFieldType } from '../../../../../../../components/FormComponents';
import {
  Button,
  Loader,
  Modal,
  ModalMethods,
  Tabs,
  Text,
  toasts,
} from '../../../../../../../ui-component';
import { EditIcon, PlusIcon } from '../../../../../../../assets/icons';

import { updateStitchOptionRefIds, updteOutfitStitchOptions } from '../../../../reducer';
import type { OrderItemType, StitchOptionsObj } from '../../../../type';

import { formatStitchOptionsApiResponse, formatStitchOptionsPayload } from '../../helperFunction';
import { OptionListContainer, StitchOptionsContainer } from './style';

type StitchOptionsProps = {
  selectedOutfitChipIndex: number;
  order_items: OrderItemType;
  handleChange: (value: any, key: string) => void;
  order_id?: number;
};

const StitchOptions = ({
  selectedOutfitChipIndex,
  order_items,
  handleChange,
}: StitchOptionsProps) => {
  const ref = useRef<ModalMethods>(null);
  const dispatch = useDispatch();

  const { createOrderReducer } = useSelector((state: RootState) => state);
  const { outfit_stitch_options, saved_stitch_option_ref_ids } = createOrderReducer;

  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabNameList, setTabNameList] = useState<string[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);

  const [optionsList, setOptionsList] = useState<StitchOptionsObj[]>(
    outfit_stitch_options[selectedOutfitChipIndex] ?? []
  );

  const { outfit_type, id, stitch_option_references, order_item_stitch_options } = order_items;

  useEffect(() => {
    setOptionsList(outfit_stitch_options[selectedOutfitChipIndex] ?? []);
  }, [selectedOutfitChipIndex]);

  useEffect(() => {
    if (!_isNil(order_item_stitch_options) && !_isEmpty(order_item_stitch_options)) {
      const updatedOptionsList = optionsList.map((option) => {
        const { side, stitch_options } = option;
        const currSideValueList = order_item_stitch_options[side] ?? [];

        return {
          side,
          stitch_options: stitch_options.map((stitchObj) => {
            const stitchValueObjFromApi = currSideValueList.find(
              (obj) => obj.stitch_option_id === stitchObj.id
            );

            return {
              ...stitchObj,
              value:
                stitchObj?.value ??
                (!_isUndefined(stitchValueObjFromApi) ? [stitchValueObjFromApi.value] : []),
            };
          }),
        };
      });

      setOptionsList(updatedOptionsList);

      //Update Ref Ids

      const refIds: number[] = [];

      _forEach(order_item_stitch_options, (optionList) => {
        optionList.forEach((obj) => refIds.push(obj.order_stitch_option_id));
      });

      dispatch(
        updateStitchOptionRefIds({
          data: {
            ...saved_stitch_option_ref_ids,
            [selectedOutfitChipIndex]: refIds,
          },
        })
      );
    }
  }, [JSON.stringify(order_item_stitch_options), JSON.stringify(optionsList)]);

  useEffect(() => {
    setTabNameList(optionsList.map((option) => option.side) ?? []);
  }, [JSON.stringify(optionsList)]);

  const openModal = () => {
    ref.current?.show();

    if (_isNil(optionsList) || optionsList.length == 0) {
      void getStitchOptionDetails();
    }
  };

  const getStitchOptionDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.getRequest(`outfit/${outfit_type}/stitch_options`);

      const { status, data } = response;

      if (status && !_isEmpty(data)) {
        setOptionsList(formatStitchOptionsApiResponse(data.response));
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'stitch-options');
      }
    }
    setIsLoading(false);
  };

  const onTabChange = (index: number) => {
    setActiveIndex(index);
  };

  const updateStitchOption = (value: any, stitchOptionId: number) => {
    if (!_isNil(optionsList)) {
      const updatedOptionsList = structuredClone(optionsList);

      const updatedStitchOptions = updatedOptionsList[activeIndex].stitch_options.map(
        (field: FormFieldType) => {
          if (field.id === stitchOptionId) {
            return {
              ...field,
              value,
            };
          }

          return field;
        }
      );

      updatedOptionsList[activeIndex].stitch_options = updatedStitchOptions;

      setOptionsList(updatedOptionsList);
      setIsUpdated(true);
    }
  };

  const handleSaveData = async () => {
    if (activeIndex < tabNameList.length - 1) {
      setActiveIndex(activeIndex + 1);

      return;
    }

    if (isUpdated) {
      try {
        setIsLoading(true);
        const stitch_details = formatStitchOptionsPayload(optionsList);
        const payload: Record<string, any> = {
          stitch_details,
        };

        const response = await (!_isNil(id)
          ? api.putRequest(`order_item/${id}/stitch_options`, payload)
          : api.postRequest('order_item/stitch_options', payload));

        //eslint-disable-next-line
        const { status, data } = response;

        if (status && !_isEmpty(data)) {
          const order_stitch_option_list = data?.stitch_summary?.order_stitch_option_list ?? [];

          const stitch_option_references = order_stitch_option_list.map(
            (obj: any) => obj.order_stitch_option_id
          );

          handleChange(stitch_option_references, 'stitch_option_references');

          dispatch(
            updteOutfitStitchOptions({
              data: {
                ...outfit_stitch_options,
                [selectedOutfitChipIndex]: optionsList,
              },
            })
          );

          dispatch(
            updateStitchOptionRefIds({
              data: {
                ...saved_stitch_option_ref_ids,
                [selectedOutfitChipIndex]: stitch_option_references,
              },
            })
          );

          closeModal();
        }
      } catch (err) {
        if (err instanceof Error) {
          toasts('error', err.message, 'create-stitch-option-error');
        }
      }
    } else {
      if (!_isNil(saved_stitch_option_ref_ids)) {
        handleChange(
          saved_stitch_option_ref_ids[selectedOutfitChipIndex],
          'stitch_option_references'
        );
      }

      closeModal();
    }

    setIsLoading(false);
  };

  const closeModal = () => {
    setActiveIndex(0);
    setIsUpdated(false);
    ref.current?.hide();
  };

  const closeOrBack = () => {
    if (activeIndex !== 0) {
      setActiveIndex(activeIndex - 1);

      return;
    }

    closeModal();
  };

  const isEdit =
    (!_isNil(stitch_option_references) && !_isEmpty(stitch_option_references)) ||
    (!_isNil(order_item_stitch_options) && !_isEmpty(order_item_stitch_options));

  return (
    <StitchOptionsContainer>
      <Text color="black" fontWeight={500}>
        Stitch Options
      </Text>
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
      <Modal
        ref={ref}
        title="Stitch Options"
        onModalClose={closeOrBack}
        onModalSuccess={handleSaveData}
        saveButtonText={activeIndex < tabNameList.length - 1 ? 'Next' : 'Save'}
        closeButtonText={activeIndex === 0 ? 'Close' : 'Back'}
      >
        {!_isNil(optionsList) && optionsList.length > 0 && (
          <Tabs
            defaultIndex={activeIndex}
            isSticky={false}
            tabNameList={tabNameList}
            onTabChange={onTabChange}
          >
            {optionsList.map((option, index) => (
              <OptionListContainer key={index}>
                <DynamicForm
                  formFields={option.stitch_options}
                  onChange={(value: any, key: number) => updateStitchOption(value, key)}
                />
              </OptionListContainer>
            ))}
          </Tabs>
        )}
      </Modal>
      <Loader showLoader={isLoading} />
    </StitchOptionsContainer>
  );
};

export default StitchOptions;
