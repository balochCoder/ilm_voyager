import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Trash2 } from 'lucide-react';

interface FileWithTitle {
    id: string;
    name: string;
    title?: string;
    url: string;
    size?: number;
    mime_type?: string;
}

interface FileDisplayProps {
    files: FileWithTitle[];
    onDelete?: (fileId: string) => void;
    showDelete?: boolean;
    title?: string;
}

export default function FileDisplay({
    files,
    onDelete,
    showDelete = false,
    title = "Additional Files"
}: FileDisplayProps) {
    if (files.length === 0) {
        return null;
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {title} ({files.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {file.title || file.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {file.name} • {formatFileSize(file.size)}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => window.open(file.url, '_blank')}
                                >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                </Button>
                                {showDelete && onDelete && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onDelete(file.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
