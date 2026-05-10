package com.suraj.rag.ai.gemini;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

public class GeminiTestFile {
    public static void main(String[] args) {
        // The client gets the API key from the environment variable `GOOGLE_API_KEY`.
//        String GOOGLE_API_KEY = "xyz";
//        Client client = Client.builder()
//                .apiKey(GOOGLE_API_KEY)
//                .build();

        Client client = new Client();
//        System.out.println(System.getenv("GOOGLE_API_KEY"));
        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3-flash-preview",
                        "who are you?",
                        null);

        System.out.println(response.text());
    }
}






