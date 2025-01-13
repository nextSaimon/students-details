"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export default function HSCDetailsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [formData, setFormData] = useState({
    batch: "",
    session: "",
    year: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch data on page load
  useEffect(() => {
    const fetchHscDetails = async () => {
      const response = await fetch("/api/hsc");
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      } else {
        console.error("Failed to fetch HSC details");
      }
    };

    fetchHscDetails();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId !== null) {
      const response = await fetch("/api/hsc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          batch: formData.batch,
          session: formData.session,
          year: formData.year,
        }),
      });

      if (response.ok) {
        const updatedDetail = await response.json();
        setDetails(
          details.map((detail) =>
            detail._id === editingId ? updatedDetail : detail
          )
        );
        setEditingId(null);
      } else {
        console.error("Failed to update HSC details");
      }
    } else {
      const response = await fetch("/api/hsc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch: formData.batch,
          session: formData.session,
          year: formData.year,
        }),
      });

      if (response.ok) {
        const newDetail = await response.json();
        setDetails([...details, newDetail]);
      } else {
        console.error("Failed to save HSC details");
      }
    }

    setFormData({ batch: "", session: "", year: "" });
    setIsOpen(false);
  };

  const handleEdit = (id) => {
    const detailToEdit = details.find((detail) => detail._id === id);
    if (detailToEdit) {
      setFormData({
        batch: detailToEdit.batch, // fixed the property name from 'name' to 'batch'
        session: detailToEdit.session,
        year: detailToEdit.year,
      });
      setEditingId(id);
      setIsOpen(true);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteConfirmText === "delete") {
      const response = await fetch("/api/hsc", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      if (response.ok) {
        setDetails(details.filter((detail) => detail._id !== deleteId));
        setIsDeleteDialogOpen(false);
        setDeleteConfirmText("");
        setDeleteId(null);
      } else {
        console.error("Failed to delete HSC details");
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
              {editingId !== null ? "Edit" : "Enter"} HSC Details
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
            <div>
              <Label htmlFor="year">HSC Year</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">
              {editingId !== null ? "Update" : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Display HSC Details */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {details.map((detail) => (
          <Card key={detail._id}>
            <CardContent className="p-4">
              <p>
                <strong>HSC Batch:</strong> {detail.batch}{" "}
                {/* Corrected the property name */}
              </p>
              <p>
                <strong>Session:</strong> {detail.session}
              </p>
              <p>
                <strong>HSC Year:</strong> {detail.year}
              </p>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(detail._id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => confirmDelete(detail._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
