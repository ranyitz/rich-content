import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isValidUrl } from '~/Utils/urlValidators';

import Tooltip from 'wix-style-react/dist/src/Tooltip';
import ErrorIcon from './icons/error.svg';

import Styles from '~/Styles/link-panel.scss';

class LinkPanel extends Component {
  constructor(props) {
    super(props);
    const { url, targetBlank, nofollow } = props;
    this.state = {
      intermediateUrl: url || '',
      url: url || '',
      isValidUrl: true,
      targetBlank: targetBlank || true,
      nofollow: nofollow || false,
    };
  }

  handleIntermediateUrlChange = event => {
    this.setState({ intermediateUrl: event.target.value });
  };

  handleUrlChange = () => {
    const { intermediateUrl } = this.state;
    this.setState({ url: intermediateUrl });
  };

  handleTargetChange = event => {
    this.setState({ targetBlank: event.target.checked });
  };

  handleNofollowChange = event => {
    this.setState({ nofollow: event.target.checked });
  };

  onBlur = e => {
    e.stopPropagation();
    const { intermediateUrl } = this.state;
    const { updateParentIfNecessary } = this.props;
    const isValidUrlConst = isValidUrl(intermediateUrl);
    if (isValidUrlConst) {
      this.handleUrlChange();
    }
    this.setState({ isValidUrl: isValidUrlConst });
    updateParentIfNecessary ? updateParentIfNecessary(!!(isValidUrlConst && this.state.url)) : false;
  };

  handleKeyPress = e => {
    if (e.charCode === 13) {
      this.onBlur(e);
    }
  };

  render() {
    const { isImageSettings } = this.props;
    const firstCheckboxText = 'Open Link in New Window / Tab';
    const secondCheckboxText = 'Add rel="nofollow" to link';
    const inputPlaceholder = isImageSettings ? 'Add a link' : 'e.g. www.wix.com';
    const textInputClassName = classNames(Styles.textInput,
      {
        [Styles.invalid]: !this.state.isValidUrl,
        [Styles.imageSettings]: isImageSettings
      }
    );
    return (
      <div className={Styles.linkPanelContent}>
        <div onKeyPress={this.handleKeyPress}>
          <div className={Styles.linkPanelInput}>
            <input
              ref={ref => (this.input = ref)}
              className={textInputClassName}
              placeholder={inputPlaceholder}
              onChange={this.handleIntermediateUrlChange}
              onBlur={this.onBlur}
              value={this.state.intermediateUrl}
            />
            {this.state.isValidUrl ? null : (
              <Tooltip
                content={'Invalid URL. Try Again'}
                textAlign="center"
                maxWidth=""
                shouldCloseOnClickOutside
                theme="dark"
              >
                <ErrorIcon className={Styles.errorIcon} />
              </Tooltip>
            )}
          </div>
        </div>
        <checkboxWrapper>
          <div className={Styles.checkboxContainer}>
            <input
              className={Styles.checkboxContainerInput} type="checkbox" id="firstCheckboxLinkPanel"
              onChange={this.handleTargetChange} defaultChecked={this.state.targetBlank}
            />
            <label className={Styles.checkboxContainerLabel} htmlFor="firstCheckboxLinkPanel">{firstCheckboxText}</label>
          </div>
          <div className={Styles.checkboxContainer}>
            <input
              className={Styles.checkboxContainerInput} type="checkbox"
              id="secondCheckboxLinkPanel" onChange={this.handleNofollowChange} defaultChecked={this.state.nofollow}
            />
            <label className={Styles.checkboxContainerLabel} htmlFor="secondCheckboxLinkPanel">{secondCheckboxText}</label>
          </div>
        </checkboxWrapper>
      </div>
    );
  }
}

LinkPanel.propTypes = {
  url: PropTypes.string,
  targetBlank: PropTypes.bool,
  nofollow: PropTypes.bool,
  updateParentIfNecessary: PropTypes.func,
  isImageSettings: PropTypes.bool,
};
export default LinkPanel;