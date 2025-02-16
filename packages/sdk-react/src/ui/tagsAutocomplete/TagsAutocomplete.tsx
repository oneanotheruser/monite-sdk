import { Autocomplete, TextField } from "@mui/material";
import { useTags } from "./useTags";
import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';

export type TagsAutocompleteProps = {
    disabled?: boolean;
    value?: components['schemas']['TagReadSchema'][];
};

export type Option = { label: string; value: string };

export const tagsToSelect = (
    tags: components['schemas']['TagReadSchema'][] | undefined
  ): Option[] => {
    if (!tags) return [];
  
    return tags.map(({ id: value, name: label }) => ({
      value,
      label,
    }));
};

export const TagsAutocomplete = ({
    disabled,
    value,
}: TagsAutocompleteProps) => {
    const { tagsQuery } = useTags();
    const { root } = useRootElements();

    return (
        <Autocomplete
            disabled={disabled}
            multiple
            filterSelectedOptions
            getOptionLabel={(option) => option.label}
            options={tagsToSelect(tagsQuery.data?.data)}
            slotProps={{
                popper: { container: root },
            }}
            isOptionEqualToValue={(option, value) =>
                option.value === value.value
            }
            defaultValue={tagsToSelect(value)}
            renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="filled"
                />
            )}
        />
    )
}