import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface AddSubStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    statusName: string;
    newSubStatusName: string;
    setNewSubStatusName: (name: string) => void;
    isAdding: boolean;
    errors: { name?: string };
    handleAddSubStatus: () => void;
}

export default function AddSubStatusDialog({
    open,
    onOpenChange,
    statusName,
    newSubStatusName,
    setNewSubStatusName,
    isAdding,
    errors,
    handleAddSubStatus,
}: AddSubStatusDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Sub-Step to "{statusName}"</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="sub-status-name">Sub-Step Name</Label>
                        <Input
                            id="sub-status-name"
                            value={newSubStatusName}
                            onChange={(e) => setNewSubStatusName(e.target.value)}
                            placeholder="e.g., Document Review, Interview, Approval"
                            disabled={isAdding}
                            autoFocus
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={isAdding || !newSubStatusName.trim()}
                        onClick={handleAddSubStatus}
                    >
                        {isAdding ? 'Adding...' : 'Add Sub-Step'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
