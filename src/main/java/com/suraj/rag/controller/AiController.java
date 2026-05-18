package com.suraj.rag.controller;

import com.suraj.rag.ai.gemini.EmbeddingService;
import com.suraj.rag.ai.gemini.GeminiService;
import com.suraj.rag.model.DocumentRequest;
import com.suraj.rag.qdrant.QdrantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;
    private final EmbeddingService embeddingService;
    private final QdrantService qdrantService;

    public AiController(
            GeminiService geminiService,
            EmbeddingService embeddingService,
            QdrantService qdrantService
    ) {
        this.geminiService = geminiService;
        this.embeddingService = embeddingService;
        this.qdrantService = qdrantService;
    }

    @GetMapping("/generate")
    public String generate(
            @RequestParam String prompt
    ) {
        return geminiService.generateText(prompt);
    }

    @GetMapping("/embed")
    public List<Float> embed(
            @RequestParam String text
    ) {

        return embeddingService.createEmbedding(text);
    }

    @PostMapping("/store")
    public String storeDocument(
            @RequestBody DocumentRequest request
    ) {

        List<Float> embedding =
                embeddingService.createEmbedding(
                        request.getText()
                );

        qdrantService.storeVector(
                request.getText(),
                embedding
        );

        return "Stored successfully";
    }

    @GetMapping("/search")
    public List<String> search(
            @RequestParam String query
    ) {

        List<Float> embedding =
                embeddingService.createEmbedding(query);

        return qdrantService.search(embedding);
    }

    @GetMapping("/rag")
    public String rag(
            @RequestParam String question
    ) {

        List<Float> embedding =
                embeddingService.createEmbedding(question);

        List<String> contexts =
                qdrantService.search(embedding);

        return geminiService.askWithContext(
                question,
                contexts
        );
    }
}
