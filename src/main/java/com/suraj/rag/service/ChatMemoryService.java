package com.suraj.rag.service;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.suraj.rag.model.ChatMessage;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMemoryService {

    private final RedissonClient redissonClient;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public ChatMemoryService(
            RedissonClient redissonClient
    ) {
        this.redissonClient = redissonClient;
    }

    public List<ChatMessage> getHistory(
            String chatId
    ) {

        try {

            RBucket<String> bucket =
                    redissonClient.getBucket(
                            "chat:" + chatId
                    );

            String json = bucket.get();

            if (json == null) {
                return new ArrayList<>();
            }

            return objectMapper.readValue(
                    json,
                    new TypeReference<>() {}
            );

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    public void saveMessage(
            String chatId,
            ChatMessage message
    ) {

        try {

            List<ChatMessage> history =
                    getHistory(chatId);

            history.add(message);

            String json =
                    objectMapper.writeValueAsString(
                            history
                    );

            redissonClient.getBucket(
                    "chat:" + chatId
            ).set(json);

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}
