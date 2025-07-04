import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface AddStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRepCountryName: string;
    newStatusName: string;
    setNewStatusName: (name: string) => void;
    isAdding: boolean;
    errors: { name?: string };
    handleAddStatus: () => void;
}

export default function AddStatusDialog({
    open,
    onOpenChange,
    currentRepCountryName,
    newStatusName,
    setNewStatusName,
    isAdding,
    errors,
    handleAddStatus,
}: AddStatusDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Application Step for {currentRepCountryName}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="status-name">Step Name</Label>
                        <Input
                            id="status-name"
                            value={newStatusName}
                            onChange={(e) => setNewStatusName(e.target.value)}
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
                        disabled={isAdding || !newStatusName.trim()}
                        onClick={handleAddStatus}
                    >
                        {isAdding ? 'Adding...' : 'Add Step'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
