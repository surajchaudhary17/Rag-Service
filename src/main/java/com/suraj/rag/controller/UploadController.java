package com.suraj.rag.controller;

import com.suraj.rag.ai.gemini.EmbeddingService;
import com.suraj.rag.qdrant.QdrantService;
import com.suraj.rag.service.PdfService;
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
    private final PdfService pdfService;

    public UploadController(
            TextChunkingService chunkingService,
            EmbeddingService embeddingService,
            QdrantService qdrantService,
            PdfService pdfService
    ) {
        this.chunkingService = chunkingService;
        this.embeddingService = embeddingService;
        this.qdrantService = qdrantService;
        this.pdfService = pdfService;
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

        for (int i = 0; i < chunks.size(); i++) {

            String chunk = chunks.get(i);

            List<Float> embedding =
                    embeddingService.createEmbedding(chunk);

            qdrantService.storeVector(
                    chunk,
                    embedding,
                    file.getOriginalFilename(),
                    i
            );
        }

        return "Indexed " + chunks.size() + " chunks";
    }

    @PostMapping("/pdf")
    public String uploadPdf(
            @RequestParam("file") MultipartFile file
    ) {
        System.out.println(file.getOriginalFilename());

        String text =
                pdfService.extractText(file);

        List<String> chunks =
                chunkingService.chunkText(text);

        for (int i = 0; i < chunks.size(); i++) {

            String chunk = chunks.get(i);

            List<Float> embedding =
                    embeddingService.createEmbedding(chunk);

            qdrantService.storeVector(
                    chunk,
                    embedding,
                    file.getOriginalFilename(),
                    i
            );
        }

        return "Indexed PDF with "
                + chunks.size()
                + " chunks";
    }
}
