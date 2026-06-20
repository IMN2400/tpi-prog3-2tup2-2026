import { useEffect, useState } from "react";

export const useFetchFromAPI = (apiRoute, initialValue = []) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const callApi = async () => {
      try {
        const response = await fetch(`http://localhost:3000${apiRoute}`);

        if (!response.ok) {
          throw new Error("No se pudo recuperar la información");
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    callApi();
  }, [apiRoute]);

  return { data, loading, error };
};