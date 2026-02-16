import { useEffect, useState } from "react";
import type {Machine} from "./types";
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine,
} from "./api";
import MachineForm from "./MachineForm";
import MachineTable from "./MachineTable.tsx";
import {AddCircleOutlined} from "@mui/icons-material";
import {Box, IconButton, Typography} from "@mui/material";


// npm run dev
function App() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [showMachineForm, setShowMachineForm] = useState(false)

  const loadMachines = async () => {
    const res = await getMachines();
    setMachines(res.data);
  };

  useEffect(() => {
    loadMachines();
  }, []);

  const handleSubmit = async (data: Machine) => {
    if (editing && editing.id) {
      await updateMachine(editing.id, data);
      console.log(editing)
      setEditing(null);
    } else {
      await createMachine(data);
    }
    setEditing(null)
    setShowMachineForm(false)
    await loadMachines();
  };

  const handleDelete = async (id: string) => {
    await deleteMachine(id);
    await loadMachines();
  };

  const handleEditing = (data: Machine) => {
    setShowMachineForm(true)
    setEditing(data)
  }

  const handleAddNewMachine = () => {
    setShowMachineForm(true)
    setEditing(null)
  }

  return (
    <div className="mx-auto p-6">

      <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant={"h4"}  className="text-3xl font-bold mb-6">Gartenmaschinen</Typography>
          <IconButton className={"mb-5"} onClick={handleAddNewMachine}>
            <AddCircleOutlined/>
          </IconButton>
      </Box>

      <div className={"flex"}>

        <MachineTable machines={machines} onEdit={handleEditing} onDelete={handleDelete}/>

        <div className=" p-6 mb-8 flex-1">
          {showMachineForm && (
            <MachineForm
              onSubmit={handleSubmit}
              editingMachine={editing}
            />
          )}
        </div>


      </div>


    </div>
  );
}

export default App;
