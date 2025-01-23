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
import { getDatabase, ref, set, get, child, remove } from "firebase/database"; // Firebase Realtime Database
import { db } from "@/lib/firebase"; // Firebase Firestore

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

  useEffect(() => {
    if (params?.value) {
      const parsedValue = JSON.parse(params.value);
      setHscBatchId(parsedValue.id);
    }
  }, [params]);

  // Fetch data from Realtime Database when hscBatchId changes
  useEffect(() => {
    if (!hscBatchId) return;

    const fetchSections = async () => {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `hsc/${hscBatchId}/sections`));
        if (snapshot.exists()) {
          const sectionsData = snapshot.val();
          setSections(
            Object.keys(sectionsData).map((id) => ({
              _id: id,
              sectionName: sectionsData[id].sectionName,
            }))
          );
        } else {
          setSections([]);
        }
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };

    fetchSections();
  }, [hscBatchId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check if the section name is unique for the batch
  const isSectionNameUnique = (name) => {
    return !sections.some((section) => section.sectionName === name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSectionNameUnique(formData.name)) {
      setError("Section name must be unique.");
      return;
    }

    try {
      const dbRef = ref(getDatabase());

      const newSection = {
        sectionName: formData.name,
      };

      if (editingId) {
        // Update an existing section
        await set(
          child(dbRef, `hsc/${hscBatchId}/sections/${formData.name}`), // Use section name as the key
          newSection
        );
        setSections((prev) =>
          prev.map((section) =>
            section.sectionName === formData.name
              ? { ...section, sectionName: formData.name }
              : section
          )
        );
      } else {
        // Create a new section
        await set(
          child(dbRef, `hsc/${hscBatchId}/sections/${formData.name}`), // Use section name as the key
          newSection
        );
        setSections((prev) => [
          ...prev,
          { _id: formData.name, sectionName: formData.name },
        ]);
      }

      setFormData({ name: "" });
      setError(null);
      setIsOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving section:", err);
      setError("Failed to save section");
    }
  };

  const handleEdit = (id) => {
    const sectionToEdit = sections.find((section) => section._id === id);
    if (sectionToEdit) {
      setFormData({ name: sectionToEdit.sectionName });
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
      try {
        const dbRef = ref(getDatabase());
        await remove(child(dbRef, `hsc/${hscBatchId}/sections/${deleteId}`));
        setSections((prev) =>
          prev.filter((section) => section._id !== deleteId)
        );
        setIsDeleteDialogOpen(false);
        setDeleteConfirmText("");
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
