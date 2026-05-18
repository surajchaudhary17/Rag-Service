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

    public String askWithContextOld(
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

    public String askWithContext(
            String question,
            List<String> contexts
    ) {

        String contextText =
                String.join("\n\n", contexts);
        /*
        this is called prompt grounding, Without this:

        - models hallucinate
        - ignore retrieval
        - answer from training data

        This instruction forces:
        👉 retrieval-based answering.
         */

        String finalPrompt = """
            You are an AI assistant.

            Answer ONLY from the provided context.

            If the answer is not present in the context,
            say:
            "I could not find relevant information."

            =====================
            CONTEXT
            =====================

            %s

            =====================
            QUESTION
            =====================

            %s

            =====================
            ANSWER
            =====================
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
