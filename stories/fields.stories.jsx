import React from 'react';
import Formol from '../src';
import { knobs, testFieldValue, typeFields } from './fields';
import { withStateForm } from './utils';

const filterDefined = o =>
  Object.entries(o).reduce((filtered, [k, v]) => {
    if (v || v === 0) {
      filtered[k] = v;
    }
    return filtered;
  }, {});

export default {
  title: 'Field Test/Fields',
  decorators: [withKnobs],
};

// Utility function to create a story for each field type
const createFieldStory = (TypeField, name, initialValue = {}) => {
  const StoryComponent = (props) => (
    <Formol {...props}>
      <h1>{name}</h1>
      <TypeField {...filterDefined(knobs(name))} />
    </Formol>
  );
  return withStateForm(StoryComponent, initialValue);
};

// Stories for fields without initial values
Object.entries(typeFields).forEach(([name, TypeField]) => {
  export const [`${name}Field`] = () => createFieldStory(TypeField, name);
});

// Stories for fields with initial values
Object.entries(typeFields).forEach(([name, TypeField]) => {
  const initialValue = { [name]: testFieldValue(name) };
  export const [`${name}FieldWithInitial`] = () => createFieldStory(TypeField, name, initialValue);
});
