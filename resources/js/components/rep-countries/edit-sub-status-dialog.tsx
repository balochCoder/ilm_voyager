import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface EditSubStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editedName: string;
    setEditedName: (name: string) => void;
    isEditing: boolean;
    errors: { name?: string };
    handleEditSubStatus: () => void;
}

export default function EditSubStatusDialog({
    open,
    onOpenChange,
    editedName,
    setEditedName,
    isEditing,
    errors,
    handleEditSubStatus,
}: EditSubStatusDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Sub-Step</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="edit-sub-status-name">Sub-Step Name</Label>
                        <Input
                            id="edit-sub-status-name"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Sub-step name"
                            disabled={isEditing}
                            autoFocus
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={isEditing || !editedName.trim()}
                        onClick={handleEditSubStatus}
                    >
                        {isEditing ? 'Updating...' : 'Update Sub-Step'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
