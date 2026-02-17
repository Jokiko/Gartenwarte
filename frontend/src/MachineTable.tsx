import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type {Machine} from "./types.ts";

interface Props {
  machines: Machine[];
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
}

export default function MachineTable({ machines, onEdit, onDelete }: Props) {
  return (
    <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Hersteller</TableCell>
            <TableCell>Kaufpreis</TableCell>
            <TableCell>Kaufdatum</TableCell>
            <TableCell>Verkäufer</TableCell>
            <TableCell>Nächste Wartung</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines.map((m) => (
            <TableRow key={m.id} className={"cursor-pointer"}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.manufacturer}</TableCell>
              <TableCell>{`${m.purchase_price} €`}</TableCell>
              <TableCell>{new Date(m.purchase_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}</TableCell>
              <TableCell>{m.vendor}</TableCell>
              <TableCell>{m.next_maintenance_date ? new Date(m.next_maintenance_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) : "ungeplant"}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(m)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => m.id && onDelete(m.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
