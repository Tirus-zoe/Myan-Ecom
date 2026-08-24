import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Map common custom names or fallbacks
  let iconComponent = (LucideIcons as any)[name];
  
  if (!iconComponent) {
    switch (name.toLowerCase()) {
      case 'chair':
      case 'armchair':
        iconComponent = LucideIcons.Armchair;
        break;
      case 'desk':
      case 'table':
        iconComponent = LucideIcons.Table;
        break;
      case 'cabinet':
      case 'layers':
        iconComponent = LucideIcons.Layers;
        break;
      case 'lamp':
        iconComponent = LucideIcons.Lamp;
        break;
      default:
        iconComponent = LucideIcons.ShoppingBag;
    }
  }

  const Icon = iconComponent || LucideIcons.ShoppingBag;
  return <Icon className={className} size={size} />;
};
