package com.dokit.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "jobExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2); // Only 2 documents processed at exactly the same time
        executor.setMaxPoolSize(4);  // Max 4 threads under heavy load
        executor.setQueueCapacity(100); // Queue up to 100 jobs in memory
        executor.setThreadNamePrefix("DocWorker-");
        executor.initialize();
        return executor;
    }
}