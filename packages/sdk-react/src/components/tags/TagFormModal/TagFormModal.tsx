import { useEffect, useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { Dialog } from '@/components/Dialog';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { yupResolver } from '@hookform/resolvers/yup';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Stack,
  Autocomplete,
} from '@mui/material';

import * as yup from 'yup';

import { useTags } from '../useTags';

export const tagCategories = [
  'document_type',
  'department',
  'project',
  'cost_center',
  'vendor_type',
  'payment_method',
  'approval_status',
];

const getValidationSchema = (i18n: I18n) =>
  yup
    .object()
    .shape({
      name: yup
        .string()
        .required()
        .max(255, t(i18n)`Value must be at most '255' characters`),
      category: yup.string().optional().oneOf(tagCategories),
      keywords: yup.array().of(
        yup
          .string()
          .min(2, t(i18n)`Keyword should be at least 2 characters long`)
          .max(25, t(i18n)`Keyword should be at most 25 characters long`)
      ),
    })
    .required();

interface ITag {
  id: string;
  name: string;
  category?: components['schemas']['ReceivableTagCategory'];
  keywords?: string[];
}

interface TagFormModalProps {
  tag?: ITag;
  onCreate?: (tag: components['schemas']['TagReadSchema']) => void;
  onUpdate?: (tag: components['schemas']['TagReadSchema']) => void;
  onClose?: () => void;

  /** Whether the modal is open or not */
  open: boolean;
}

interface FormFields {
  name: string;
  category: components['schemas']['ReceivableTagCategory'] | '';
  keywords: components['schemas']['OcrAutoTaggingSettingsRequest']['keywords'];
}

/**
 * `TagFormModal` is responsible for creating or updating
 *   the tag.
 *  If no `tag` provided then the form is working on `creating` mode
 *  If `tag` provided then the form is working on `updating` mode
 */
export const TagFormModal = (props: TagFormModalProps) => (
  <MoniteScopedProviders>
    <TagFormModalBase {...props} />
  </MoniteScopedProviders>
);

const TagFormModalBase = ({
  tag,
  onCreate,
  onUpdate,
  onClose,
  open,
}: TagFormModalProps) => {
  const { i18n } = useLingui();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
  });

  useEffect(() => {
    reset({
      name: tag?.name || '',
      category: tag?.category || '',
      keywords: tag?.keywords || [],
    });
  }, [reset, tag]);

  const { createTag, updateTag, inProgress, updateOcrAutoTagging } = useTags({
    setNameError: (errorMessage) => {
      setError('name', { type: 'custom', message: errorMessage });
    },
    onTagCreated: (createdTag) => {
      toast.success(t(i18n)`New tag “${createdTag.name}” created`);
      onCreate?.(createdTag);
      onClose?.();
      reset();
    },
    onTagUpdated: (updatedTag) => {
      if (tag) {
        toast.success(
          tag.name !== updatedTag.name
            ? t(i18n)`Tag “${tag.name}” renamed to “${updatedTag.name}”`
            : t(i18n)`Tag “${tag.name}” was updated”`
        );
      }
      onUpdate?.(updatedTag);
      onClose?.();
      reset();
    },
  });

  const { root } = useRootElements();

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-tag-${useId()}`;

  return (
    <>
      <Dialog
        open={open}
        container={root}
        onClose={onClose}
        alignDialog="right"
        aria-label={t(i18n)`Edit tag`}
      >
        <DialogTitle variant="h3">
          {tag ? t(i18n)`Edit tag ”${tag.name}”` : t(i18n)`Create new tag`}
        </DialogTitle>
        <DialogContent dividers>
          <form
            id={formName}
            name={formName}
            onSubmit={handleSubmit(async (values) => {
              const { keywords, name, category } = values;
              const payload = { name, category: category || undefined };

              const result = await (tag
                ? updateTag(tag.id, payload)
                : createTag(payload));

              updateOcrAutoTagging(result.id, keywords);
            })}
          >
            <Stack spacing={3}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    id={field.name}
                    autoFocus
                    label={t(i18n)`Name`}
                    variant="standard"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id={field.name}>{t(i18n)`Category`}</InputLabel>
                    <Select
                      labelId={field.name}
                      MenuProps={{ container: root }}
                      {...field}
                    >
                      <MenuItem value={''}>{t(i18n)`Not set`}</MenuItem>
                      {tagCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="keywords"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Autocomplete
                      {...field}
                      id={field.name}
                      multiple
                      options={[]}
                      filterOptions={(_, params) =>
                        params.inputValue ? [params.inputValue] : []
                      }
                      freeSolo
                      onChange={(_, data) => {
                        const words = data.flatMap((input) =>
                          input.split(' ').filter(Boolean)
                        );

                        field.onChange(words);
                      }}
                      slotProps={{
                        popper: {
                          container: root,
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t(i18n)`Keywords`}
                          variant="standard"
                          fullWidth
                          error={Boolean(error)}
                          helperText={
                            errors.keywords?.find?.((error) => Boolean(error))
                              ?.message
                          }
                        />
                      )}
                    />
                  </>
                )}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="primary" onClick={onClose}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="contained"
            disabled={inProgress}
            type="submit"
            form={formName}
          >
            {tag ? t(i18n)`Save` : t(i18n)`Create`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
