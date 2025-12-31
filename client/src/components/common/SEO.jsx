import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update Title
    document.title = title ? `${title} | MeterOps` : 'MeterOps - Usage Based Billing Infrastructure';

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'The complete infrastructure for metering, billing, and tenant management.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = description || 'The complete infrastructure for metering, billing, and tenant management.';
      document.head.appendChild(newMeta);
    }

    // Update Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || 'metering, billing, saas, tenant management, usage tracking');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'keywords';
      newMeta.content = keywords || 'metering, billing, saas, tenant management, usage tracking';
      document.head.appendChild(newMeta);
    }
  }, [title, description, keywords]);

  return null;
};

export default SEO;
