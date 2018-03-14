import React from 'react';
import PropTypes from 'prop-types';
import SliderWithInput from './slider-with-input';

const propTypes = {
  value: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  t: PropTypes.func,
};

export const ItemsPerRow = props => {
  const { t } = props;
  const itemsPerRowLabel = t('GallerySettings_Sliders_Items_Per_Row');
  return <SliderWithInput min={1} max={5} label={itemsPerRowLabel} {...props} />;
};
ItemsPerRow.propTypes = propTypes;

export const Spacing = props => {
  const { t } = props;
  const spacingLabel = t('GallerySettings_Spacing_Between_Items');
  return <SliderWithInput label={spacingLabel} {...props} />;
};
Spacing.propTypes = propTypes;

export const ThumbnailSize = props => (
  <SliderWithInput
    min={10}
    max={1000}
    readOnly={props.options.readOnly}
    label={props.options.label}
    {...props}
  />
);
ThumbnailSize.propTypes = propTypes;
