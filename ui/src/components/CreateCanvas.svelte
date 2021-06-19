<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  import { Modal, FormGroup, Button } from "carbon-components-svelte";
  import Add16 from "carbon-icons-svelte/lib/Add16";
  import { Sveltik, Form, Field, ErrorMessage } from 'sveltik'
  import store from '../store';
  import type { CanvasForm } from '../types/canvas';

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

  let open = false;

  let initialValues: CanvasForm = {
      name: '',
      private:  true,
      template: 'mesh',
      width: 1500,
      height: 1000,
  }

  let validate = (values: CanvasForm) => {
      const errors = { name: '', width: '', height: '' };
      if (values.name === '') {
          errors.name = 'Name Required'
      }
      if (values.width < 648) {
          errors.width = 'Min width 648'
      }
      if (values.width > 1500) {
          errors.width = 'Max width 1500'
      }
      if (values.height < 648) {
          errors.height = 'Min height 648'
      }
      if (values.height > 1000) {
          errors.height = 'Max height 1000'
      }
      console.log(errors);
      return errors
  }

  let onSubmit = (values: CanvasForm, { setSubmitting }) => {
      console.log('[ creating canvas... ]')
      $store.api.create(
        values.name,
        '~' + $store.ship,
        values.template,
        values.private,
        values.width,
        values.height,
      ).then((data) => {
        console.log('done', data);
        setSubmitting(false);
        goto(`${base}/c/${values.name}`);
      })
  }
</script>


<Button
  icon={Add16}
  kind="ghost"
  size='small'
  on:click={() => (open = true)} >
  Create Canvas
</Button>

<Modal
  size='xs'
  bind:open
  passiveModal
  modalHeading="Create new canvas"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
>
  <Sveltik {initialValues} {validate} {onSubmit} let:isSubmitting>
    <Form>
      <FormGroup legendText="Name">
        <Field type="name" name="name" />
        <ErrorMessage name="name" as="span" />
      </FormGroup>
      <FormGroup legendText="Dimensions">
        <Field as='TextInput' type="number" name="width" />
        <Field as='TextInput' type="number" name="height" />
          <ErrorMessage name="width" as="div" />
          <ErrorMessage name="height" as="div" />
      </FormGroup>
      <FormGroup legendText="Options">
        <Field as="select" name="template">
          {#each Object.keys(templates) as template}
            <option value={template}>
              {template}
            </option>
          {/each}
        </Field>
        <Field type="checkbox" name="private" checked />
        <span>Private</span>
      </FormGroup>
       <Button size='small' type="submit" disabled={isSubmitting}>Submit</Button>
    </Form>
  </Sveltik>
</Modal>

