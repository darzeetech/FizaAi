import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { BiSolidDownload } from 'react-icons/bi';

import { api } from '../../../../../utils/apiRequest';
import { handleDownloadInvoice } from '../../../../../utils/common';
import {
  Button,
  IconWrapper,
  Loader,
  Popover,
  PopoverMethods,
  Text,
  toasts,
  Modal,
  ModalMethods,
} from '../../../../../ui-component';
import {
  AudioRecordField,
  BulkImageUploadField,
  InputField,
} from '../../../../../components/FormComponents';
import { ChevronDownFilledIcon, MenuIcon } from '../../../../../assets/icons';
import MeasurementSummary from '../../../components/MesurementSummary';
import { outfitStatusOptions } from '../../constant';
import type { OutfitObjType } from '../../type';
import { RiWhatsappFill } from 'react-icons/ri';

import {
  OutfitChipContent,
  OutfitDetailsContainer,
  OutfitSummaryContent,
  OutfitSummaryHeader,
  StatusContainer,
  StatusMenuContainer,
  StatusOptionItemText,
  StatusText,
} from './style';

type OutfitSummaryDetailsProps = {
  outfitList: OutfitObjType[];
  currentItemId: number;
  boutiqueOrderId: number;
  orderNumber: number;
  orderStatus: string;
  setCurrentItemId: (id: number) => void;
  onOutfitSheetClose: () => void;
};

