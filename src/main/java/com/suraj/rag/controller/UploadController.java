package com.suraj.rag.controller;

import com.suraj.rag.ai.gemini.EmbeddingService;
import com.suraj.rag.qdrant.QdrantService;
import com.suraj.rag.service.TextChunkingService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final TextChunkingService chunkingService;
    private final EmbeddingService embeddingService;
    private final QdrantService qdrantService;

    public UploadController(
            TextChunkingService chunkingService,
            EmbeddingService embeddingService,
            QdrantService qdrantService
    ) {
        this.chunkingService = chunkingService;
        this.embeddingService = embeddingService;
        this.qdrantService = qdrantService;
    }

    @PostMapping("/txt")
    public String uploadTxt(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String text = new String(
                file.getBytes(),
                StandardCharsets.UTF_8
        );

        List<String> chunks =
                chunkingService.chunkText(text);

        for (String chunk : chunks) {

            List<Float> embedding =
                    embeddingService.createEmbedding(chunk);

            qdrantService.storeVector(
                    chunk,
                    embedding
            );
        }

        return "Indexed " + chunks.size() + " chunks";
    }
}
