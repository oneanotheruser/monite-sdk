import { FilterContainer } from '@/components/misc/FilterContainer';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from '@mui/material';

import { Theme } from 'mui-styles';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_UNITS,
} from '../../consts';
import { Filters as FilterType, FilterValue } from '../../types';

interface ProductsTableFiltersProps {
  onChangeFilter: (field: keyof FilterType, value: FilterValue) => void;
  sx?: SxProps<Theme>;
}

export const Filters = ({ onChangeFilter, sx }: ProductsTableFiltersProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();
  const { data: measureUnits, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();
  const className = 'Monite-ProductFilters';

  return (
    <FilterContainer
      className={className}
      sx={sx}
      searchField={
        <SearchField
          label={t(i18n)`Search by name`}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_SEARCH, search);
          }}
        />
      }
    >
      <FormControl
        variant="outlined"
        fullWidth
        className="Monite-ProductTypeFilter Monite-FilterControl"
      >
        <InputLabel id="type">{t(i18n)`Type`}</InputLabel>
        <Select
          labelId="type"
          label={t(i18n)`Type`}
          defaultValue="all"
          MenuProps={{ container: root }}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_TYPE, search.target.value);
          }}
        >
          {[
            { label: t(i18n)`All types`, value: 'all' },
            {
              label: t(i18n)`Products`,
              value: 'product',
              icons: <PersonIcon color="primary" fontSize="small" />,
            },
            {
              label: t(i18n)`Services`,
              value: 'service',
              icons: <BusinessIcon color="success" fontSize="small" />,
            },
          ].map(({ label, value }) => (
            <MenuItem value={value} key={value}>
              {/* We should use `ListItemIcon` component to be able to show `icons` */}
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        fullWidth
        disabled={isMeasureUnitsLoading}
        className="Monite-ProductUnitFilter Monite-FilterControl"
      >
        <InputLabel id="units">{t(i18n)`Units`}</InputLabel>
        <Select
          labelId="units"
          label={t(i18n)`Units`}
          defaultValue="all"
          MenuProps={{ container: root }}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_UNITS, search.target.value);
          }}
        >
          {[
            { id: 'all', name: t(i18n)`All units` },
            ...(measureUnits?.data ?? []),
          ].map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FilterContainer>
  );
};
