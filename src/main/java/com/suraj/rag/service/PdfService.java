package com.suraj.rag.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PdfService {

    public String extractText(
            MultipartFile file
    ) {

        try {

            PDDocument document =
                    Loader.loadPDF(
                            file.getBytes()
                    );

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String text =
                    stripper.getText(document);

            document.close();

            return text;

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}
