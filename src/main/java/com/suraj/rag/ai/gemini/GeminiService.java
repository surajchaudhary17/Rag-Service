package com.suraj.rag.ai.gemini;


import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(Client client) {
        this.client = client;
    }

    public String generateText(String prompt) {

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null
                );

        return response.text();
    }

    public String askWithContext(
            String question,
            List<String> contexts
    ) {

        String contextText =
                String.join("\n", contexts);

        String finalPrompt = """
            You are a helpful AI assistant.

            Use ONLY the provided context to answer.

            Context:
            %s

            Question:
            %s
            """.formatted(
                contextText,
                question
        );

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        finalPrompt,
                        null
                );

        return response.text();
    }
}
