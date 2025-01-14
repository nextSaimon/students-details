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
import Link from "next/link";

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [formData, setFormData] = useState({
    batch: "",
    session: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data on page load
  useEffect(() => {
    const fetchHscDetails = async () => {
      const response = await fetch("/api/hsc", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      } else {
        console.error("Failed to fetch HSC details");
      }
    };

    fetchHscDetails();
  }, []);
  //handle change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = "/api/hsc";
    const method = editingId ? "PUT" : "POST";
    const body = {
      batch: formData.batch,
      session: formData.session,
      year: formData.year,
    };

    if (editingId) body.id = editingId;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to save HSC details");
      setError(data.error || "Failed to save HSC details");
      return;
    }

    if (editingId) {
      setDetails(
        details.map((detail) => (detail._id === editingId ? data : detail))
      );
      setEditingId(null);
    } else {
      setDetails([...details, data]);
    }

    setFormData({ batch: "", session: "", year: "" });
    setIsOpen(false);
    setError(null);
  };

  //handle edit
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

  //handle delete
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

            <p className="text-red-500">{error}</p>
            <Button type="submit">
              {editingId !== null ? "Update" : "Submit"}
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
            <Card>
              <Link key={detail._id} href={`/${detail.link}`}>
                <CardContent className="p-4">
                  <p>
                    <strong>HSC Batch:</strong> {detail.batch}{" "}
                    {/* Corrected the property name */}
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
