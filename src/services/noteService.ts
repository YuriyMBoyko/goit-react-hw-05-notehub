import axios from 'axios'
import type { Note, NoteTag } from '../types/note.ts'

export interface FetchNotesParams {
  search: string;
  page: number;
  perPage: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

const NOTE_HUB_URL = 'https://notehub-public.goit.study/api'

const api = axios.create(
  {
    baseURL: NOTE_HUB_URL,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    }
  }
)

export async function fetchNotes({ search, /*tag,*/ page, perPage/*, sortBy*/ }: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>(
    '/notes',
    {
      params: {
        search,
        page,
        perPage,
      },
    }
  );

  return response.data;
}

export async function createNote({ title, content, tag }: CreateNoteParams): Promise<Note> {
  const response = await api.post<Note>(
    '/notes',
    {
      title,
      content,
      tag,
    }
  );

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
}
