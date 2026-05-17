package com.suraj.rag.ai.gemini;

import com.google.genai.Client;
import com.google.genai.types.ContentEmbedding;
import com.google.genai.types.EmbedContentResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmbeddingService {

    private final Client client;

    public EmbeddingService(Client client) {
        this.client = client;
    }

    public List<Float> createEmbedding(String text) {

        EmbedContentResponse response =
                client.models.embedContent(
                        "gemini-embedding-001",
                        text,
                        null
                );

        List<ContentEmbedding> embeddings =
                response.embeddings()
                        .orElseThrow(() ->
                                new RuntimeException("No embeddings returned"));

        if (embeddings.isEmpty()) {
            throw new RuntimeException("Embedding list is empty");
        }


        ContentEmbedding embedding = embeddings.get(0);

        return embedding.values()
                .orElseThrow(() ->
                        new RuntimeException("Embedding values missing"));
    }
}