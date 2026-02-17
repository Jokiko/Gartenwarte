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
  onClick: (machine: Machine) => void;
}

export default function MachineTable({ machines, onEdit, onDelete, onClick }: Props) {
  return (
    <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Anschaffungsdatum</TableCell>
            <TableCell>Anschaffungskosten</TableCell>
            <TableCell>Baujahr</TableCell>
            <TableCell>Neupreis</TableCell>
            <TableCell>Verkäufer</TableCell>
            <TableCell>Artikelnummer</TableCell>
            <TableCell>Letzte Wartung</TableCell>
            <TableCell>Kosten letzte Wartung</TableCell>
            <TableCell>Nächste Wartung</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines.map((m) => (
            <TableRow key={m.id} className={"cursor-pointer"} onClick={() => onClick(m)}>
              <TableCell sx={{ fontWeight: 'bold' }}>{m.name}</TableCell>
              <TableCell>{ m.purchase_date ? new Date(m.purchase_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) : ""}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{`${m.purchase_price ? m.purchase_price : "?"} €`}</TableCell>
              <TableCell>{m.manufacturing_year}</TableCell>
              <TableCell>{`${m.original_price ? m.original_price : "?"} €`}</TableCell>
              <TableCell>{m.vendor}</TableCell>
              <TableCell>{m.article_number}</TableCell>
              <TableCell>{m.last_maintenance_date ? new Date(m.last_maintenance_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) : ""}</TableCell>
              <TableCell>{`${m.last_maintenance_costs ? m.last_maintenance_costs : "?"} €`}</TableCell>
              <TableCell>{m.next_maintenance_date ? new Date(m.next_maintenance_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) : "ungeplant"}</TableCell>
              <TableCell>
                <IconButton onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit(m)
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  m.id && onDelete(m.id)
                }}>
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
