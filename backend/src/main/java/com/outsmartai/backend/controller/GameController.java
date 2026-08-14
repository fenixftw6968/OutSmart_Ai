package com.outsmartai.backend.controller;

import com.outsmartai.backend.dto.GameStartRequest;
import com.outsmartai.backend.dto.GameSubmitRequest;
import com.outsmartai.backend.dto.HintResponse;
import com.outsmartai.backend.dto.ResultResponse;
import com.outsmartai.backend.model.GameSession;
import com.outsmartai.backend.security.UserPrincipal;
import com.outsmartai.backend.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public ResponseEntity<GameSession> startGame(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                @RequestBody GameStartRequest request) {
        GameSession session = gameService.startGame(userPrincipal.getId(), request);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameSession> getGameSession(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                       @PathVariable String id) {
        GameSession session = gameService.getGameSession(id, userPrincipal.getId());
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{id}/hint")
    public ResponseEntity<HintResponse> getHint(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                               @PathVariable String id) {
        HintResponse hint = gameService.requestHint(id, userPrincipal.getId());
        return ResponseEntity.ok(hint);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ResultResponse> submitAnswer(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                        @PathVariable String id,
                                                        @Valid @RequestBody GameSubmitRequest request) {
        ResultResponse result = gameService.submitAnswer(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(result);
    }
}
