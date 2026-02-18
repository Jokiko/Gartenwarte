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
import {ArrowUpward} from "@mui/icons-material";
import {ArrowDownward} from "@mui/icons-material";
import type {Machine} from "./types.ts";

interface Props {
  machines: Machine[];
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
  onClick: (machine: Machine) => void;
  order: string[]
  setOrder: (order: string[]) => void;
}

export default function MachineTable({ machines, onEdit, onDelete, onClick, order, setOrder }: Props) {



  function handleOrder(attr: string){
    // make sure that the first time an attribute is clicked it's always ordered ascending
    if(attr !== order[0]){
      setOrder([attr, "asc"])
    }
    else{
      switch (order[1]){
        case "asc":
          setOrder([attr, "desc"])
          break
        case "desc":
          setOrder([])
          break
        default:
          setOrder([attr, "asc"])
      }
    }
  }

  function getSortArrow(order: string[], attr: string){
    return order[0] === attr ? order[1] === "asc" ? <ArrowUpward fontSize={"small"}/> : <ArrowDownward fontSize={"small"}/> : <></>
  }

  return (
    <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleOrder("name")} sx={{cursor: "pointer"}}>Name {getSortArrow(order, "name")}</TableCell>
            <TableCell onClick={() => handleOrder("purchase_date")} sx={{cursor: "pointer"}}>Anschaffungsdatum {getSortArrow(order, "purchase_date")}</TableCell>
            <TableCell onClick={() => handleOrder("purchase_price")} sx={{cursor: "pointer"}}>Anschaffungskosten {getSortArrow(order, "purchase_price")}</TableCell>
            <TableCell onClick={() => handleOrder("manufacturing_year")} sx={{cursor: "pointer"}}>Baujahr {getSortArrow(order, "manufacturing_year")}</TableCell>
            <TableCell onClick={() => handleOrder("original_price")} sx={{cursor: "pointer"}}>Neupreis {getSortArrow(order, "original_price")}</TableCell>
            <TableCell onClick={() => handleOrder("vendor")} sx={{cursor: "pointer"}}>Verkäufer {getSortArrow(order, "vendor")}</TableCell>
            <TableCell onClick={() => handleOrder("article_number")} sx={{cursor: "pointer"}}>Artikelnummer {getSortArrow(order, "article_number")}</TableCell>
            <TableCell onClick={() => handleOrder("last_maintenance_date")} sx={{cursor: "pointer"}}>Letzte Wartung {getSortArrow(order, "last_maintenance_date")}</TableCell>
            <TableCell onClick={() => handleOrder("last_maintenance_costs")} sx={{cursor: "pointer"}}>Kosten letzte Wartung {getSortArrow(order, "last_maintenance_costs")}</TableCell>
            <TableCell onClick={() => handleOrder("next_maintenance_date")} sx={{cursor: "pointer"}}>Nächste Wartung {getSortArrow(order, "next_maintenance_date")}</TableCell>
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
