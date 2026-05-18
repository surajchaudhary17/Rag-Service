package com.suraj.rag.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TextChunkingService {

    private static final int CHUNK_SIZE = 500;
    private static final int CHUNK_OVERLAP = 100;

    public List<String> chunkText(String text) {

        List<String> chunks = new ArrayList<>();

        int start = 0;

        while (start < text.length()) {

            int end = Math.min(
                    start + CHUNK_SIZE,
                    text.length()
            );

            chunks.add(
                    text.substring(start, end)
            );

            start += (CHUNK_SIZE - CHUNK_OVERLAP);
        }

        return chunks;
    }
}
