import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Image from '~/Components/Image';
import SettingsSection from '~/Components/SettingsSection';
import getImageSrc from '../get-image-source';
import InputWithLabel from '~/Components/InputWithLabel';
import SettingsPanelFooter from '~/Components/SettingsPanelFooter';
import LinkPanel from '../../../Components/LinkPanel';
import styles from './image-settings.scss';
import ImageSettingsMobileHeader from './image-settings-mobile-header';
import { mergeStyles } from '~/Utils/mergeStyles';

class ImageSettings extends Component {
  constructor(props) {
    super(props);
    this.state = this.propsToState(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  propsToState(props) {
    const initialImageState = { ...props.componentData.item };
    return {
      item: props.componentData.item,
      initialImageState,
    };
  }

  componentDidMount() {
    this.props.pubsub.subscribe('componentData', this.onComponentUpdate);
  }

  componentWillUnmount() {
    this.props.pubsub.unsubscribe('componentData', this.onComponentUpdate);
  }

  onComponentUpdate = () => this.forceUpdate();

  setLinkPanel = linkPanel => this.linkPanel = linkPanel;

  revertComponentData () {
    const { componentData, helpers, pubsub } = this.props;
    const { initialImageState } = this.state;
    if (initialImageState) {
      componentData.item = initialImageState;
      pubsub.set('componentData', componentData);
    }
    this.setState({ item: initialImageState });

    helpers.closeModal();
  }

  imageMetadataUpdated = (image, value) => {
    image.metadata = Object.assign({}, image.metadata, value);
    this.setState({ item: this.state.item });
  };

  wrapBlockInLink = ({ url, targetBlank, nofollow }) => {
    const { pubsub } = this.props;
    if (!isEmpty(url)) {
      pubsub.set('componentLink', { url, targetBlank, nofollow });
    } else {
      pubsub.set('componentLink', null);
    }
  };

  addMetadataToBlock = () => {
    const { pubsub } = this.props;
    const { alt, caption } = this.state.item.metadata || {};
    const metadata = {
      alt: alt || undefined,
      caption: caption || undefined,
    };
    pubsub.update('componentData', { item: { metadata } });
  };

  deleteLink = () => {
    this.props.pubsub.set('componentLink', null);
  }

  onDoneClick = () => {
    const { helpers } = this.props;
    if (this.linkPanel.state.isValidUrl && this.linkPanel.state.url) {
      const { url, targetBlank, nofollow } = this.linkPanel.state;
      this.wrapBlockInLink({ url, targetBlank, nofollow });
    } else if (this.linkPanel.state.intermediateUrl === '') {
      this.deleteLink();
    }
    if (this.state.item.metadata) {
      this.addMetadataToBlock();
    }
    helpers.closeModal();
  };

  render() {
    const { componentData, helpers, theme, t, isMobile } = this.props;
    const { item } = componentData;
    if (!item) {
      return; //do not render until the item is passed
    }

    const { metadata = {} } = item;
    const { url, targetBlank, nofollow } = (!isEmpty(componentData.config.link) ? componentData.config.link : {});
    const updateLabel = t('ImageSettings_Update');
    const headerText = t('ImageSettings_Header');
    const captionLabel = t('ImageSettings_Caption_Label');
    const captionInputPlaceholder = t('ImageSettings_Caption_Input_Placeholder');
    const altLabel = t('ImageSettings_Alt_Label');
    const altInputPlaceholder = t('ImageSettings_Alt_Input_Placeholder');
    const linkLabel = t('ImageSettings_Link_Label');

    return (
      <div className={this.styles.imageSettings}>

        { isMobile ?
          <ImageSettingsMobileHeader
            t={t}
            theme={theme}
            cancel={() => this.revertComponentData()}
            save={() => this.onDoneClick()}
            saveName={updateLabel}
          /> :
          <h3 className={this.styles.imageSettingsTitle}>{headerText}</h3>
        }
        <div className={classNames(styles.imageSettings_scrollContainer, { [styles.imageSettings_mobile]: isMobile })}>
          <SettingsSection theme={theme}>
            <Image resizeMode={'contain'} className={this.styles.imageSettingsImage} src={getImageSrc(item, helpers)} />
          </SettingsSection>
          <SettingsSection theme={theme} className={this.styles.imageSettingsSection}>
            <InputWithLabel
              theme={theme}
              label={captionLabel}
              placeholder={captionInputPlaceholder}
              value={metadata.caption || ''}
              onChange={event => this.imageMetadataUpdated(item, { caption: event.target.value })}
            />
          </SettingsSection >
          <SettingsSection theme={theme} className={this.styles.imageSettingsSection}>
            <InputWithLabel
              theme={theme}
              label={altLabel}
              placeholder={altInputPlaceholder}
              value={metadata.alt || ''}
              onChange={event => this.imageMetadataUpdated(item, { alt: event.target.value })}
            />
          </SettingsSection>
          <SettingsSection theme={theme} className={this.styles.imageSettingsSection}>
            <label className={this.styles.inputWithLabel_label}>{linkLabel}</label>
          </SettingsSection>
          <div className={this.styles.imageSettingsLinkContainer}>
            <LinkPanel
              ref={this.setLinkPanel}
              theme={theme}
              url={url}
              targetBlank={targetBlank}
              nofollow={nofollow}
              isImageSettings
              t={t}
            />
          </div>
        </div>
        {isMobile ? null : <SettingsPanelFooter
          fixed
          theme={theme}
          cancel={() => this.revertComponentData()}
          save={() => this.onDoneClick()}
          t={t}
        />
        }

      </div>
    );
  }
}
ImageSettings.propTypes = {
  componentData: PropTypes.any.isRequired,
  helpers: PropTypes.object,
  theme: PropTypes.object.isRequired,
  pubsub: PropTypes.any,
  t: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default ImageSettings;
