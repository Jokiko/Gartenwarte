import {useEffect, useState} from "react";
import type {Machine} from "../types.ts";
import {
    createMachine, deleteFile,
    deleteMachine,
    getMachineInfo,
    getMachines,
    getMachinesOrdered,
    updateMachine,
    uploadFile
} from "../api.ts";
import {Box, Dialog, IconButton, Typography} from "@mui/material";
import {AddCircleOutlined} from "@mui/icons-material";
import MachineTable from "./MachineTable.tsx";
import CloseIcon from "@mui/icons-material/Close";
import {MachineProfile} from "./MachineProfile.tsx";
import MachineForm from "./MachineForm.tsx";

function MachinePage() {

  const [machines, setMachines] = useState<Machine[]>([]);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [showMachineForm, setShowMachineForm] = useState(false)
  const [displayMachine, setDisplayMachine] = useState<Machine | null>(null)
  const [machinesOrder, setMachinesOrder] = useState<string[]>([])

  const loadMachines = async () => {
    const res = await getMachines();
    setMachines(res.data);
  };

  const orderMachines = async (machinesOrder: string[]) => {
      const res = await getMachinesOrdered(machinesOrder[0], machinesOrder[1])
      setMachines(res.data)
  }

  useEffect(() => {
    if(machinesOrder[0] === undefined){
        loadMachines().then();
    }
    else{
        orderMachines(machinesOrder).then()
    }

  }, [machinesOrder]);


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
    setMachinesOrder([])
  };

  const handleDelete = async (id: string) => {
    await deleteMachine(id);
    await loadMachines();
    setMachinesOrder([])
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
    setMachinesOrder([])
  }

  const handleFileupload = async (file: any, category: string | undefined)=>  {
    if ( displayMachine === null) return
    console.log(file)
    const formData = new FormData();
    formData.append("file", file);
    await uploadFile(displayMachine?.id!, category, formData).then(async () => {
        const newMachine = (await getMachineInfo(displayMachine.id!)).data
        console.log(newMachine)
        setDisplayMachine(newMachine)
        await loadMachines();
      }
    )
  }

  const handleFileDelete= async (file_id: string) => {
    if ( displayMachine === null) return
    await deleteFile(file_id).then(async () => {
        const newMachine = (await getMachineInfo(displayMachine.id!)).data
        console.log(newMachine)
        setDisplayMachine(newMachine)
        await loadMachines();
      })
  }

  return (
    <div className="mx-auto p-6">

      <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant={"h4"}  className="text-3xl font-bold mb-6">Maschinen & Geräte</Typography>
          <IconButton className={"mb-5"} onClick={handleAddNewMachine}>
            <AddCircleOutlined/>
          </IconButton>
      </Box>

      <div className={"flex"}>

        <MachineTable machines={machines} onEdit={handleEditing} onDelete={handleDelete} onClick={setDisplayMachine} order={machinesOrder} setOrder={setMachinesOrder}/>


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

          {/* close buttonn */}
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

export default MachinePage