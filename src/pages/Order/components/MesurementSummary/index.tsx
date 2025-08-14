import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';
import _isNil from 'lodash/isNil';

import { Text } from '../../../../ui-component';
import { BulkImageUploadField } from '../../../../components/FormComponents';

import type { CustomMeasurementsDetailsType } from '../../CreateOrder/components/OrderDetails/components/Measurements/CustomMeasurements';
import { MeasurementSummaryContainer } from './style';

export type StitchOptionSummaryObj = {
  label: string;
  order_stitch_option_id: number;
  stitch_option_id: number;
  outfit_side: string;
  type: string;
  value: string;
};

type MeasurementSummaryProps = {
  customMeasurementDetails: CustomMeasurementsDetailsType[];
  measurementImageLink: string;
  stitchOptions: Record<string, StitchOptionSummaryObj[]>;
};

const MeasurementSummary = ({
  customMeasurementDetails,
  measurementImageLink,
  stitchOptions,
}: MeasurementSummaryProps) => {
  const showAlias = customMeasurementDetails.length > 1;

  const stitchOptionSides = Object.keys(stitchOptions);

  const hasImageMeasurement = !_isEmpty(measurementImageLink);
  const hasCustomMeasurement = customMeasurementDetails.length > 0;

  if (!hasImageMeasurement && !hasCustomMeasurement) {
    return null;
  }

  return (
    <div>
      {!location.pathname.includes('order_tracking') && (
        <Text fontWeight={500} color={'black'}>
          Measurement
        </Text>
      )}

      <MeasurementSummaryContainer>
        {hasCustomMeasurement &&
          !hasImageMeasurement &&
          customMeasurementDetails.map((measurement, index) => {
            const alias = measurement.outfit_type_heading.toLowerCase().includes('top')
              ? 'Top'
              : 'Bottom';
            const currentSide = stitchOptionSides.find((side) =>
              alias.toLowerCase().includes(side.toLowerCase())
            );

            const hasStitchOptions =
              !_isNil(stitchOptionSides) &&
              !_isEmpty(stitchOptions) &&
              (showAlias
                ? !_isUndefined(currentSide) && stitchOptions[currentSide].length > 0
                : stitchOptions[stitchOptionSides[0]].length > 0);

            const hasMeasurement = measurement.measurement_details_list.length > 0;

            if (!hasMeasurement && !hasStitchOptions) {
              return null;
            }

            return (
              <div className="box" key={index}>
                {showAlias && (
                  <div className="alias">
                    <Text fontWeight={600}>{alias}</Text>
                  </div>
                )}
                {measurement.measurement_details_list.length > 0 &&
                  !location.pathname.includes('order_tracking') && (
                    <div className="details-container">
                      {measurement.measurement_details_list.map((currDetail, currIndex) => (
                        <div key={currIndex} className="details">
                          <div className="img-title-container">
                            <div className="img-div">
                              <img src={currDetail.image_link} alt="type-pic" />
                            </div>
                            <Text fontWeight={500} size="small" className="title-text">
                              {currDetail.title}
                            </Text>
                          </div>
                          <Text fontWeight={500} size="small">
                            {currDetail.value}
                          </Text>
                        </div>
                      ))}
                    </div>
                  )}

                {hasStitchOptions && (
                  <div className="stitch-option-summary">
                    <Text fontWeight={700}>Stitch Options</Text>
                    <div className="stitch-detail-container">
                      {showAlias &&
                        !_isUndefined(currentSide) &&
                        stitchOptions[currentSide].map(
                          (currOption, currIndex) =>
                            currOption.value &&
                            currOption.value.trim() && (
                              <div className="stitch-item" key={currIndex}>
                                <Text size="small" fontWeight={700}>{`${currOption.label} :`}</Text>
                                <Text size="small" fontWeight={500}>
                                  {currOption.value}
                                </Text>
                              </div>
                            )
                        )}

                      {!showAlias &&
                        stitchOptions[stitchOptionSides[0]].map(
                          (currOption, currIndex) =>
                            currOption.value &&
                            currOption.value.trim() && (
                              <div className="stitch-item" key={currIndex}>
                                <Text size="small" fontWeight={700}>{`${currOption.label} :`}</Text>
                                <Text size="small" fontWeight={500}>
                                  {currOption.value}
                                </Text>
                              </div>
                            )
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        {hasImageMeasurement && (
          <>
            <BulkImageUploadField
              type="file"
              required={false}
              multiple={true}
              maxUpload={10}
              value={
                measurementImageLink
                  ? [
                      {
                        reference_id: '',
                        short_lived_url: measurementImageLink,
                      },
                    ]
                  : []
              }
              disabled={true}
              className="image-container"
            />

            {stitchOptionSides.map((sideName, index) => {
              const showAlias = stitchOptionSides.length > 1;
              const alias = sideName.toLowerCase().includes('top') ? 'Top' : 'Bottom';

              const hasStitchOptions = stitchOptions[sideName].length > 0;

              return (
                <div key={index} className="box">
                  {showAlias && (
                    <div className="alias">
                      <Text fontWeight={600}>{alias}</Text>
                    </div>
                  )}

                  {hasStitchOptions && (
                    <div className="stitch-option-summary">
                      <Text fontWeight={700}>Stitch Options</Text>
                      <div className="stitch-detail-container">
                        {stitchOptions[sideName].map((currOption, currIndex) => (
                          <div className="stitch-item" key={currIndex}>
                            <Text size="small" fontWeight={700}>{`${currOption.label} :`}</Text>
                            <Text size="small" fontWeight={500}>
                              {currOption.value}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </MeasurementSummaryContainer>
    </div>
  );
};

export default MeasurementSummary;
