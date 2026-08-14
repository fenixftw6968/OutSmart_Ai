package com.outsmartai.backend.service;

import com.outsmartai.backend.dto.LeaderboardEntry;
import com.outsmartai.backend.model.GameSession;
import com.outsmartai.backend.model.GameStatus;
import com.outsmartai.backend.model.User;
import com.outsmartai.backend.repository.GameSessionRepository;
import com.outsmartai.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;

    public LeaderboardService(UserRepository userRepository, GameSessionRepository gameSessionRepository) {
        this.userRepository = userRepository;
        this.gameSessionRepository = gameSessionRepository;
    }

    public List<LeaderboardEntry> getGlobalLeaderboard(String currentUserId) {
        List<User> users = userRepository.findAllByOrderByTotalScoreDesc(PageRequest.of(0, 50));
        List<LeaderboardEntry> entries = new ArrayList<>();

        long rank = 1;
        boolean currentUserFound = false;

        for (User u : users) {
            boolean isCurrent = currentUserId != null && u.getId().equals(currentUserId);
            if (isCurrent) currentUserFound = true;

            entries.add(new LeaderboardEntry(
                    rank++,
                    u.getId(),
                    u.getUsername(),
                    u.getTotalScore(),
                    u.getRating(),
                    u.getGamesPlayed(),
                    u.getGamesWon(),
                    u.getBestScore(),
                    u.getCurrentStreak(),
                    isCurrent
            ));
        }

        // If current user is not in top 50, compute their rank and append
        if (currentUserId != null && !currentUserFound) {
            userRepository.findById(currentUserId).ifPresent(user -> {
                long userRank = computeGlobalRank(user);
                entries.add(new LeaderboardEntry(
                        userRank,
                        user.getId(),
                        user.getUsername(),
                        user.getTotalScore(),
                        user.getRating(),
                        user.getGamesPlayed(),
                        user.getGamesWon(),
                        user.getBestScore(),
                        user.getCurrentStreak(),
                        true
                ));
            });
        }

        return entries;
    }

    public List<LeaderboardEntry> getWeeklyLeaderboard(String currentUserId) {
        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        List<GameSession> sessions = gameSessionRepository.findByCompletedAtAfterAndStatusOrderByScoreDesc(weekAgo, GameStatus.COMPLETED, PageRequest.of(0, 100));

        return buildLeaderboardFromSessions(sessions, currentUserId);
    }

    public List<LeaderboardEntry> getDailyLeaderboard(String currentUserId) {
        Instant dayAgo = Instant.now().minus(24, ChronoUnit.HOURS);
        List<GameSession> sessions = gameSessionRepository.findByCompletedAtAfterAndStatusOrderByScoreDesc(dayAgo, GameStatus.COMPLETED, PageRequest.of(0, 100));

        return buildLeaderboardFromSessions(sessions, currentUserId);
    }

    private List<LeaderboardEntry> buildLeaderboardFromSessions(List<GameSession> sessions, String currentUserId) {
        Map<String, LeaderboardEntry> userBestMap = new LinkedHashMap<>();

        for (GameSession s : sessions) {
            if (!userBestMap.containsKey(s.getUserId())) {
                boolean isCurrent = currentUserId != null && s.getUserId().equals(currentUserId);
                userBestMap.put(s.getUserId(), new LeaderboardEntry(
                        0,
                        s.getUserId(),
                        s.getUsername(),
                        s.getScore(),
                        0,
                        1,
                        s.getScore() >= 50 ? 1 : 0,
                        s.getScore(),
                        0,
                        isCurrent
                ));
            }
        }

        List<LeaderboardEntry> entries = new ArrayList<>(userBestMap.values());
        long rank = 1;
        for (LeaderboardEntry e : entries) {
            // Populate actual user stats if available
            userRepository.findById(e.getUserId()).ifPresent(u -> {
                e.setCurrentUser(currentUserId != null && u.getId().equals(currentUserId));
            });
            // Assign rank
            try {
                java.lang.reflect.Field f = LeaderboardEntry.class.getDeclaredField("rank");
                f.setAccessible(true);
                f.set(e, rank++);
            } catch (Exception ignored) {}
        }

        return entries;
    }

    private long computeGlobalRank(User targetUser) {
        List<User> topUsers = userRepository.findAllByOrderByTotalScoreDesc(PageRequest.of(0, 1000));
        for (int i = 0; i < topUsers.size(); i++) {
            if (topUsers.get(i).getId().equals(targetUser.getId())) {
                return i + 1;
            }
        }
        return topUsers.size() + 1;
    }
}
