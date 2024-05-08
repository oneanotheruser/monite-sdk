import { ExtendThemeProvider } from '@/utils/storybook-utils';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { TablePagination as TablePaginationComponent } from './TablePagination';

const meta: Meta<typeof TablePaginationComponent> = {
  title: 'Components / TablePagination',
  component: TablePaginationComponent,
};

type Story = StoryObj<typeof TablePaginationComponent>;

export const TablePaginationDefault: Story = {
  name: 'default',
  args: {
    paginationModel: {
      pageSize: 10,
      page: 1,
    },
    onPaginationModelChange: () => {},
    nextPage: 2,
    prevPage: undefined,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <div style={{ display: 'flex' }}>
        <TablePaginationComponent {...args} />
      </div>
      <Alert sx={{ mt: 2 }}>
        <code>{'<TablePagination />'}</code> could be customized through MUI
        theming
      </Alert>
    </div>
  ),
};

export const TablePaginationThemed: Story = {
  name: 'themed',
  args: {
    paginationModel: {
      pageSize: 10,
      page: 1,
    },
    onPaginationModelChange: () => {},
    nextPage: 2,
    prevPage: undefined,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteTablePagination: {
              defaultProps: {
                pageSizeOptions: [55, 10, 155, 200],
              },
            },
          },
        }}
      >
        <div style={{ display: 'flex' }}>
          <TablePaginationComponent {...args} />
        </div>
      </ExtendThemeProvider>
      <Alert sx={{ mt: 2 }}>
        <code>{'<TablePagination />'}</code> could be customized through MUI
        theming
      </Alert>
    </div>
  ),
};

export default meta;
