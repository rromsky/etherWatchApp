import { useState, useMovies } from "./Hoocks";
import NavBar from "./Components/nav-panel/NavBar";
import Search from "./Components/nav-panel/Search";
import { WatchedMoviesList, WatchedSummary } from "./Components/WatchedComp";
import { MovieList, MovieDetails } from "./Components/MovieComponent";
import { Loader, ErrorMessage } from "./Components/Stock";
import { useEffect } from "react";
import { getUserMovies } from "./Components/web3/web3Component";
import { Link } from "react-router-dom";
import { addMovie } from "./Components/web3/web3Component";

function NumResults({ movies }) {
  return (
    <div className="num-results">
      <Link className="account-link" to="/account">
        Account
      </Link>
      <p>
        Found <strong>{movies.length}</strong> results
      </p>
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

export default function Chinema({ web3Api, account }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isLoadingMovie, setLoading] = useState(false);
  const [isTransaction, setTransaction] = useState(false);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatchedMovie] = useState([]);
  // const [watched, setWatchedMovie] = useLocalStorageState([], "watched");
  const [movie, setMovie] = useState("");
  const setWatched = (movie) => {
    setWatchedMovie(movie);
  };
  useEffect(() => {
    const setM = async () => {
      const mov = await getUserMovies(web3Api, account);
      setWatched(mov);
    };

    setM();
  }, []);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  async function handleAddWatched(movie) {
    setMovie(movie);
    setLoading(true);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  const modal = () => (
    <>
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-content box is-flex ai-c jc-c fg-4 flex-column">
          <h4>
            {isTransaction ? "Loading transaction..." : "Confirm transaction"}
          </h4>
          <div className="mx--2 w-100 is-flex sp-b">
            <button
              className={`w-120 button is-primary mt-2 as-c `}
              onClick={() => {
                setTransaction(true);
                async function sendTransaction() {
                  try {
                    await addMovie(movie, web3Api, account);
                    const setM = async () => {
                      const mov = await getUserMovies(web3Api, account);
                      setWatched(mov);
                    };

                    setM();
                  } catch (e) {
                    console.log(e);
                  }
                  setLoading(false);
                  setTransaction(false);
                }
                sendTransaction();
              }}
            >
              Submit
            </button>
            <button
              className={` ${
                isTransaction && "is-light"
              } w-120 button is-danger mt-2 as-c`}
              onClick={() => {
                setLoading(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
  return (
    <>
      {isLoadingMovie && modal()}
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
