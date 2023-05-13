<script lang="ts">
  import store from '../store';
  import { createEventDispatcher } from 'svelte';

  import {
    Modal,
    FormGroup,
    ButtonSet,
    Button,
    Form,
    Grid,
    Row,
    Column,
    TextInput
  } from 'carbon-components-svelte';
  import UserFollow32 from 'carbon-icons-svelte/lib/UserFollow32';
  import { Sveltik, Field, ErrorMessage } from 'sveltik';
  import type { CanvasForm } from '../types/canvas';

  const dispatch = createEventDispatcher();

  let open = false,
    isSubmitting = false;

  let initialValues = {
    name: ''
  };

  let validate = (values: CanvasForm) => {
    const errors = { name: '', width: '', height: '' };
    if (values.name === '') {
      errors.name = 'Path Required';
    }
    return errors;
  };

  let onSubmit = (values: CanvasForm, { setSubmitting }) => {
    const [location, name] = values.name.split('/');
    $store.api.join(location, name).then(() => {
      console.log('[ success join canvas... ]', values.name);
      dispatch('joincanvas', { name: values.name });
      open = false;
      isSubmitting = false;
    });
  };
</script>

<Button
  icon={UserFollow32}
  kind="ghost"
  size="small"
  on:click={() => (open = true)}>
  Join
</Button>

<Modal size="sm" hasForm={true} bind:open passiveModal modalHeading="">
  <Grid padding>
    <Sveltik let:props {initialValues} {validate} {onSubmit} bind:isSubmitting>
      <Form on:submit={props.handleSubmit} {...props}>
        <FormGroup legendText="Remote Canvas Name">
          <Row>
            <Column>
              <Field let:field let:meta name="name">
                <TextInput
                  inline
                  size="sm"
                  light
                  labelText="Path"
                  placeholder="~sampel-palnet/canvas"
                  {...field}
                  invalid={meta.error}
                  type="text"
                  invalidText={meta.error}
                  on:input={field.handleInput}
                  on:blur={field.handleBlur} />
              </Field>
            </Column>
          </Row>
        </FormGroup>
        <ButtonSet>
          <Button on:click={() => (open = false)} kind="secondary"
            >Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>Join</Button>
        </ButtonSet>
      </Form>
    </Sveltik>
  </Grid>
</Modal>
