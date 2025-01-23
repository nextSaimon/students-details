"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { ref, set, get, child } from "firebase/database";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [formData, setFormData] = useState({
    batch: "",
    session: "",
  });
  const [editingBatch, setEditingBatch] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteBatch, setDeleteBatch] = useState(null);
  const [error, setError] = useState(null);

  const hscRef = ref(db, "hsc");

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const fetchHscDetails = async () => {
      try {
        const snapshot = await get(hscRef);
        if (snapshot.exists()) {
          const hscDetails = Object.keys(snapshot.val()).map((batch) => ({
            batch,
            ...snapshot.val()[batch],
          }));
          setDetails(hscDetails);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Failed to fetch HSC details", error);
      }
    };

    fetchHscDetails();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for adding/updating HSC details
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the batch already exists in the database
    try {
      const snapshot = await get(hscRef); // Get all the data in the "hsc" node
      if (snapshot.exists()) {
        // Check if the batch already exists
        const existingBatch = snapshot.val()[formData.batch];

        if (existingBatch) {
          setError("This batch already exists. Please use a unique batch.");
          return;
        }
      }

      if (editingBatch) {
        const updateRef = ref(db, `hsc/${editingBatch}`);
        await set(updateRef, formData);
        setDetails(
          details.map((detail) =>
            detail.batch === editingBatch ? { ...detail, ...formData } : detail
          )
        );
        setEditingBatch(null);
      } else {
        const newRef = ref(db, `hsc/${formData.batch}`);
        await set(newRef, formData);
        setDetails([...details, { batch: formData.batch, ...formData }]);
      }

      setFormData({ batch: "", session: "" });
      setIsOpen(false);
      setError(null);
    } catch (error) {
      console.error("Failed to save HSC details", error);
      setError("Failed to save HSC details");
    }
  };

  // Handle edit
  const handleEdit = (batch) => {
    const detailToEdit = details.find((detail) => detail.batch === batch);
    if (detailToEdit) {
      setFormData({
        batch: detailToEdit.batch,
        session: detailToEdit.session,
      });
      setEditingBatch(batch);
      setIsOpen(true);
    }
  };

  // Confirm deletion
  const confirmDelete = (batch) => {
    setDeleteBatch(batch);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (deleteConfirmText === "delete") {
      try {
        const deleteRef = ref(db, `hsc/${deleteBatch}`);
        await set(deleteRef, null); // Deleting the record
        setDetails(details.filter((detail) => detail.batch !== deleteBatch));
        setIsDeleteDialogOpen(false);
        setDeleteConfirmText("");
        setDeleteBatch(null);
      } catch (error) {
        console.error("Failed to delete HSC detail", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      {/* Create HSC Details */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8">Add HSC Details</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBatch !== null ? "Edit" : "Enter"} HSC Details
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="batch">HSC Batch</Label>
              <Input
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="session">Session</Label>
              <Input
                id="session"
                name="session"
                value={formData.session}
                onChange={handleInputChange}
                required
              />
            </div>
            <p className="text-red-500">{error}</p>
            <Button type="submit">
              {editingBatch !== null ? "Update" : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Display HSC Details */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {details
          .slice()
          .reverse()
          .map((detail) => (
            <Card key={detail.batch}>
              <Link href={`/${detail.batch}`}>
                <CardContent className="p-4">
                  <p>
                    <strong>HSC Batch:</strong> {detail.batch}
                  </p>
                  <p>
                    <strong>Session:</strong> {detail.session}
                  </p>
                </CardContent>
              </Link>
              <CardFooter className="justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(detail.batch)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => confirmDelete(detail.batch)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* Confirm Deletion Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Type "delete" to confirm you want to delete this entry:</p>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type 'delete'"
            required
          />
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteConfirmText !== "delete"}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
