import { api } from "../lib/axios";

const baseUrl = "/stream";

const getStreamUrl = async (id: number) => {
    try {
        const response = await api.get(`${baseUrl}/${id}`);
        return response.data;
    } catch {
        throw new Error("Erro ao listar filmes");
    }
};

export default getStreamUrl;