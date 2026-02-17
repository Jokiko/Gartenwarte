import {Box, Button, TextField, Typography} from "@mui/material";
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
  manufacturing_year: "",
  purchase_price: undefined,
  purchase_date: undefined,
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
      console.log(machine)
    e.preventDefault();
    onSubmit(machine);
  };


  return (
     <div className={"p-4 mb-4"}>
      <Typography variant="h5" gutterBottom>
        {editingMachine ? "Maschine bearbeiten" : "Neue Maschine"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} className={"flex flex-col gap-4"} >
        <div className={"grid grid-cols-2 gap-4"} >
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
              label="Maschinentyp"
              name="category"
              value={machine.category}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
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
            />

            <TextField
              label="Baujahr"
              name="manufacturing_year"
              value={machine.manufacturing_year}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <DatePicker
              label="Anschaffungsdatum"
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
                  fullWidth: true
                }
              }}
            />

            <TextField
              label="Anschaffungskosten"
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
            />

            <TextField
              label="Verkäufer"
              name="vendor"
              multiline={true}
              value={machine.vendor}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}

            />

            <TextField
              label="Neupreis"
              name="original_price"
              value={machine.original_price ?? ""}
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
            />

            <TextField
              label="Artikelnummer"
              name="article_number"
              value={machine.article_number}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <div></div>

            <DatePicker
              label="Letzter Werkstatt-Termin"
              format="DD.MM.YYYY"
              value={machine.last_maintenance_date ? dayjs(machine.last_maintenance_date) : null}
              onChange={(newValue) => {
                setMachine(prev => ({
                  ...prev,
                  last_maintenance_date: newValue
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

            <TextField
              label="Kosten letzter Werkstatt-Termin"
              name="last_maintenance_costs"
              value={machine.last_maintenance_costs ?? ""}
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
            />


            <DatePicker
              label="Nächster Werkstatt-Termin"
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

        </div>
        <div className="flex justify-center mt-4">
        <Button variant="contained" type="submit" className={"w-1/4 items-center"}>
          Speichern
        </Button>
        </div>
      </Box>
    </div>

  );
}