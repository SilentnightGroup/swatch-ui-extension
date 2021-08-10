import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { SelectField, Option } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import axios from "axios";

export const App = ({sdk}) => {
  const [value, setValue] = useState(sdk.field.getValue() || '');
  const [fieldOptions, setFieldOptions] = useState([]);

  const onExternalChange = value => {
    setValue(value);
  }

  const onChange = e => {
    const value = e.currentTarget.value;
    setValue(value);
    if (value) {
      sdk.field.setValue(value);
    } else {
      sdk.field.removeValue();
    }
  }

  /**
   * Example response from API endpoint
   * [
       {
        "product_id": "20",
        "product_name": "Blue Fabric Swatch"
      },
       {
        "product_id": "21",
        "product_name": "Red Fabric Swatch"
      },
       {
        "product_id": "22",
        "product_name": "Blue Fabric Swatch"
      },
       {
        "product_id": "23",
        "product_name": "Yellow Fabric Swatch"
      }
     ]
   */
  useEffect(() => {
    const API_ENDPOINT = sdk.parameters.installation.apiEndpoint;
    const headers = {
      'Content-Type': 'application/json',
    }
    axios.get(API_ENDPOINT, headers).then(response => {
      setFieldOptions(response.data);
    });
  }, [])

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, []);

  useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return detatchValueChangeHandler;
  });

  return (
    <SelectField
        id="swatches"
        name="swatches"
        selectProps="large"
        onChange={onChange}
        helpText="Please pick a swatch to associate"
        labelText="Swatch Selection"
    >
      <Option selected={value === ""} key={0} value="">Please select...</Option>
      {fieldOptions.map(item =>
          <Option selected={item.product_id == value} key={item.product_id} value={item.product_id}>{item.product_name}</Option>
      )}
    </SelectField>
  );
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
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
