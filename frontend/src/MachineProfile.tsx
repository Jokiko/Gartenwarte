import React, {useState} from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Divider, IconButton, Dialog
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import type {Machine} from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DeleteDialog from "./commons/DeleteDialog.tsx";

interface Props {
  machine: Machine;
  onImageUpload: (file: File, category?: string) => void;
  onFileDelete: (file_id: string) => void;
}

export const MachineProfile: React.FC<Props> = ({
  machine,
  onImageUpload,
  onFileDelete
}) => {
  const images =
    machine.files?.filter(f => f.mime_type.startsWith("image/")) ?? [];

  const primaryImage = images.find(f => f.category === "profile_pic") ?? images[0] ?? null;
  const galleryImages = images.filter(f => f.category === "gallery")
  console.log(images)

  const documents =
    machine.files?.filter(f => f.mime_type === "application/pdf") ?? [];

  const purchaseInvoice = documents.find(f => f.category === "purchaseInvoice" ) ?? null
  const maintenanceInvoice = documents.find(f => f.category === "maintenanceInvoice") ?? null
  const galleryDocs = documents.filter(f => f.category === "misc")

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [deletionString, setDeletionString] = useState<string>("")

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, category?: string | undefined) => {
    if (!e.target.files?.length) return;
    onImageUpload(e.target.files[0], category);
  };

  return (
    <div className="max-w-6xl mx-auto min-w-200 p-6 space-y-8">

      <Card className="rounded-2xl shadow-xl">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* head info */}
            <div className="flex-1">
              <Typography variant="h4" className="font-bold">
                {machine.name}
              </Typography>

              <Typography className="text-gray-500 mt-2">
                {machine.manufacturer} • {machine.category} {machine.article_number ? `• Artikel-Nr: ${machine.article_number}` : ""}
              </Typography>
            </div>

            {/* main image */}
            {primaryImage ? (
              <div className="w-full md:w-64">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={`http://localhost:8000/uploads/${primaryImage.file_path}`}
                    alt={primaryImage.original_filename}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    onClick={() =>
                      setSelectedImage(`http://localhost:8000/uploads/${primaryImage.file_path}`)
                    }
                  />

                  {/* delete button */}
                    <div className="absolute bottom-2 left-2 z-10">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setDeletionString("Bild")
                          setFileToDelete(primaryImage.id)}
                        }
                        className="bg-white/80 backdrop-blur-sm hover:bg-red-500 hover:text-white transition"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>

                </div>
              </div>
            ) :

              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
              >
                Hauptbild hochladen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleUpload(e, "profile_pic")}
                />
              </Button>

            }

          </div>
        </CardContent>
      </Card>


      <div className="grid md:grid-cols-2 gap-6">

        {/* finances */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="space-y-2">
            <Typography variant="h6" className="font-semibold">
              Finanzen
            </Typography>
            <Divider />
            <p>Neupreis: {machine.original_price ?? "?"} €</p>
            <div className={"flex gap-1"}>
            <p>Anschaffungspreis: </p><p className={"font-bold"}>{machine.purchase_price ? String(machine.purchase_price?.toFixed(2)) : "?"} €</p>
            </div>
            <p>Anschaffungsdatum: {machine.purchase_date ? new Date(machine.purchase_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) :  "-"}</p>
            <p className={"whitespace-pre-wrap"}>Händler: {machine.vendor ?? "-"}</p>
            { /* display invoice pdf*/ }
            {purchaseInvoice ?
              <li
                  key={purchaseInvoice.id}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <a
                  href={`http://localhost:8000/uploads/${purchaseInvoice.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {purchaseInvoice.original_filename}
                </a>

                <IconButton
                  size="small"
                  onClick={() => {
                    setDeletionString("PDF")
                    setFileToDelete(purchaseInvoice.id)}
                  }
                  className="hover:bg-red-500 hover:text-white transition"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </li> :
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
              >
                Rechnung hochladen
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={ (e) => handleUpload(e, "purchaseInvoice")}
                />
              </Button>
            }
            <p>AfA: {machine.afa ?? "-"} %</p>
          </CardContent>
        </Card>

        {/* maintenance */}
        <Card className="rounded-2xl shadow-md">
          <CardContent>
            <Typography variant="h6" className="font-semibold">
              Wartung
            </Typography>
            <Divider className="my-2" />

            <p className="mb-2">
              Letzte Wartung: {machine.last_maintenance_date ? new Date(machine.last_maintenance_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) :  "-"}
            </p>

            <p className="mb-2">Kosten letzte Wartung: {machine.last_maintenance_costs ?? "?"} €</p>

            { /* display invoice pdf*/ }
            {maintenanceInvoice ?
              <li
                  key={maintenanceInvoice.id}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <a
                  href={`http://localhost:8000/uploads/${maintenanceInvoice.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {maintenanceInvoice.original_filename}
                </a>

                <IconButton
                  size="small"
                  onClick={() => {
                    setDeletionString("PDF")
                    setFileToDelete(maintenanceInvoice.id)}
                  }
                  className="hover:bg-red-500 hover:text-white transition"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </li> :
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
              >
                Rechnung hochladen
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={ (e) => handleUpload(e, "maintenanceInvoice")}
                />
              </Button>
            }

            <p className="mb-2 mt-2">
              Nächste Wartung: {machine.next_maintenance_date ? new Date(machine.next_maintenance_date!).toLocaleDateString("de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) :  "-"}
            </p>

          </CardContent>
        </Card>
      </div>

      {/* image gallery */}
      <Card className="rounded-2xl shadow-md">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold">
              Weitere Bilder
            </Typography>

            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
            >
              Bild hochladen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleUpload(e, "gallery")}
              />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages && galleryImages.map((img) => (
              <div
                key={img.id}
                className="relative h-40 overflow-hidden rounded-xl shadow"
              >
                <img
                  src={`http://localhost:8000/uploads/${img.file_path}`}
                  alt={img.original_filename}
                  onClick={() =>
                    setSelectedImage(`http://localhost:8000/uploads/${img.file_path}`)
                  }
                  className="w-full h-full cursor-pointer object-cover hover:scale-105 transition"
                />

               {/* delete button */}
                <div className="absolute top-2 right-2 z-10">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeletionString("Bild")
                      setFileToDelete(img.id)}
                    }
                    className="bg-white/80 backdrop-blur-sm hover:bg-red-500 hover:text-white transition"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* documents */}
      <Card className="rounded-2xl shadow-md">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold mb-4">
              Dokumente
            </Typography>

            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
            >
              PDF hochladen
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={ (e) => handleUpload(e, "misc")}
              />
            </Button>
          </div>

          <ul className="space-y-2">
            {galleryDocs.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <a
                  href={`http://localhost:8000/uploads/${doc.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {doc.original_filename}
                </a>

                <IconButton
                  size="small"
                  onClick={() => {
                    setDeletionString("PDF")
                    setFileToDelete(doc.id)}
                  }
                  className="hover:bg-red-500 hover:text-white transition"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* enlarged image */}
      <Dialog
          open={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          maxWidth="lg"
        >
        <div className="relative bg-black">

          {/* close button */}
          <IconButton
            onClick={() => setSelectedImage(null)}
            className="!absolute top-3 right-3 !text-white !bg-black/40 hover:!bg-black/70 z-10"
          >
            <CloseIcon />
          </IconButton>

          {/* image */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vollansicht"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          )}
        </div>
      </Dialog>

      {/* deletion confirmation */}
      <DeleteDialog dataToDelete={fileToDelete} setDataToDelete={setFileToDelete} onDelete={onFileDelete} deletionString={deletionString}/>

    </div>
  );
};
