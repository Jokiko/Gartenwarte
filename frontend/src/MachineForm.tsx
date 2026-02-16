import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import { useState, useEffect } from "react";
import type {Machine} from "./types.ts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";


interface MachineFormProps {
  onSubmit: (data: Machine) => void;
  editingMachine?: Machine | null;
}

const initialState = {
  name: "",
  manufacturer: "",
  purchase_price: undefined,
  purchase_date: "",
  vendor: "",
  next_maintenance_date: null
}

export default function MachineForm({ onSubmit, editingMachine }: MachineFormProps) {
  const [machine, setMachine] = useState<Machine>(initialState);

  useEffect(() => {
    if (editingMachine) {
      setMachine(editingMachine);
    }
    else{
      setMachine(initialState)
    }
  }, [editingMachine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMachine({
      ...machine,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(machine);
  };


console.log(machine)
  return (
     <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {editingMachine ? "Maschine bearbeiten" : "Neue Maschine"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name"
          name="name"
          value={machine.name}
          onChange={handleChange}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          required
        />

        <TextField
          label="Hersteller"
          name="manufacturer"
          value={machine.manufacturer}
          onChange={handleChange}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          required
        />

        <TextField
          label="Kaufpreis"
          name="purchase_price"
          value={machine.purchase_price ?? ""}
          type={"number"}
          onChange={handleChange}
          slotProps={{
            htmlInput: {
              step: 0.01,
              min: 0,
            },
            inputLabel: {
              shrink: true,
            },
          }}
          required
        />

        <DatePicker
          label="Kaufdatum"
          format="DD.MM.YYYY"
          value={machine.purchase_date ? dayjs(machine.purchase_date) : null}
          onChange={(newValue) => {
            setMachine(prev => ({
              ...prev,
              purchase_date: newValue
                ? newValue.format("YYYY-MM-DD")
                : ""
            }))
          }}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true
            }
          }}
        />

        <TextField
          label="Verkäufer"
          name="vendor"
          value={machine.vendor}
          onChange={handleChange}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          required
        />

        <DatePicker
          label="Nächste Wartung"
          format="DD.MM.YYYY"
          value={machine.next_maintenance_date ? dayjs(machine.next_maintenance_date) : null}
          onChange={(newValue) => {
            setMachine(prev => ({
              ...prev,
              next_maintenance_date: newValue
                ? newValue.format("YYYY-MM-DD")
                : null
            }))
          }}
          slotProps={{
            textField: {
              required: false,
              fullWidth: true
            }
          }}
        />

        <Button variant="contained" type="submit">
          Speichern
        </Button>
      </Box>
    </Paper>

  );
}