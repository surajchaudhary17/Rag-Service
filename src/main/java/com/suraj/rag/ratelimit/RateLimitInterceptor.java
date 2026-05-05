package com.suraj.rag.ratelimit;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.redisson.api.RRateLimiter;
import org.redisson.api.RateIntervalUnit;
import org.redisson.api.RateType;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RedissonClient redisson;

    public RateLimitInterceptor(RedissonClient redisson) {
        this.redisson = redisson;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        String ip = request.getRemoteAddr();
        String key = "rate_limit:" + ip;

        RRateLimiter limiter = redisson.getRateLimiter(key);

        limiter.trySetRate(
                RateType.OVERALL,
                10,
                1,
                RateIntervalUnit.MINUTES
        );

        if (!limiter.tryAcquire()) {
            response.setStatus(429);
            return false;
        }

        return true;
    }
}