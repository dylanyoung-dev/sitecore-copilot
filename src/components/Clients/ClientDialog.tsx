import { ClientData } from '@/context/ClientContext';
import { FC } from 'react';

interface ClientDialogProps {
  client: ClientData | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: ClientData) => void;
}

export const ClientDialog: FC<ClientDialogProps> = ({ open, onClose, client }) => {};
