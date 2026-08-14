package com.outsmartai.backend.controller;

import com.outsmartai.backend.dto.AuthResponse;
import com.outsmartai.backend.dto.LoginRequest;
import com.outsmartai.backend.dto.RegisterRequest;
import com.outsmartai.backend.model.User;
import com.outsmartai.backend.repository.UserRepository;
import com.outsmartai.backend.security.JwtTokenProvider;
import com.outsmartai.backend.security.UserPrincipal;
import com.outsmartai.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken!"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered!"));
        }

        User user = new User(request.getUsername(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        long rank = userService.calculateUserRank(savedUser);

        AuthResponse authResponse = new AuthResponse(
                jwt, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(),
                savedUser.getRating(), savedUser.getTotalScore(), savedUser.getGamesPlayed(),
                savedUser.getBestScore(), savedUser.getCurrentStreak(), rank
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long rank = userService.calculateUserRank(user);

        AuthResponse authResponse = new AuthResponse(
                jwt, user.getId(), user.getUsername(), user.getEmail(),
                user.getRating(), user.getTotalScore(), user.getGamesPlayed(),
                user.getBestScore(), user.getCurrentStreak(), rank
        );

        return ResponseEntity.ok(authResponse);
    }
}
