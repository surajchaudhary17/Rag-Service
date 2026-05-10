package com.suraj.rag.qdrant;

import com.google.protobuf.Struct;
import com.google.protobuf.Value;
import io.qdrant.client.PointIdFactory;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections;
import io.qdrant.client.grpc.Points;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class QdrantService {

    private static final String COLLECTION_NAME = "documents";

    private final QdrantClient qdrantClient;

    public QdrantService(QdrantClient qdrantClient) {
        this.qdrantClient = qdrantClient;
    }

    @PostConstruct
    public void createCollection() {

        try {

            qdrantClient.createCollectionAsync(
                    COLLECTION_NAME,
                    Collections.VectorParams.newBuilder()
                            .setSize(3072)
                            .setDistance(Collections.Distance.Cosine)
                            .build()
            ).get();

            System.out.println("Qdrant collection created");

        } catch (Exception e) {
            System.out.println("Collection may already exist");
        }
    }

    public void storeVector(
            String text,
            List<Float> embedding
    ) {

        try {

            Points.PointStruct point =
                    Points.PointStruct.newBuilder()
                            .setId(
                                    PointIdFactory.id(
                                            UUID.randomUUID()
                                    )
                            )
                            .setVectors(
                                    Points.Vectors.newBuilder()
                                            .setVector(
                                                    Points.Vector.newBuilder()
                                                            .addAllData(embedding)
                                                            .build()
                                            )
                                            .build()
                            )
                            .putAllPayload(
                                    Map.of(
                                    )
                            )
                            .build();

            qdrantClient.upsertAsync(
                    COLLECTION_NAME,
                    List.of(point)
            ).get();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}