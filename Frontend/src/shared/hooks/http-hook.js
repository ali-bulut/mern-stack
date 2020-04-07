import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests= useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl=new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal:httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current=activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);

        //it means that when the response returns 4xx or 5xx status codes it is not received as error.
        //so we have to check this out. And we wrote if the status code is different from 2xx throw an error.
        if (!response.ok) {
          setIsLoading(false);
          throw new Error(responseData.message);
        }

        setIsLoading(false);

        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    }, []);

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])

  return { isLoading, error, sendRequest, clearError };
};
