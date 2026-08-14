package com.outsmartai.backend.controller;

import com.outsmartai.backend.dto.DailyChallengeStatusResponse;
import com.outsmartai.backend.dto.LiveStatsResponse;
import com.outsmartai.backend.dto.ResultResponse;
import com.outsmartai.backend.security.UserPrincipal;
import com.outsmartai.backend.service.GameService;
import com.outsmartai.backend.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatsController {

    private final StatsService statsService;
    private final GameService gameService;

    public StatsController(StatsService statsService, GameService gameService) {
        this.statsService = statsService;
        this.gameService = gameService;
    }

    @GetMapping("/api/stats/live")
    public ResponseEntity<LiveStatsResponse> getLiveStats() {
        return ResponseEntity.ok(statsService.getLiveStats());
    }

    @GetMapping("/api/daily-challenge")
    public ResponseEntity<DailyChallengeStatusResponse> getDailyChallengeStatus(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(statsService.getDailyChallengeStatus(userId));
    }

    @GetMapping("/api/results/{id}")
    public ResponseEntity<ResultResponse> getPublicResult(@PathVariable String id) {
        return ResponseEntity.ok(gameService.getResultById(id));
    }
}
