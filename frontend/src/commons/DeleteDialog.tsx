import {Button, Dialog, Typography} from "@mui/material";

interface Props {
    dataToDelete: any
    setDataToDelete: any
    onDelete: any
    deletionString: string
}

export default function DeleteDialog( {dataToDelete, setDataToDelete, onDelete, deletionString}: Props ){

    return (
        <Dialog
        open={Boolean(dataToDelete)}
        onClose={() => setDataToDelete(null)}
      >
        <div className="p-6 w-80 space-y-4">
          <Typography variant="h6">
              {deletionString} wirklich löschen?
          </Typography>

          <Typography className="text-gray-600">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </Typography>

          <div className="flex justify-between gap-3 mt-4">
            <Button
              variant="outlined"
              onClick={() => setDataToDelete(null)}
            >
              Abbrechen
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (dataToDelete) {
                  onDelete(dataToDelete);
                }
                setDataToDelete(null);
              }}
            >
              Löschen
            </Button>
          </div>
        </div>
      </Dialog>
    )
}