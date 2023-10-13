const KEY = "f84fc31d";
// const data = ["tt4964310a"];

async function getMovieByIds(ids) {
  const controller = new AbortController();
  const movies = [];
  const getMovieById = async (idX) => {
    if (idX) {
      console.log(idX);
      const [userRating, ...idR] = idX.split("").reverse().join("");
      const id = idR.reverse().join("");
      const data = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${id}`,
        {
          signal: controller.signal,
        }
      );
      const res = await data.json();
      return {
        imdbID: id,
        imdbRating: Number(res.imdbRating),
        poster: res.Poster,
        runtime: Number.parseInt(res.Runtime),
        title: res.Title,
        year: res.Year,
        userRating: userRating === "a" ? 10 : Number(userRating),
      };
    }
  };

  for (const id of ids) {
    const movie = await getMovieById(id);
    movies.push(movie);
    console.log(movie);
  }
  return movies;
}

export async function getUserMovies(web3Api, account) {
  console.clear();
  const data = await web3Api.contract.methods
    .getMovies(account)
    .call({ from: account });
  console.log(data);
  const movies = await getMovieByIds(data);
  return movies.length !== 0 ? movies : [];
}
export async function addMovie(movie, web3Api, account) {
  console.log(movie);
  await web3Api.contract.methods
    .addMovie(
      `${movie.imdbID}${movie.userRating === 10 ? "a" : movie.userRating}`
    )
    .send({
      from: account,
      value: web3Api.web3.utils.toWei("0.0015", "ether"),
    });
  console.log(web3Api);
  window.location.reload();
}
