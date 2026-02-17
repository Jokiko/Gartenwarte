import { useEffect, useState } from "react";
import type {Machine} from "./types";
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine, uploadFile, deleteFile, getMachineInfo,
} from "./api";
import MachineForm from "./MachineForm";
import MachineTable from "./MachineTable.tsx";
import {AddCircleOutlined} from "@mui/icons-material";
import {Box, Dialog, IconButton, Typography} from "@mui/material";
import {MachineProfile} from "./MachineProfile.tsx";
import CloseIcon from "@mui/icons-material/Close";


// npm run dev
function App() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [showMachineForm, setShowMachineForm] = useState(false)
  const [displayMachine, setDisplayMachine] = useState<Machine | null>(null)

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
    setDisplayMachine(null)
    setEditing(data)
  }

  const handleAddNewMachine = () => {
    setShowMachineForm(true)
    setDisplayMachine(null)
    setEditing(null)
  }

  const handleFileupload = async (file: any)=>  {
    if ( displayMachine === null) return
    console.log(file)
    const formData = new FormData();
    formData.append("file", file);
    await uploadFile(displayMachine?.id!, formData).then(async () => {
        const newMachine = (await getMachineInfo(displayMachine.id!)).data
        console.log(newMachine)
        setDisplayMachine(newMachine)
      }
    )
  }

  const handleFileDelete= async (file_id: string) => {
    if ( displayMachine === null) return
    await deleteFile(file_id).then(async () => {
        const newMachine = (await getMachineInfo(displayMachine.id!)).data
        console.log(newMachine)
        setDisplayMachine(newMachine)
      })
  }

  console.log(displayMachine)

  return (
    <div className="mx-auto p-6">

      <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant={"h4"}  className="text-3xl font-bold mb-6">Gartenmaschinen</Typography>
          <IconButton className={"mb-5"} onClick={handleAddNewMachine}>
            <AddCircleOutlined/>
          </IconButton>
      </Box>

      <div className={"flex"}>

        <MachineTable machines={machines} onEdit={handleEditing} onDelete={handleDelete} onClick={setDisplayMachine}/>

        {/*<div className=" p-6 mb-8 flex-1">
          { displayMachine !== null
              ? <MachineProfile machine={displayMachine} onImageUpload={ handleFileupload } onFileDelete={ handleFileDelete }/>
              :
                showMachineForm && (<MachineForm onSubmit={handleSubmit} editingMachine={editing}/>)
          }
        </div>*/}




      </div>

      <Dialog
          open={Boolean(displayMachine) || showMachineForm}
          onClose={() => {
            setDisplayMachine(null)
            setEditing(null)
            setShowMachineForm(false)
          }}
          maxWidth="xl"
        >
        <div className="relative">

          {/* close buttonN */}
          <IconButton
            onClick={() => {
              setDisplayMachine(null)
              setEditing(null)
              setShowMachineForm(false)
            }}
            className="!absolute top-3 right-3 !text-white !bg-black/40 hover:!bg-black/70 z-10"
          >
            <CloseIcon />
          </IconButton>

          {/* display either the machine form or the profile */}
          { displayMachine !== null
              ? <MachineProfile machine={displayMachine} onImageUpload={ handleFileupload } onFileDelete={ handleFileDelete }/>
              :
                showMachineForm && (<MachineForm onSubmit={handleSubmit} editingMachine={editing}/>)
          }
        </div>
      </Dialog>

    </div>
  );
}

export default App;
