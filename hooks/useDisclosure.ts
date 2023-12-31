import { issuesTypeI } from '@/types/types';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react'

const useDisclosure = () => {
    useEffect(() => {
        const issues = async () => {
          await axios
            .get("/api/auth/getIssue")
            .then((res: AxiosResponse) => {
              setData(res.data.reverse());
            })
            .catch((err: Error) => {
              console.log(err);
            });
        };
        issues();
      }, []);
    const [data, setData] = useState<issuesTypeI[]>([]);
    return {data, setData};
}

export default useDisclosure