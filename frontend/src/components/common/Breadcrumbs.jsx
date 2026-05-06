import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Breadcrumbs = ({ customBreadcrumbs }) => {
  const location = useLocation();

  // If custom breadcrumbs are provided, use them
  if (customBreadcrumbs) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        {customBreadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRightIcon className="h-4 w-4" />}
            {crumb.href ? (
              <Link to={crumb.href} className="hover:text-primary-600 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Auto-generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      // Format the label (capitalize first letter, handle special cases)
      let label = name.charAt(0).toUpperCase() + name.slice(1);
      if (name === 'product') label = 'Product';
      if (name === 'admin') label = 'Admin';
      if (name === 'merchant') label = 'Merchant';
      if (name === 'checkout') label = 'Checkout';
      
      return {
        label,
        href: isLast ? null : routeTo,
      };
    }),
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRightIcon className="h-4 w-4" />}
          {index === 0 ? (
            <Link to={crumb.href} className="hover:text-primary-600 transition-colors">
              <HomeIcon className="h-4 w-4" />
            </Link>
          ) : crumb.href ? (
            <Link to={crumb.href} className="hover:text-primary-600 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
