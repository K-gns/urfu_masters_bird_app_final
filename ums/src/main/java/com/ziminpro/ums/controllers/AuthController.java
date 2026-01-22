package com.ziminpro.ums.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.ziminpro.ums.dao.UmsRepository;
import com.ziminpro.ums.dtos.Constants;
import com.ziminpro.ums.dtos.Roles; // Импорт класса Roles
import com.ziminpro.ums.dtos.User;
import com.ziminpro.ums.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@RestController
public class AuthController {

    @Autowired
    private UmsRepository umsRepository;

    @Autowired
    private JwtService jwtService;


    @RequestMapping(method = RequestMethod.POST, path = "/auth/login")
    public Mono<ResponseEntity<Map<String, Object>>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        User user = umsRepository.findUserByEmailAndPassword(email, password);
        Map<String, Object> response = new HashMap<>(); // Создаем ответ локально

        if (user.getId() != null) {
            String token = jwtService.generateToken(user);

            Map<String, Object> tokenData = new HashMap<>();
            tokenData.put("token", token);
            tokenData.put("expire", jwtService.getExpirationTime());

            tokenData.put("id", user.getId().toString());
            tokenData.put("email", user.getEmail());
            List<String> roles = user.getRoles().stream()
                    .map(Roles::getRole)
                    .collect(Collectors.toList());
            tokenData.put("roles", roles);
            // ------------------

            response.put(Constants.CODE, "200");
            response.put(Constants.MESSAGE, "Login successful");
            response.put(Constants.DATA, tokenData);
        } else {
            response.put(Constants.CODE, "401");
            response.put(Constants.MESSAGE, "Invalid credentials");
            response.put(Constants.DATA, new HashMap<>());
        }
        return Mono.just(ResponseEntity.ok().header(Constants.CONTENT_TYPE, Constants.APPLICATION_JSON)
                .header(Constants.ACCEPT, Constants.APPLICATION_JSON).body(response));
    }
}