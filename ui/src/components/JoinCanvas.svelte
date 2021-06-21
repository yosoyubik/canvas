<script lang="ts">
  import store from '../store';
  import { createEventDispatcher } from 'svelte';

  import { Modal, FormGroup, Button } from "carbon-components-svelte";
  import UserFollow32 from "carbon-icons-svelte/lib/UserFollow32";
  import { Sveltik, Form, Field, ErrorMessage } from 'sveltik'
  import type { CanvasForm } from '../types/canvas';

  const dispatch = createEventDispatcher();


  let open = false, isSubmitting = false;

  let initialValues = {
      name: '',
  }

  let validate = (values: CanvasForm) => {
      const errors = { name: '', width: '', height: '' };
      if (values.name === '') {
          errors.name = 'Name Required'
      }
      console.log(errors);
      return errors
  }

  let onSubmit = (values: CanvasForm, { setSubmitting }) => {
    const [location, name] = values.name.split('/')
    $store.api.join(location, name
    ).then(() => {
      console.log('[ success join canvas... ]', values.name);
      dispatch('joincanvas', { name: values.name } );
      open = false;
      isSubmitting = false;
    })
    console.log(values);
  }
</script>


<Button
  icon={UserFollow32}
  kind="ghost"
  size='small'
  on:click={() => (open = true)} >
  Join
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
      <FormGroup legendText="Remote Canvas Name ">
        <Field type="name" name="name" placeholder='~sampel-palnet/canvas'/>
        <ErrorMessage name="name" as="span" />
      </FormGroup>
       <Button size='small' type="submit" disabled={isSubmitting}>Join</Button>
    </Form>
  </Sveltik>
</Modal>

