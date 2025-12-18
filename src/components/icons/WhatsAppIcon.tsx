/**
 * WhatsApp Icon Component
 * Reusable icon using react-icons
 */
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppIconProps {
    className?: string;
}

export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({ className = "h-5 w-5" }) => {
    return <FaWhatsapp className={className} />;
};
