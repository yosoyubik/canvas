<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Modal, FormGroup, Button } from "carbon-components-svelte";
  import Paint32 from "carbon-icons-svelte/lib/PaintBrush32";
  import { Sveltik, Form, Field, ErrorMessage } from 'sveltik'
  import store from '../store';
  import type { CanvasForm } from '../types/canvas';

  const dispatch = createEventDispatcher();

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

  let open = false,
      isSubmitting = false;

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
      console.log('[ creating canvas... ]');
      $store.api.create(
        values.name,
        '~' + $store.ship,
        values.template,
        values.private,
        values.width,
        values.height,
      ).then((data) => {
        console.log('[ success new canvas... ]', values.name, data);
        dispatch('newcanvas', { name: values.name } );
        open = false;
        isSubmitting = false;
      })
  }
</script>


<Button
  icon={Paint32}
  kind="ghost"
  size='small'
  on:click={() => (open = true)} >
  Create
</Button>

<Modal
  size='xs'
  bind:open
  passiveModal
  modalHeading=''
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
>
  <Sveltik {initialValues} {validate} {onSubmit} bind:isSubmitting>
    <Form>
      <FormGroup legendText="Canvas">
        <Field type="name" name="name" placeholder='Name...' />
        <Field as="select" name="template">
          {#each Object.keys(templates) as template}
            <option value="{template}">
              {template}
            </option>
          {/each}
        </Field>
        <Field type="checkbox" name="private" checked />
        <span>Private</span>
       <ErrorMessage name="name" as="span" />
      </FormGroup>
      <FormGroup legendText="Dimensions (width x height)">
        <Field as='TextInput' type="number" name="width" placeholder='width...'/>
        <Field as='TextInput' type="number" name="height" placeholder='height...'/>
          <ErrorMessage name="width" as="div" />
          <ErrorMessage name="height" as="div" />
      </FormGroup>
       <Button size='small' type="submit" disabled={isSubmitting}>Create</Button>
    </Form>
  </Sveltik>
</Modal>

