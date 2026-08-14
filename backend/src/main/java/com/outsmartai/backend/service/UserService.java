package com.outsmartai.backend.service;

import com.outsmartai.backend.dto.UserProfileResponse;
import com.outsmartai.backend.model.GameSession;
import com.outsmartai.backend.model.User;
import com.outsmartai.backend.repository.GameSessionRepository;
import com.outsmartai.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;

    public UserService(UserRepository userRepository, GameSessionRepository gameSessionRepository) {
        this.userRepository = userRepository;
        this.gameSessionRepository = gameSessionRepository;
    }

    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRating(user.getRating());
        response.setTotalScore(user.getTotalScore());
        response.setGamesPlayed(user.getGamesPlayed());
        response.setGamesWon(user.getGamesWon());
        response.setWinRate(user.getGamesPlayed() > 0 ? (double) user.getGamesWon() / user.getGamesPlayed() * 100 : 0.0);
        response.setBestScore(user.getBestScore());
        response.setCurrentStreak(user.getCurrentStreak());
        response.setBestStreak(user.getBestStreak());

        long globalRank = calculateUserRank(user);
        response.setGlobalRank(globalRank);

        boolean dailyDone = user.getLastDailyChallengeDate() != null && user.getLastDailyChallengeDate().equals(LocalDate.now());
        response.setDailyChallengeCompletedToday(dailyDone);

        List<GameSession> recentGames = gameSessionRepository.findByUserIdOrderByStartedAtDesc(userId, PageRequest.of(0, 10));
        response.setRecentGames(recentGames);

        return response;
    }

    public long calculateUserRank(User user) {
        List<User> topUsers = userRepository.findAllByOrderByTotalScoreDesc(PageRequest.of(0, 1000));
        for (int i = 0; i < topUsers.size(); i++) {
            if (topUsers.get(i).getId().equals(user.getId())) {
                return i + 1;
            }
        }
        return topUsers.size() + 1;
    }
}
