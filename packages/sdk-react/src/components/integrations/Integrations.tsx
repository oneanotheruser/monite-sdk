import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';

import { PageHeader } from '../PageHeader';
import { FinanceApplicationCard } from '../receivables/Financing/FinanceApplicationCard/FinanceApplicationCard';

export function Integrations() {
  return (
    <MoniteScopedProviders>
      <IntegrationsComponent />
    </MoniteScopedProviders>
  );
}

function IntegrationsComponent() {
  const { i18n } = useLingui();
  return (
    <Box>
      <PageHeader title={<>{t(i18n)`Integrations`}</>} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(360px, 480px) minmax(360px, 480px)',
          gap: 2,
        }}
      >
        <FinanceApplicationCard />
      </Box>
    </Box>
  );
}