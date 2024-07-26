import { useId } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Stack,
  Typography,
  InputLabel,
} from '@mui/material';

import { ReminderFormLayout } from './ReminderFormLayout';
import { getOverdueValidationSchema } from './validation';

export const CreateOverdueReminder = () => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { api, queryClient } = useMoniteContext();

  const methods = useForm({
    resolver: yupResolver(getOverdueValidationSchema(i18n)),
    defaultValues: ((): components['schemas']['OverdueReminderRequest'] => ({
      name: '',
      terms: undefined,
    }))(),
  });
  const { control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'terms',
    rules: { maxLength: 3 },
  });

  const formName = `Monite-Form-createOverdueReminder-${useId()}`;

  const createOverdueReminderMutation =
    api.overdueReminders.postOverdueReminders.useMutation(undefined, {
      onSuccess: async () => {
        dialogContext?.onClose?.();

        await api.overdueReminders.getOverdueReminders.invalidateQueries(
          queryClient
        );

        toast.success(t(i18n)`Reminder has been created`);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">
            {t(i18n)`Create “Overdue” preset`}
          </Typography>
          {dialogContext?.isDialogContent && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close reminder's creation`}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form
          id={formName}
          noValidate
          onSubmit={handleSubmit(
            (body) => {
              console.log({ body });
              createOverdueReminderMutation.mutate({
                body,
              });
            },
            (errors, event) => {
              console.log({ errors, event });
            }
          )}
        >
          <Stack spacing={3}>
            <RHFTextField
              label={t(i18n)`Preset name`}
              name="name"
              control={control}
              fullWidth
              required
            />
            {fields.map((field, index) => (
              <ReminderFormLayout
                title={t(i18n)`Reminder ${index + 1}`}
                key={field.id}
                daysBeforeInput={
                  <>
                    <InputLabel htmlFor={`terms.${index}.days_after`}>
                      <Typography>{t(i18n)`Remind`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name={`terms.${index}.days_after`}
                      // todo::add min max logic on input (???) inputProps.inputProps.min={1} seem not working
                      type="number"
                      control={control}
                      size="small"
                      sx={{ width: 60 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {t(i18n)`days after`}
                    </Typography>
                  </>
                }
                subjectInput={
                  <RHFTextField
                    label={t(i18n)`Subject`}
                    name={`terms.${index}.subject`}
                    control={control}
                    fullWidth
                    required
                  />
                }
                bodyInput={
                  <RHFTextField
                    label={t(i18n)`Body`}
                    name={`terms.${index}.body`}
                    control={control}
                    fullWidth
                    required
                    multiline
                    rows={5}
                  />
                }
                onDelete={() => remove(index)}
              />
            ))}
            {fields.length !== 3 && (
              <>
                <Button
                  sx={{ alignSelf: 'start' }}
                  variant="contained"
                  onClick={() =>
                    append({
                      days_after: 1,
                      subject: '',
                      body: '',
                    })
                  }
                >
                  {t(i18n)`+ Add reminder`}
                </Button>
              </>
            )}
          </Stack>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={dialogContext?.onClose}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form={formName}
          disabled={createOverdueReminderMutation.isPending}
        >
          {t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
