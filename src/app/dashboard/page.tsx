import { FormattedMessage } from 'react-intl';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <FormattedMessage id="dashboard.title" />
            </h1>
            <p className="mt-1 text-gray-600">
              <FormattedMessage id="dashboard.welcome" />
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard content will go here */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-800">
              <FormattedMessage id="nav.articles" />
            </h3>
            <p className="mt-2 text-gray-600">
              <FormattedMessage id="article.readMore" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