const OutfitSummaryDetails = ({
  currentItemId,
  orderNumber,
  boutiqueOrderId,
  orderStatus,
  outfitList,
  setCurrentItemId,
  onOutfitSheetClose,
}: OutfitSummaryDetailsProps) => {
  const navigate = useNavigate();
  //   const menuRef = useRef<PopoverMethods>(null);
  const statusMenuRef = useRef<PopoverMethods>(null);

  const [itemDetailsById, setItemDetailsById] = useState<Record<number, any>>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<keyof typeof outfitStatusOptions>('');

  const [outfitSummaryLink, setOutfitSummaryLink] = useState('');

  const itemDetails = !_isNil(itemDetailsById) ? itemDetailsById[currentItemId] : null;

  const [shareMessage, setShareMessage] = useState<string>('');

  //const entity_id = data?.order_summary?.boutique_order_id;

  const getTrackingDetails = async () => {
    try {
      const payload = {
        entity_id: currentItemId,
        entity_type: 'ORDER_ITEM',
      };

      const response = await api.postRequest('tracking/track', payload);

      if (response.status) {
        const { share_message } = response.data;

        setShareMessage(share_message);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'tracking-error');
      }
    }
  };

  // eslint-disable-next-line no-console
  //console.log(shareMessage);
  useEffect(() => {
    if (currentItemId && currentItemId > 0) {
      void getTrackingDetails();
    }
  }, [currentItemId]);

  useEffect(() => {
    if (currentItemId && currentItemId > 0) {
      if (_isNil(itemDetailsById) || _isNil(itemDetailsById[currentItemId])) {
        void getItemDetailsById();
      }
      void getOutfitSummaryLink();
    }
  }, [currentItemId]);

  useEffect(() => {
    if (!_isNil(itemDetails)) {
      setCurrentStatus(itemDetails.status);
    }
  }, [JSON.stringify(itemDetails)]);

  const getItemDetailsById = async () => {
    // Validate currentItemId before making API call
    if (!currentItemId || currentItemId <= 0) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.getRequest(`order_item/${currentItemId}`);
      const { status, data } = response;
      // eslint-disable-next-line no-console
      //console.log('nicn', data);

      if (status) {
        setItemDetailsById({
          ...itemDetailsById,
          [currentItemId]: data,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'get-order-item-error');
      }
    }
    setIsLoading(false);
  };

  const getOutfitSummaryLink = async () => {
    // Validate currentItemId before making API call
    if (!currentItemId || currentItemId <= 0) {
      return;
    }

    try {
      const payload = {
        entity_type: 'item_details',
        entity_id: currentItemId,
        copy_type_ordinal: 3,
      };
      setIsLoading(true);
      const response = await api.postRequest(`storage/file/link`, payload);
      const { status, data } = response;

      if (status) {
        setOutfitSummaryLink(data.link);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'get-outfit-summary-link-error');
      }
    }
    setIsLoading(false);
  };

  const handleEditButton = () => {
    if (orderStatus === 'Drafted') {
      navigate(`/orders/${orderNumber}?formType=edit`);
    } else {
      navigate(`/orders/${orderNumber}/${currentItemId}?formType=edit`);
    }
  };

  const handleUpdateStatus = async (option: Record<string, any>) => {
    try {
      setIsLoading(true);
      const details = { item_status: option.value };
      const response = await api.putRequest(`order_item/${currentItemId}`, details);

      const { status } = response;

      if (status) {
        setCurrentStatus(option.label);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'update-item-status-error');
      }
    }

    setIsLoading(false);
  };

  const closePopups = () => {
    statusMenuRef.current?.hide();
  };

  // Add this ref at the top of component
  const deleteModalRef = useRef<ModalMethods>(null);

  // Add these functions inside component
  const handleDeleteOutfitClose = () => {
    deleteModalRef.current?.hide();
    statusMenuRef.current?.hide();
    closePopups();
  };

  const handleOutfitDelete = async () => {
    try {
      setIsLoading(true);
      const response = await api.putRequest(`order_item/${currentItemId}`, {
        is_deleted: true,
      });

      const { status } = response;

      if (status) {
        // First reset states
        setCurrentItemId(0);
        setItemDetailsById({});

        // Close all modals and popups
        deleteModalRef.current?.hide();
        statusMenuRef.current?.hide();
        closePopups();

        // Force close the outfit sheet
        onOutfitSheetClose();

        // Navigate last with replace to prevent back navigation

        if (location.pathname.includes('orders-list')) {
          navigate('/orders-list', { replace: true, state: { forceClose: true } });
        } else if (location.pathname.includes('selectcustomer')) {
          navigate('/selectcustomer', { replace: true, state: { forceClose: true } });
        }

        window.location.reload();

        toasts('success', 'Outfit deleted successfully', 'outfit-deletion');
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'delete-outfit-error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  //eslint-disable-next-line
  const menuLauncher = (
    <IconWrapper>
      <MenuIcon />
    </IconWrapper>
  );

  const statusLauncher = (
    <StatusContainer status={currentStatus}>
      <StatusText fontWeight={500} status={currentStatus}>
        {currentStatus}
      </StatusText>

      {outfitStatusOptions[currentStatus].length > 0 && <ChevronDownFilledIcon />}
    </StatusContainer>
  );

  if (_isNil(itemDetailsById) || _isNil(itemDetailsById[currentItemId])) {
    return null;
  }

  //const [selectedOutfitChipIndex, setSelectedOutfitChipIndex] = useState(0);
  const handleChange = (value: string, field: string) => {
    const updatedItemDetails = {
      ...itemDetailsById,
      [currentItemId]: {
        ...itemDetailsById[currentItemId],
        [field]: value,
      },
    };
    setItemDetailsById(updatedItemDetails);
  };

  // const handleShare = async () => {
  //   try {
  //     const payload = {
  //       entity_type: 'item_details',
  //       entity_id: currentItemId,
  //     };
  //     setIsLoading(true);
  //     const response = await api.postRequest(`storage/file/link`, payload);
  //     const { status, data } = response;

  //     if (status && data.link) {
  //       const whatsappURL = `https://wa.me/send?text=${encodeURIComponent(data.link)}`;
  //       window.open(whatsappURL, '_blank');
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       toasts('error', err.message, 'share-outfit-error');
  //     }
  //   }
  //   setIsLoading(false);
  // };
  // const handleShare = async () => {
  //   if (!outfitSummaryLink) {
  //     await getOutfitSummaryLink(); // Ensure link is available
  //   }

  //   try {
  //     setIsLoading(true);
  //     const fileName = `${boutiqueOrderId ?? ''}_${itemDetails.outfit_alias}_outfit_summary.pdf`;

  //     const response = await fetch(outfitSummaryLink);
  //     const blob = await response.blob();
  //     const file = new File([blob], fileName, { type: 'application/pdf' });

  //     // Try native sharing first
  //     const shareData = {
  //       files: [file],
  //       title: fileName,
  //     };

  //     if (navigator.canShare && navigator.canShare(shareData)) {
  //       await navigator.share(shareData);
  //     } else {
  //       // Fallback to WhatsApp web sharing
  //       const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
  //         'Sharing outfit summary PDF'
  //       )}`;
  //       window.open(whatsappURL, '_blank');
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       toasts('error', err.message, 'share-outfit-error');
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleShare = async () => {
    try {
      setIsLoading(true);
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappURL, '_blank');
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'share-outfit-error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const location = useLocation();

  return (
    <OutfitDetailsContainer onClick={closePopups}>
      <OutfitSummaryHeader>
        <Text fontWeight={500}> Outfit Details</Text>
        <div className="header-btn-container">
          {!location.pathname.includes('order_tracking') &&
            !location.pathname.includes('order_item_tracking') && (
              <>
                <Button appearance="outlined" onClick={() => deleteModalRef.current?.show()}>
                  Delete
                </Button>
                <Button appearance="outlined" onClick={handleEditButton}>
                  Edit
                </Button>
              </>
            )}

          <Button
            appearance="outlined"
            onClick={() => {
              handleDownloadInvoice(
                outfitSummaryLink,
                `${boutiqueOrderId ?? ''}_${itemDetails.outfit_alias}_outfit_summary.pdf`
              );

              //   window.open(invoiceLink, '_blank');
            }}
            trailingIcon={<BiSolidDownload color="var(--color-primary)" size={16} />}
          >
            Download pdf
          </Button>
          {/* <Button appearance="outlined" onClick={handleShare}>
            Share
          </Button> */}
          <RiWhatsappFill
            className=" text-green-600 text-[2.2rem] border-[1.2px] p-[2px] rounded-md  border-blue-600 cursor-pointer"
            onClick={handleShare}
          />
        </div>
        {/* <Popover statusMenuR{menuRef} laucher={menuLauncher}>
          <div className="menu-container">
            <div className="menu-item">Edit</div>
          </div>
        </Popover> */}
      </OutfitSummaryHeader>
      <OutfitSummaryContent>
        <div className="flex justify-start content-center flex-wrap gap-2.5">
          {outfitList.map((outfit, index) => (
            <OutfitChipContent
              key={index}
              isSelected={currentItemId === outfit.item_id}
              onClick={() => setCurrentItemId(outfit.item_id)}
            >
              <img src={outfit.outfit_type_image_link ?? ''} alt={outfit.outfit_type} />
              <Text size="small" fontWeight={600} color="black">
                {outfit.outfit_alias}
              </Text>
            </OutfitChipContent>
          ))}
        </div>
        <div className=" w-full  flex md:flex-row flex-col justify-between   gap-3">
          <div className=" md:w-[50%] flex md:flex-col flex-row md:items-start items-center  md:gap-1.5 gap-4">
            <Text>Item Status</Text>

            {location.pathname.includes('order_tracking') ? (
              <>
                <StatusContainer status={currentStatus}>
                  <StatusText fontWeight={500} status={currentStatus}>
                    {currentStatus}
                  </StatusText>
                </StatusContainer>
              </>
            ) : (
              <>
                {currentStatus !== 'Drafted' ? (
                  <Popover ref={statusMenuRef} laucher={statusLauncher}>
                    <StatusMenuContainer>
                      {outfitStatusOptions[currentStatus]
                        .filter((option) => option.label !== currentStatus)
                        .map((option, index) => (
                          <div
                            key={index}
                            className="stitch-option-item"
                            onClick={() => handleUpdateStatus(option)}
                          >
                            <StatusOptionItemText status={option.label}>
                              {option.label}
                            </StatusOptionItemText>
                          </div>
                        ))}
                    </StatusMenuContainer>
                  </Popover>
                ) : (
                  <>{statusLauncher}</>
                )}
              </>
            )}
          </div>
          <div className=" md:w-[50%] flex flex-col gap-1.5 md:items-end w-full  ">
            <div className="flex md:justify-start justify-between items-start gap-3">
              <Text fontWeight={600}>Order Number:</Text>
              <Text color="black" fontWeight={500}>
                {boutiqueOrderId}
                {'~'}
                {itemDetails.other_reference_id}
              </Text>
            </div>

            <div className="flex md:justify-start justify-between items-start gap-3">
              <Text fontWeight={600}>Trial Date:</Text>
              <Text color="black" fontWeight={500}>
                {!_isNil(itemDetails.trial_date) && !_isEmpty(itemDetails.trial_date)
                  ? new Date(itemDetails.trial_date).toDateString()
                  : '-'}
              </Text>
            </div>
            <div className="flex md:justify-start justify-between items-start gap-3">
              <Text fontWeight={600}>Delivery Date:</Text>
              <Text color="black" fontWeight={500}>
                {!_isNil(itemDetails.delivery_date) && !_isEmpty(itemDetails.delivery_date)
                  ? new Date(itemDetails.delivery_date).toDateString()
                  : '-'}
              </Text>
            </div>
          </div>
        </div>

        <MeasurementSummary
          customMeasurementDetails={
            itemDetails?.measurement_details?.inner_measurement_details ?? []
          }
          measurementImageLink={itemDetails?.measurement_details?.measurement_image_link ?? ''}
          stitchOptions={itemDetails?.order_item_stitch_options}
        />

        {!_isEmpty(itemDetails?.special_instructions) && (
          <InputField
            label="Special Instructions"
            placeholder="Write Instructions given by customer"
            type="textarea"
            required={false}
            value={itemDetails?.special_instructions ?? ''}
            disabled={true}
          />
        )}

        {!_isEmpty(itemDetails?.audio_file_details) && (
          <AudioRecordField
            label="Record Audio"
            type="file"
            required={false}
            value={itemDetails?.audio_file_details ?? []}
            multiple={true}
            maxUpload={5}
            disabled={true}
          />
        )}

        {!_isEmpty(itemDetails?.inspiration) && (
          <div>
            <Text fontWeight={500}>Add Inspiration</Text>
            <div
              className="inspiration-text"
              onClick={() => {
                const link = itemDetails.inspiration.includes('https://')
                  ? itemDetails.inspiration
                  : `https://${itemDetails.inspiration}`;
                window.open(link, '_blank');
              }}
            >
              <Text color="primary" fontWeight={400}>
                {itemDetails.inspiration ?? ''}
              </Text>
            </div>
          </div>
          //   <InputField
          //     label="Add Inspiration"
          //     placeholder="https://www.google.com"
          //     type="textarea"
          //     required={false}
          //     value={itemDetails?.inspiration ?? ''}
          //     disabled={true}
          //   />
        )}

        {!_isEmpty(itemDetails?.cloth_image_file_details) && (
          <BulkImageUploadField
            label="Upload Cloth Images"
            placeholder="Upload Cloth Images"
            type="file"
            required={false}
            multiple={true}
            maxUpload={10}
            value={itemDetails?.cloth_image_file_details ?? []}
            disabled={true}
          />
        )}
      </OutfitSummaryContent>

      <Modal
        ref={deleteModalRef}
        size="small"
        saveButtonText="Delete"
        closeButtonText="Back"
        showCloseIcon={true}
        onModalClose={handleDeleteOutfitClose}
        onModalSuccess={handleOutfitDelete}
        title="Delete outfit?"
      >
        <div className="pt-[4px]">
          {/* <Text color="black" fontWeight={600}>
            Do you really want to delete this outfit?
          </Text> */}
          <InputField
            label=" Do you really want to delete this outfit?       Refund advance amount"
            placeholder="0"
            type="text"
            required={false}
            value={itemDetails?.amount_refunded ?? ''}
            onChange={(value) => handleChange(value, 'amount_refunded')}
          />
        </div>
      </Modal>
      <Loader showLoader={isLoading} />
    </OutfitDetailsContainer>
  );
};
export default OutfitSummaryDetails;
