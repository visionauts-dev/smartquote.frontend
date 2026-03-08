/**
 * Settings / Account page
 */

import React from 'react';
import { useAppSelector } from '../../hooks/useAppHooks';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const SettingsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />
      <Card padding="lg" className="mb-6">
        <CardHeader title="Profile" subtitle="Update your personal information" />
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First name"
              defaultValue={user?.firstName}
              placeholder="First name"
            />
            <Input
              label="Last name"
              defaultValue={user?.lastName}
              placeholder="Last name"
            />
          </div>
          <Input
            label="Email"
            type="email"
            defaultValue={user?.email}
            placeholder="you@example.com"
            disabled
          />
          <Button type="submit">Save changes</Button>
        </form>
      </Card>
      <Card padding="lg">
        <CardHeader title="Password" subtitle="Change your password" />
        <form className="space-y-4">
          <Input label="Current password" type="password" placeholder="••••••••" />
          <Input label="New password" type="password" placeholder="••••••••" />
          <Input label="Confirm new password" type="password" placeholder="••••••••" />
          <Button type="submit" variant="outline">Update password</Button>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
