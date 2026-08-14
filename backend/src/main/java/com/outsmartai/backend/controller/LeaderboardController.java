package com.outsmartai.backend.controller;

import com.outsmartai.backend.dto.LeaderboardEntry;
import com.outsmartai.backend.security.UserPrincipal;
import com.outsmartai.backend.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<LeaderboardEntry> entries = leaderboardService.getGlobalLeaderboard(userId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<LeaderboardEntry>> getWeeklyLeaderboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<LeaderboardEntry> entries = leaderboardService.getWeeklyLeaderboard(userId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/daily")
    public ResponseEntity<List<LeaderboardEntry>> getDailyLeaderboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<LeaderboardEntry> entries = leaderboardService.getDailyLeaderboard(userId);
        return ResponseEntity.ok(entries);
    }
}
