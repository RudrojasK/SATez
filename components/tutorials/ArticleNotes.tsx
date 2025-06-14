import React, { useEffect, useState } from 'react';
import { Article } from '../../constants/articles';

interface Note {
  id: string;
  content: string;
  section: string;
  timestamp: number;
  tags: string[];
}

interface ArticleNotesProps {
  article: Article;
  onNoteAdd?: (note: Note) => void;
  onNoteDelete?: (noteId: string) => void;
  onNotesUpdate?: (notes: Note[]) => void;
}

export const ArticleNotes: React.FC<ArticleNotesProps> = ({
  article,
  onNoteAdd,
  onNoteDelete,
  onNotesUpdate
}) => {
  const [newNote, setNewNote] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`article-notes-${article.id}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, [article.id]);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`article-notes-${article.id}`, JSON.stringify(notes));
    onNotesUpdate?.(notes);
  }, [notes, article.id]);

  const sections = article.content
    .split('##')
    .slice(1)
    .map(section => section.split('\n')[0].trim());

  const commonTags = ['important', 'review', 'question', 'example', 'formula'];

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedSection) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      content: newNote,
      section: selectedSection,
      timestamp: Date.now(),
      tags: selectedTags
    };

    setNotes(prevNotes => [...prevNotes, note]);
    onNoteAdd?.(note);
    setNewNote('');
    setSelectedTags([]);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    onNoteDelete?.(noteId);
  };

  const handleEditNote = (noteId: string, newContent: string) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId
          ? { ...note, content: newContent }
          : note
      )
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">My Notes</h3>

      {/* Add Note Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a section</option>
            {sections.map((section, index) => (
              <option key={index} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Write your note here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {commonTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddNote}
          disabled={!newNote.trim() || !selectedSection}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map(note => (
          <div
            key={note.id}
            className="p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-700">
                {note.section}
              </span>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
            <textarea
              value={note.content}
              onChange={(e) => handleEditNote(note.id, e.target.value)}
              className="w-full p-2 bg-transparent border-none focus:ring-0 text-gray-600 mb-2"
              rows={3}
            />
            <div className="flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(note.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 