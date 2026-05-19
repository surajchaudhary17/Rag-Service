package com.suraj.rag.ai.gemini;


import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.suraj.rag.model.ChatMessage;
import com.suraj.rag.model.SearchResult;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

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
            List<SearchResult> contexts
    ) {

        String contextText =
                contexts.stream()
                        .map(result -> """

                            SOURCE: %s
                            CHUNK: %d

                            %s
                            """.formatted(
                                result.getSource(),
                                result.getChunk(),
                                result.getText()
                        ))
                        .reduce("", String::concat);

        String finalPrompt = """
            You are an AI assistant.

            Answer ONLY from the provided context.

            If answer is not available,
            say:
            "I could not find relevant information."

            ====================
            CONTEXT
            ====================

            %s

            ====================
            QUESTION
            ====================

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

    public Flux<String> askWithContextStream(
            String question,
            List<SearchResult> contexts
    ) {

        return Flux.create(sink -> {

            try {

                String contextText =
                        contexts.stream()
                                .map(SearchResult::getText)
                                .reduce("", String::concat);

                String finalPrompt = """
                    Answer ONLY from provided context.

                    CONTEXT:
                    %s

                    QUESTION:
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

                String text = response.text();

                for (String token : text.split(" ")) {

                    sink.next(token + " ");

                    Thread.sleep(50);
                }

                sink.complete();

            } catch (Exception e) {

                sink.error(e);
            }
        });
    }

    public String askWithMemory(
            String question,
            List<SearchResult> contexts,
            List<ChatMessage> history
    ) {

        String historyText =
                history.stream()
                        .map(msg -> """

                            %s: %s
                            """.formatted(
                                msg.getRole(),
                                msg.getContent()
                        ))
                        .reduce("", String::concat);

        String contextText =
                contexts.stream()
                        .map(SearchResult::getText)
                        .reduce("", String::concat);

        String finalPrompt = """
            You are an AI assistant.

            Use conversation history
            and retrieved context.

            ====================
            CHAT HISTORY
            ====================

            %s

            ====================
            RETRIEVED CONTEXT
            ====================

            %s

            ====================
            QUESTION
            ====================

            %s
            """.formatted(
                historyText,
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
