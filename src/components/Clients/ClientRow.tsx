import { ClientData } from '@/context/ClientContext';
import { MoreHorizontal } from 'lucide-react';
import { FC } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { TableCell, TableRow } from '../ui/table';

interface ClientRowProps {
  client: ClientData;
  onEdit: (client: ClientData) => void;
}

export const ClientRow: FC<ClientRowProps> = ({ client, onEdit }) => {
  return (
    <TableRow>
      <TableCell>{client.clientId}</TableCell>
      <TableCell>{client.product}</TableCell>
      <TableCell>{client.environment}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(client)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
