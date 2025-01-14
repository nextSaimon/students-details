"use client";

import React, { useState, useEffect } from "react";
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

export default function SectionPage({ params }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState(null);
  const [hscBatchId, setHscBatchId] = useState(null);

  // Parse params.value to extract hscBatchId
  useEffect(() => {
    try {
      if (params?.value) {
        const parsedValue = JSON.parse(params.value);
        setHscBatchId(parsedValue.id);
      } else {
        console.error("Invalid params or params.value");
      }
    } catch (err) {
      console.error("Failed to parse params.value:", err);
    }
  }, [params]);

  // Fetch data on hscBatchId change
  useEffect(() => {
    if (!hscBatchId) return;

    const fetchSections = async () => {
      try {
        const response = await fetch(`/api/section/${hscBatchId}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          console.error("Failed to fetch sections");
        }
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };

    fetchSections();
  }, [hscBatchId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for creating or editing a section
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = editingId
        ? { id: editingId, name: formData.name }
        : { name: formData.name, hsc_batch: hscBatchId };

      const response = await fetch("/api/section", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          setError(data.error);
          return;
        }
        console.error("Failed to save section");
      } else {
        if (editingId) {
          setSections((prev) =>
            prev.map((section) => (section._id === editingId ? data : section))
          );
          setEditingId(null);
        } else {
          setSections((prev) => [...prev, data]);
        }
        setError(null);
        setIsOpen(false);
        setFormData({ name: "" });
      }
    } catch (err) {
      console.error("Error saving section:", err);
    }
  };

  // Handle edit button click
  const handleEdit = (id) => {
    const sectionToEdit = sections.find((section) => section._id === id);
    if (sectionToEdit) {
      setFormData({ name: sectionToEdit.sectionName });
      setEditingId(id);
      setIsOpen(true);
    }
  };

  // Confirm delete dialog
  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete section
  const handleDelete = async () => {
    if (deleteConfirmText === "delete") {
      try {
        const response = await fetch("/api/section", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: deleteId }),
        });

        if (response.ok) {
          setSections((prev) =>
            prev.filter((section) => section._id !== deleteId)
          );
          setIsDeleteDialogOpen(false);
          setDeleteConfirmText("");
        } else {
          console.error("Failed to delete section");
        }
      } catch (err) {
        console.error("Error deleting section:", err);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8">Add Section</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit" : "Enter"} Section Name
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Section Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">
              {editingId !== null ? "Update" : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {sections.map((section) => (
          <Card key={section._id}>
            <Link href={`/${hscBatchId}/${section._id}`}>
              <CardContent className="p-4">
                <p>
                  <strong>Section Name:</strong> {section.sectionName}
                </p>
              </CardContent>
            </Link>
            <CardFooter className="justify-end space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(section._id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => confirmDelete(section._id)}
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
