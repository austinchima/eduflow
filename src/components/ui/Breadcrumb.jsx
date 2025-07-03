import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': 'Dashboard',
    '/course-management': 'Course Management',
    '/study-tools-hub': 'Study Tools Hub',
    '/quiz-interface': 'Quiz Interface',
    '/flashcard-study-session': 'Flashcard Study',
    '/analytics-dashboard': 'Analytics Dashboard'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];
    
    // Always start with Home
    breadcrumbs.push({ label: 'Home', path: '/dashboard' });

    // If we're already on the dashboard, return early
    if (pathSegments[0] === 'dashboard') {
      return breadcrumbs;
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      // Skip empty segments and the 'dashboard' segment since we already have it as Home
      if (!segment || segment === 'dashboard') return;
      
      currentPath += `/${segment}`;
      const label = routeMap[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      breadcrumbs.push({
        label,
        path: `/dashboard${currentPath}`,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const isStudySession = ['/quiz-interface', '/flashcard-study-session'].includes(location.pathname);

  if (isStudySession) {
    return null;
  }

  if (breadcrumbs.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-text-muted" 
              />
            )}
            
            {crumb.isLast ? (
              <span className="text-text-primary font-medium">
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(crumb.path)}
                className="hover:text-text-primary transition-colors duration-200 focus:outline-none focus:text-text-primary"
              >
                {crumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;