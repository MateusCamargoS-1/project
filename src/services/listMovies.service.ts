import { api } from "../lib/axios";

const BASE_URL = "/movies";

const listMovies = async (): Promise<any[]> => {
    try {
        const response = await api.get<any[]>(`${BASE_URL}/list`);
        console.log("List: ", response);
        return response.data;
    } catch {
        throw new Error("Erro ao listar filmes");
    }
};


export default listMovies;