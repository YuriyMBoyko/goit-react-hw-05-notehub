import { useState } from 'react'
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from './App.module.css'
import { fetchNotes } from "../../services/noteService";
import SearchBox from '../SearchBox/SearchBox.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import NoteList from '../NoteList/NoteList.tsx';
import Modal from '../Modal/Modal.tsx';
import NoteForm from '../NoteForm/NoteForm.tsx';

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () => 
      fetchNotes({
        page,
        perPage: 12,
        search: query,
      }),
    placeholderData: keepPreviousData,
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 300)

  const handleChange = async (value: string) => {
    setSearchValue(value);
    debouncedSetSearch(value);
  }

  const notes = data?.notes ?? [];

  const totalPages = data?.totalPages ?? 0;

  return (
  <div className={css.app}>
    <header className={css.toolbar}>
      <SearchBox value={searchValue} onChange={handleChange}></SearchBox>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
    </header>

    <main>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}
    </main>

    {isModalOpen && (
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    )}

  </div>

  );
}
