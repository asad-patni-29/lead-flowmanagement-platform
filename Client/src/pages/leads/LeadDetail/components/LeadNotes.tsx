import moment from 'moment';
import type { LeadNote } from '@/features/leads';

interface LeadNotesProps {
  notes: LeadNote[];
  noteText: string;
  saving: boolean;
  onNoteTextChange: (value: string) => void;
  onAddNote: () => void;
}

const LeadNotes: React.FC<LeadNotesProps> = ({
  notes,
  noteText,
  saving,
  onNoteTextChange,
  onAddNote,
}) => {
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
        {notes.length > 0 && (
          <span className="ml-auto inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {notes.length}
          </span>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {notes.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm text-slate-500">No notes yet. Add one to get started.</p>
          </div>
        )}

        {sortedNotes.map((note) => (
          <div
            key={note._id}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition"
          >
            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{note.text}</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                {note.author.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-xs text-slate-600">
                <span className="font-medium">{note.author.name}</span> ·{' '}
                {moment(note.createdAt).format('MMM D, YYYY h:mm A')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <textarea
          rows={2}
          value={noteText}
          onChange={(e) => onNoteTextChange(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder-slate-500 bg-white"
        />
        <button
          type="button"
          onClick={onAddNote}
          disabled={!noteText.trim() || saving}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed h-fit whitespace-nowrap"
        >
          Add note
        </button>
      </div>
    </div>
  );
};

export default LeadNotes;
