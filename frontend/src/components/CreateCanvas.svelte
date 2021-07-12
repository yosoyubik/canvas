<script lang="ts">
  import { Sveltik, Form, Field, ErrorMessage } from 'sveltik'
  import store from '../store';
  import { push, pop, replace } from 'svelte-spa-router'


  const templates = {
    'mesh': 'Hexagon Mesh',
    'mesh-welcome': 'Canvas Logo',
    'mesh-bitcoin': 'Bitcoin',
    'mesh-sigil': 'Sigil',
    'mesh-martian': 'Martian',
    'mesh-crypto': 'Cryptonomicon',
    'mesh-yc-hn': 'Hacker News',
    'mesh-tile': 'Easel',
    'mesh-guy': 'Guybrush Threepwood',
    'mesh-life': 'Other Life',
    'mesh-public': 'Public Moon',
  };

  let initialValues = {
      name: '',
      private:  true,
      template: 'mesh'
  }

  let validate = values => {
      const errors = { name: '' };
      if (values.name === '') {
          errors.name = 'Required'
      }
      return errors
  }

  let onSubmit = (values, { setSubmitting }) => {
    console.log(values);
      // name, location, template, access, width, height
      $store.api.create(
        values.name,
        '~' + $store.ship,
        values.template,
        values.private,
        $store.width,
        $store.height,
      ).then(() => {
        setSubmitting(false);
        push(`/canvas/${values.name}`);
      })
    
  }
</script>

<Sveltik {initialValues} {validate} {onSubmit} let:isSubmitting>
  <Form>
    <Field type="name" name="name" />
    <ErrorMessage name="name" as="div" />
    <Field as="select" name="template">
      {#each Object.keys(templates) as template}
        <option value={template}>
          {template}
        </option>
      {/each}
    </Field>
    <span>Private: </span>
    <Field type="checkbox" name="private" checked />
    <button type="submit" disabled={isSubmitting}>New</button>
  </Form>
</Sveltik>

