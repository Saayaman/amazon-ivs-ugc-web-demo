import React from "react";
import PropTypes from "prop-types";

export default class SettingsField extends React.PureComponent {
  render() {
    const { labelName, inputId, className } = this.props;

    let formattedClassName = "";
    if (className) {
      formattedClassName = ` ${className}`;
    }

    return (
      <div className={`settings-field${formattedClassName}`}>
        <label className={`label`} htmlFor={`${inputId}`}>
          {labelName}
        </label>
        <div className="settings-input-group">{this.props.children}</div>
      </div>
    );
  }
}

SettingsField.propTypes = {
  labelName: PropTypes.string,
  inputId: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
