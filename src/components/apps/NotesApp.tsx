import { useState, useEffect } from 'react';
import { VoiceController } from '../../services/voiceController';
import { Note } from '../../types';
import './AppStyles.css';

interface Props {
  onClose: () => void;
  voiceController: VoiceController | null;
}

export default function NotesApp({ onClose, voiceController }: Props) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('holo-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    localStorage.setItem('holo-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      timestamp: Date.now()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
    setEditContent('');
  };

  const saveNote = () => {
    if (!activeNote) return;
    
    if (editContent.trim()) {
      setNotes(prev => prev.map(note => 
        note.id === activeNote.id 
          ? { ...note, content: editContent, timestamp: Date.now() }
          : note
      ));
    } else {
      deleteNote(activeNote.id);
    }
    setActiveNote(null);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
  };

  const openNote = (note: Note) => {
    setActiveNote(note);
    setEditContent(note.content);
  };

  const handleVoiceDictation = () => {
    if (!voiceController) return;
    
    if (isListening) {
      voiceController.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const originalCallback = (voiceController as any).callback;
      (voiceController as any).callback = (text: string) => {
        setEditContent(prev => prev + (prev ? ' ' : '') + text);
        setIsListening(false);
        voiceController.stopListening();
        (voiceController as any).callback = originalCallback;
      };
      voiceController.startListening();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreview = (content: string) => {
    return content.length > 50 ? content.substring(0, 50) + '...' : content || 'Empty note';
  };

  return (
    <div className="app-window glass-panel notes-app">
      <div className="app-header">
        <h2>Notes</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="notes-content">
        {!activeNote ? (
          <div className="notes-list">
            <button className="glass-button new-note-button" onClick={createNewNote}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Note
            </button>

            {notes.length === 0 ? (
              <div className="empty-state">
                <p>No notes yet</p>
                <span>Create a new note or use voice dictation</span>
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map(note => (
                  <div 
                    key={note.id} 
                    className="note-card glass-panel"
                    onClick={() => openNote(note)}
                  >
                    <p className="note-preview">{getPreview(note.content)}</p>
                    <span className="note-date">{formatDate(note.timestamp)}</span>
                    <button 
                      className="delete-note-button"
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="note-editor">
            <div className="editor-header">
              <button className="back-button" onClick={saveNote}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Save
              </button>
              
              <button 
                className={`voice-button small ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceDictation}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                </svg>
                {isListening ? 'Listening...' : 'Dictate'}
              </button>
            </div>

            <textarea
              className="note-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Start typing or use voice dictation..."
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
