import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandCard from '@/components/BrandCard';
import FormField from '@/components/FormField';
import { useAddNote } from '@/hooks/useQueries';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { Note, Variant_internal_display } from '@/backend';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface NotesPanelProps {
  requestId: bigint;
  publicNotes: Note[];
  internalNotes: Note[];
}

export default function NotesPanel({ requestId, publicNotes, internalNotes }: NotesPanelProps) {
  const addNote = useAddNote();
  const { data: userProfile } = useGetCallerUserProfile();
  const [publicNoteText, setPublicNoteText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');

  const handleAddNote = async (noteType: 'display' | 'internal') => {
    const noteText = noteType === 'display' ? publicNoteText : internalNoteText;
    
    if (!noteText.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    const authorName = userProfile?.name || 'Admin';

    try {
      await addNote.mutateAsync({
        requestId,
        noteType: noteType as Variant_internal_display,
        author: authorName,
        message: noteText.trim(),
      });

      if (noteType === 'display') {
        setPublicNoteText('');
      } else {
        setInternalNoteText('');
      }

      toast.success(`${noteType === 'display' ? 'Public' : 'Internal'} note added`);
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note');
    }
  };

  const renderNotesList = (notes: Note[], emptyMessage: string) => {
    if (notes.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-8">{emptyMessage}</p>
      );
    }

    return (
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={index} className="border-l-2 border-primary pl-4 py-2">
            <div className="flex items-start justify-between mb-1">
              <p className="font-medium text-sm">{note.author}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(Number(note.timestamp) / 1000000).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.message}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <BrandCard>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Notes</h3>
        
        <Tabs defaultValue="public">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public">
              Public Notes ({publicNotes.length})
            </TabsTrigger>
            <TabsTrigger value="internal">
              Internal Notes ({internalNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Public notes are visible to customers on the status page.
            </p>
            
            {renderNotesList(publicNotes, 'No public notes yet')}

            <FormField label="Add Public Note">
              <Textarea
                value={publicNoteText}
                onChange={(e) => setPublicNoteText(e.target.value)}
                placeholder="Enter a note visible to the customer..."
                rows={3}
              />
            </FormField>
            
            <Button
              onClick={() => handleAddNote('display')}
              disabled={!publicNoteText.trim() || addNote.isPending}
              className="w-full"
            >
              {addNote.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Add Public Note
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="internal" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Internal notes are only visible to admins.
            </p>
            
            {renderNotesList(internalNotes, 'No internal notes yet')}

            <FormField label="Add Internal Note">
              <Textarea
                value={internalNoteText}
                onChange={(e) => setInternalNoteText(e.target.value)}
                placeholder="Enter an internal note (not visible to customer)..."
                rows={3}
              />
            </FormField>
            
            <Button
              onClick={() => handleAddNote('internal')}
              disabled={!internalNoteText.trim() || addNote.isPending}
              className="w-full"
            >
              {addNote.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Add Internal Note
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </BrandCard>
  );
}
