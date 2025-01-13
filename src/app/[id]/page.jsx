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
  const [formData, setFormData] = useState({
    name: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      const response = await fetch(`/api/section/${params.id}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        console.error("Failed to fetch sections");
      }
    };

    fetchSections();
  }, [params.id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId !== null) {
      const response = await fetch("/api/section", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: formData.name,
        }),
      });

      if (response.ok) {
        const updatedSection = await response.json();
        setSections(
          sections.map((section) =>
            section._id === editingId ? updatedSection : section
          )
        );
        setEditingId(null);
      } else {
        console.error("Failed to update section");
      }
    } else {
      const response = await fetch("/api/section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          hsc_batch: params.id,
        }),
      });

      if (response.ok) {
        const newSection = await response.json();
        setSections([...sections, newSection]);
      } else {
        console.error("Failed to save section");
      }
    }

    setFormData({ name: "" });
    setIsOpen(false);
  };

  const handleEdit = (id) => {
    const sectionToEdit = sections.find((section) => section._id === id);
    if (sectionToEdit) {
      setFormData({
        name: sectionToEdit.sectionName,
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
      const response = await fetch("/api/section", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      if (response.ok) {
        setSections(sections.filter((section) => section._id !== deleteId));
        setIsDeleteDialogOpen(false);
        setDeleteConfirmText("");
        setDeleteId(null);
      } else {
        console.error("Failed to delete section");
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
            <Button type="submit">
              {editingId !== null ? "Update" : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {sections.map((section) => (
          <Card key={section._id}>
            <Link href={`/${params.id}/${section._id}`}>
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
