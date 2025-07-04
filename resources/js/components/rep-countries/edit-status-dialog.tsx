import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface EditStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editedStatusName: string;
    setEditedStatusName: (name: string) => void;
    isEditing: boolean;
    errors: { status_name?: string };
    handleEditStatus: () => void;
}

export default function EditStatusDialog({
    open,
    onOpenChange,
    editedStatusName,
    setEditedStatusName,
    isEditing,
    errors,
    handleEditStatus,
}: EditStatusDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Application Step</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="edit-status-name">Step Name</Label>
                        <Input
                            id="edit-status-name"
                            value={editedStatusName}
                            onChange={(e) => setEditedStatusName(e.target.value)}
                            placeholder="Step name"
                            disabled={isEditing}
                            autoFocus
                        />
                        {errors.status_name && <p className="text-sm text-red-600">{errors.status_name}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={isEditing || !editedStatusName.trim()}
                        onClick={handleEditStatus}
                    >
                        {isEditing ? 'Updating...' : 'Update Step'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
