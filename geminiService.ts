
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function enhanceSearch(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `L'utilisateur recherche: "${query}" dans le contexte d'une bibliothèque numérique au Burkina Faso. 
      S'il utilise des termes locaux (ex: dolo, Faso, Mossi), traduis ou explique-les pour améliorer la recherche sémantique.
      Retourne uniquement une liste de 3 mots-clés de recherche pertinents en français séparés par des virgules.`,
    });
    return response.text.split(',').map(s => s.trim());
  } catch (error) {
    console.error("Gemini search enhancement failed", error);
    return [query];
  }
}

export async function summarizeBook(title: string, author: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Génère un résumé court (3 phrases) du livre "${title}" de ${author}. 
      Si c'est un livre fictif burkinabè, imagine un résumé cohérent avec la culture locale.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    return "Résumé indisponible pour le moment.";
  }
}
