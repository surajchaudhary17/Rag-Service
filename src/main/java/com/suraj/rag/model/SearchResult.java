package com.suraj.rag.model;

public class SearchResult {

    private String text;

    private String source;

    private int chunk;

    public SearchResult() {
    }

    public SearchResult(
            String text,
            String source,
            int chunk
    ) {
        this.text = text;
        this.source = source;
        this.chunk = chunk;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public int getChunk() {
        return chunk;
    }

    public void setChunk(int chunk) {
        this.chunk = chunk;
    }
}
