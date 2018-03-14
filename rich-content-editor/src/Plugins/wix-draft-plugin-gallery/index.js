import createBasePlugin from '../base/basePlugin';
import createToolbar from './toolbar';
import { Component } from './gallery-component';
import { GALLERY_TYPE } from './types';

const createGalleryPlugin = (config = {}) => {
  const { decorator, helpers, theme, isMobile, t } = config;

  return createBasePlugin({
    component: Component,
    decorator,
    theme,
    t,
    type: GALLERY_TYPE,
    toolbar: createToolbar({
      helpers,
      t
    }),
    helpers,
    isMobile,
  });
};

export { createGalleryPlugin, GALLERY_TYPE };
