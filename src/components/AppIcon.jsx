import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {

    const IconComponent = LucideIcons?.[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in Lucide React icons`);
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    try {
        return <IconComponent
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={className}
            {...props}
        />;
    } catch (error) {
        console.error(`Error rendering icon "${name}":`, error);
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }
}
export default Icon;