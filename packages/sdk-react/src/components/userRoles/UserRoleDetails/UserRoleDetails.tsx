import React from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRoleById } from '@/core/queries/useRoles';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { RoleResponse } from '@monite/sdk-api';

import { UserRoleDetailsDialog } from './UserRoleDetailsDialog';

export interface UserRoleDetailsProps {
  /** The id of the role to be displayed */
  id?: string;

  /**
   * Callback is fired when a role is created and sync with server is successful
   *
   * @param role
   */
  onCreated?: (role: RoleResponse) => void;

  /**
   * Callback is fired when a role is updated and sync with server is successful
   *
   * @param role
   */
  onUpdated?: (role: RoleResponse) => void;
}

export const UserRoleDetails = (props: UserRoleDetailsProps) => (
  <MoniteScopedProviders>
    <UserRoleDetailsBase {...props} />
  </MoniteScopedProviders>
);

const UserRoleDetailsBase = ({
  id,
  onUpdated,
  onCreated,
}: UserRoleDetailsProps) => {
  const { i18n } = useLingui();
  const {
    isLoading,
    isPending,
    data: role,
    error: roleQueryError,
  } = useRoleById(id);

  if (id && (isLoading || isPending)) {
    return <LoadingPage />;
  }

  if (roleQueryError) {
    return (
      <NotFound
        title={t(i18n)`Role not found`}
        description={t(i18n)`There is no role by provided id: ${id}`}
      />
    );
  }

  return (
    <UserRoleDetailsDialog
      id={id}
      onUpdated={onUpdated}
      onCreated={onCreated}
    />
  );
};
