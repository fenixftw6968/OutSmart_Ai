package com.outsmartai.backend.repository;

import com.outsmartai.backend.model.GameSession;
import com.outsmartai.backend.model.GameStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameSessionRepository extends MongoRepository<GameSession, String> {
    List<GameSession> findByUserIdOrderByStartedAtDesc(String userId, Pageable pageable);
    Optional<GameSession> findByIdAndUserId(String id, String userId);
    
    long countByStatus(GameStatus status);
    long countByCompletedAtAfter(Instant after);
    
    List<GameSession> findByCompletedAtAfterAndStatusOrderByScoreDesc(Instant after, GameStatus status, Pageable pageable);
    List<GameSession> findByCompletedAtAfterAndStatusAndIsDailyOrderByScoreDesc(Instant after, GameStatus status, boolean isDaily, Pageable pageable);
}
