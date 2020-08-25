
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { TextInput, SelectField, Option } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { colors, alignments, backgrounds, spacing } from './lists';

export class App extends Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };
  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);

    this.state = {
      value: props.sdk.field.getValue() || {
        background: 'blue-dark',
        spacingTop: 'spacing-t-0',
        spacingBottom: 'spacing-b-0',
        textColor: 'white',
        textAlignment: 'center'
      },
    }

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    if (value) {
      this.setState({ value });
    }
  };

  updateData = updatedEntry => {
    this.setState({ updatedEntry });
    if (updatedEntry) {
      this.props.sdk.field.setValue(updatedEntry);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  onChange = e => {
    let updatedValue = this.state.value;
    updatedValue[e.currentTarget.name] = e.currentTarget.value;
    this.updateData(updatedValue);
  };

  render() {
    return (
      <>
        <div className="background">
          <div className={`swatch ${this.state.value.background }`} />
          <SelectField
            id="background"
            name="background"
            labelText="Section Background Colour"
            helpText="Select the colour of the section background."
            value={this.state.value.background}
            onChange={this.onChange}
          >
            {backgrounds.map((background, i) => (
              <Option key={i} value={background.value}>
                {background.text}
              </Option>
            ))}
          </SelectField>
        </div>

        <div className="textColor">
          <div className={`swatch ${this.state.value.textColor }`} />
          <SelectField
            id="textColor"
            name="textColor"
            labelText="Section Text Colour"
            helpText="Select the colour of the text for the section."
            value={this.state.value.textColor}
            onChange={this.onChange}
          >
            {colors.map((color, i) => (
              <Option key={i} value={color.value}>
                {color.text}
              </Option>
            ))}
          </SelectField>
        </div>

        <div className="spacing">
          <SelectField
            id="spacingTop"
            name="spacingTop"
            labelText="Section Spacing - Top"
            helpText="Select how much space you want at the top of the section."
            value={this.state.value.spacingTop}
            onChange={this.onChange}
          >
            {spacing.map((space, i) => (
              <Option key={i} value={`spacing-t-${space.value}`}>
                {space.text}
              </Option>
            ))}
          </SelectField>

          <SelectField
            id="spacingBottom"
            name="spacingBottom"
            labelText="Section Spacing - Bottom"
            helpText="Select how much space you want at the bottom of the section."
            value={this.state.value.spacingBottom}
            onChange={this.onChange}
          >
            {spacing.map((space, i) => (
              <Option key={i} value={`spacing-b-${space.value}`}>
                {space.text}
              </Option>
            ))}
          </SelectField>
        </div>

        <div className="textAlignment">
          <SelectField
            id="textAlignment"
            name="textAlignment"
            labelText="Section Text Alignment"
            helpText="Select the overall text alignment the section."
            value={this.state.value.textAlignment}
            onChange={this.onChange}
          >
            {alignments.map((align, i) => (
              <Option key={i} value={align.value}>
                {align.text}
              </Option>
            ))}
          </SelectField>
        </div>
      </>
    );
  }
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
