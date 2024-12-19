import { useEffect, useMemo } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, InputLabel, Input } from '@mui/material';
import { debounce } from '@mui/material/utils';

/**
 * The delay in milliseconds before a search request is sent after the user stops typing.
 * @type {number}
 */
export const DEBOUNCE_SEARCH_TIMEOUT: number = 500;

/**
 * `SearchFieldProps` is an interface that defines the properties for the `SearchField` component.
 *
 * @interface
 * @property {string} label - The label for the search field.
 * @property {(value: string | null) => void} onChange - The function to be called when the input value changes.
 */
interface SearchFieldProps {
  label: string;
  onChange: (value: string | null) => void;
  value?: string;
}

/**
 * `SearchField` is a component that renders a search input field with a debounce functionality.
 * The input value is debounced, meaning that the `onChange` callback is not called immediately when the user types into the field,
 * but only after the user has stopped typing for a certain amount of time (`DEBOUNCE_SEARCH_TIMEOUT`).
 *
 * @component
 * @param {object} props - The properties that define the `SearchField` component.
 * @param {string} props.label - The label for the search field.
 * @param {string} props.value - The initial value of the search field.
 * @param {(value: string | null) => void} props.onChange - The function to be called when the input value changes.
 *
 * @example
 * <SearchField label="Search" onChange={value => console.log(value)} />
 *
 * @returns {React.ReactElement} Returns a `FormControl` element that contains the search field.
 */

export const SearchField = ({ label, onChange, value }: SearchFieldProps) => {
  const debouncedOnChange = useMemo(
    () => debounce(onChange, DEBOUNCE_SEARCH_TIMEOUT),
    [onChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.clear();
    };
  }, [debouncedOnChange]);

  return (
    <FormControl
      aria-label="search-by-name"
      className="Monite-SearchField Monite-FilterControl"
    >
      <InputLabel htmlFor="search-by-name" shrink>
        {label}
      </InputLabel>
      <Input
        id="search-by-name"
        name="search-by-name"
        aria-label="search-by-name"
        value={value}
        onChange={(search) => {
          debouncedOnChange(search.target.value || null);
        }}
        startAdornment={
          <InputAdornment position="end">
            <SearchIcon fontSize="medium" />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
