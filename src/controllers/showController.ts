import { Request, Response } from "express";
import { tmdbApiClient } from "helpers/tmdbApiClient";
import { unwrapObject } from "helpers/unwrapObject";
import { FindByIDResponse } from "types/common";

export const getMovieByImdbID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const imdbID = req.params.imdbID;
    const endpoint = `/find/${imdbID}`;
    const params = { external_source: "imdb_id" };

    if (!imdbID) {
      res.status(400).json({ message: "IMDb ID is required" });
      return;
    }

    const { data } = await tmdbApiClient.get<FindByIDResponse>(endpoint, {
      params,
    });

    if (!data) {
      res
        .status(404)
        .json({ message: "No results found for the given IMDb ID" });
      return;
    }

    const unwrapedData = unwrapObject(data);

    const normalizeData = {
      id: unwrapedData?.id,
      overview: unwrapedData?.overview,
      vote_average: unwrapedData?.vote_average,
      title: unwrapedData?.name || unwrapedData?.title,
      first_air_date:
        unwrapedData?.first_air_date || unwrapedData?.release_date,
    };

    res.status(200).json(normalizeData);
  } catch (error) {
    console.error("Error fetching movie by IMDb ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
